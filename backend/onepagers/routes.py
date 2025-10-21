"""
One-Pager Routes
================

API endpoints for one-pager creation and iteration:
- POST /onepagers - Create new one-pager with AI generation
- GET /onepagers - List user's one-pagers
- GET /onepagers/{id} - Get specific one-pager
- PUT /onepagers/{id}/iterate - Iterative refinement with feedback
- DELETE /onepagers/{id} - Delete one-pager
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
from bson import ObjectId
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

from backend.onepagers.schemas import (
    OnePagerCreate,
    OnePagerIterate,
    OnePagerContentUpdate,
    OnePagerResponse,
    OnePagerSummary,
    OnePagerStatus,
    OnePagerContent,
    ContentSection
)
from backend.models.onepager import onepager_helper, onepager_summary_helper
from backend.models.user import UserInDB
from backend.auth.dependencies import get_current_active_user
from backend.database.mongodb import get_db
from backend.auth.schemas import ErrorResponse
from backend.services.ai_service import ai_service
from backend.config import settings

router = APIRouter(prefix="/onepagers", tags=["One-Pagers"])


@router.post(
    "",
    response_model=OnePagerResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request data"}
    }
)
async def create_onepager(
    onepager_data: OnePagerCreate,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Create a new one-pager with AI-generated initial wireframe.

    Generates a basic layout using AI based on the user's prompt,
    optionally incorporating brand kit styling.

    **Request Body:**
    - title: One-pager title (required)
    - input_prompt: Description for AI generation (required, 10-2000 chars)
    - brand_kit_id: Reference to brand kit (optional)
    - target_audience: Target audience description (optional)

    **Returns:**
    - Created one-pager with wireframe layout and content

    **Errors:**
    - 400: Invalid input data
    - 404: Brand kit not found (if brand_kit_id provided)
    """
    # Fetch brand kit if provided
    brand_context = None
    brand_kit_id_obj = None
    brand_kit = None

    if onepager_data.brand_kit_id:
        if not ObjectId.is_valid(onepager_data.brand_kit_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid brand kit ID format"
            )

        brand_kit = await db.brand_kits.find_one({
            "_id": ObjectId(onepager_data.brand_kit_id),
            "user_id": ObjectId(current_user.id),
            "is_active": True
        })

        if not brand_kit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Brand kit not found or not accessible"
            )

        brand_kit_id_obj = ObjectId(onepager_data.brand_kit_id)
        brand_context = {
            "company_name": brand_kit.get("company_name"),
            "brand_voice": brand_kit.get("brand_voice"),
            "color_palette": brand_kit.get("color_palette"),
            "typography": brand_kit.get("typography")
        }

    # Validate product_id if provided and belongs to the brand kit
    product_data = None
    if onepager_data.product_id and brand_kit:
        products = brand_kit.get("products", [])
        product_data = next((p for p in products if p.get("id") == onepager_data.product_id), None)
        if not product_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID '{onepager_data.product_id}' not found in Brand Kit"
            )

    # Generate initial wireframe using AI (if input_prompt provided)
    wireframe_data = {}
    if onepager_data.input_prompt:
        wireframe_data = await ai_service.generate_initial_wireframe(
            user_prompt=onepager_data.input_prompt,
            brand_context=brand_context,
            target_audience=onepager_data.target_audience
        )

    # Build content sections from structured data
    sections = []

    # If AI generated sections, use those
    if wireframe_data.get("sections"):
        sections = [ContentSection(**section) for section in wireframe_data["sections"]]
    else:
        # Otherwise, build sections from structured form data
        section_order = 0

        # Hero section with problem
        if onepager_data.problem:
            section_order += 1
            sections.append(ContentSection(
                id=f"section-hero-{section_order}",
                type="hero",
                title="The Challenge",
                content=onepager_data.problem,
                order=section_order
            ))

        # Solution section
        if onepager_data.solution:
            section_order += 1
            sections.append(ContentSection(
                id=f"section-solution-{section_order}",
                type="text",
                title="Our Solution",
                content=onepager_data.solution,
                order=section_order
            ))

        # Features list
        if onepager_data.features:
            section_order += 1
            sections.append(ContentSection(
                id=f"section-features-{section_order}",
                type="list",
                title="Key Features",
                content=onepager_data.features,
                order=section_order
            ))

        # Benefits list
        if onepager_data.benefits:
            section_order += 1
            sections.append(ContentSection(
                id=f"section-benefits-{section_order}",
                type="list",
                title="Benefits",
                content=onepager_data.benefits,
                order=section_order
            ))

        # Integrations (if provided)
        if onepager_data.integrations:
            section_order += 1
            sections.append(ContentSection(
                id=f"section-integrations-{section_order}",
                type="list",
                title="Integrations",
                content=onepager_data.integrations,
                order=section_order
            ))

        # Social proof (if provided)
        if onepager_data.social_proof:
            section_order += 1
            sections.append(ContentSection(
                id=f"section-social-{section_order}",
                type="text",
                title="What Our Customers Say",
                content=onepager_data.social_proof,
                order=section_order
            ))

        # CTA button
        if onepager_data.cta:
            section_order += 1
            sections.append(ContentSection(
                id=f"section-cta-{section_order}",
                type="button",
                title=None,
                content={
                    "text": onepager_data.cta.text,
                    "url": onepager_data.cta.url
                },
                order=section_order
            ))

    # Build content from form data (prioritize form data over AI-generated)
    content = OnePagerContent(
        headline=wireframe_data.get("headline", onepager_data.title),
        subheadline=wireframe_data.get("subheadline"),
        sections=sections,
        problem=onepager_data.problem,
        solution=onepager_data.solution,
        features=onepager_data.features,
        benefits=onepager_data.benefits,
        integrations=onepager_data.integrations or [],
        social_proof=onepager_data.social_proof,
        cta=onepager_data.cta.model_dump() if onepager_data.cta else None,
        visuals=[visual.model_dump() for visual in onepager_data.visuals]
    )

    # Create basic layout blocks from sections
    layout = [
        {
            "block_id": f"block-{section['id']}",
            "type": section["type"],
            "position": {"x": 0, "y": idx * 100},
            "size": {"width": "100%", "height": "auto"},
            "order": section["order"]
        }
        for idx, section in enumerate(wireframe_data.get("sections", []))
    ]

    # Create one-pager document
    now = datetime.now(timezone.utc)
    onepager_doc = {
        "user_id": ObjectId(current_user.id),
        "brand_kit_id": brand_kit_id_obj,
        "title": onepager_data.title,
        "status": OnePagerStatus.WIREFRAME.value,
        "content": content.model_dump(),
        "layout": layout,
        "style_overrides": {},
        "generation_metadata": {
            "prompts": [onepager_data.input_prompt] if onepager_data.input_prompt else [],
            "iterations": 0,
            "ai_model": settings.ai_model_name,
            "last_generated_at": now,
            "product_id": onepager_data.product_id
        },
        "version_history": [],
        "pdf_template": "minimalist",  # Default PDF template
        "created_at": now,
        "updated_at": now,
        "last_accessed": now
    }

    # Insert into database
    result = await db.onepagers.insert_one(onepager_doc)
    onepager_doc["_id"] = result.inserted_id

    # Return one-pager
    return OnePagerResponse(**onepager_helper(onepager_doc))


@router.get(
    "",
    response_model=List[OnePagerSummary],
    responses={
        400: {"model": ErrorResponse, "description": "Invalid query parameters"}
    }
)
async def list_onepagers(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of records to return"),
    status: Optional[OnePagerStatus] = Query(None, description="Filter by status"),
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    List user's one-pagers with pagination and filtering.

    Returns a paginated list of one-pager summaries (without full content).

    **Query Parameters:**
    - skip: Number of records to skip (default: 0)
    - limit: Maximum records to return (default: 20, max: 100)
    - status: Filter by status (draft, wireframe, styled, final)

    **Returns:**
    - List of one-pager summaries

    **Errors:**
    - 400: Invalid query parameters
    """
    # Build query
    query = {"user_id": ObjectId(current_user.id)}

    if status:
        query["status"] = status.value

    # Fetch one-pagers with pagination
    cursor = db.onepagers.find(query).sort("created_at", -1).skip(skip).limit(limit)

    onepagers = await cursor.to_list(length=limit)

    # Convert to summaries
    summaries = [OnePagerSummary(**onepager_summary_helper(op)) for op in onepagers]

    return summaries


@router.get(
    "/{onepager_id}",
    response_model=OnePagerResponse,
    responses={
        404: {"model": ErrorResponse, "description": "One-pager not found"},
        403: {"model": ErrorResponse, "description": "Not authorized to access this one-pager"}
    }
)
async def get_onepager(
    onepager_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get a specific one-pager by ID.

    Returns full one-pager document with all content, layout, and metadata.
    Requires ownership verification.

    **Path Parameters:**
    - onepager_id: MongoDB ObjectId of the one-pager

    **Returns:**
    - Full one-pager document

    **Errors:**
    - 404: One-pager not found
    - 403: User doesn't own this one-pager
    """
    # Validate ObjectId format
    if not ObjectId.is_valid(onepager_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid one-pager ID format"
        )

    # Find one-pager
    onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    if not onepager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One-pager not found"
        )

    # Verify ownership
    if str(onepager["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this one-pager"
        )

    # Update last_accessed timestamp
    await db.onepagers.update_one(
        {"_id": ObjectId(onepager_id)},
        {"$set": {"last_accessed": datetime.now(timezone.utc)}}
    )

    return OnePagerResponse(**onepager_helper(onepager))


@router.patch(
    "/{onepager_id}",
    response_model=OnePagerResponse,
    responses={
        404: {"model": ErrorResponse, "description": "One-pager not found"},
        403: {"model": ErrorResponse, "description": "Not authorized to update this one-pager"}
    }
)
async def update_onepager(
    onepager_id: str,
    brand_kit_id: Optional[str] = None,
    pdf_template: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Update one-pager metadata (like brand_kit_id, pdf_template).

    Simple endpoint for updating basic metadata without triggering AI.
    """
    # Validate ObjectId format
    if not ObjectId.is_valid(onepager_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid one-pager ID format"
        )

    # Find one-pager
    onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    if not onepager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One-pager not found"
        )

    # Verify ownership
    if str(onepager["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this one-pager"
        )

    # Build update document
    update_doc = {"updated_at": datetime.now(timezone.utc)}

    if brand_kit_id is not None:
        if brand_kit_id == "":
            # Remove brand kit
            update_doc["brand_kit_id"] = None
        else:
            # Validate brand kit ID and ownership
            if not ObjectId.is_valid(brand_kit_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid brand kit ID format"
                )

            brand_kit = await db.brand_kits.find_one({
                "_id": ObjectId(brand_kit_id),
                "user_id": ObjectId(current_user.id),
                "is_active": True
            })

            if not brand_kit:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Brand kit not found or not accessible"
                )

            update_doc["brand_kit_id"] = ObjectId(brand_kit_id)

    if pdf_template is not None:
        # Validate pdf_template value
        valid_templates = ["minimalist", "bold", "business", "product"]
        if pdf_template not in valid_templates:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid pdf_template. Must be one of: {', '.join(valid_templates)}"
            )
        update_doc["pdf_template"] = pdf_template

    # Update in database
    await db.onepagers.update_one(
        {"_id": ObjectId(onepager_id)},
        {"$set": update_doc}
    )

    # Fetch updated document
    updated_onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    return OnePagerResponse(**onepager_helper(updated_onepager))


@router.patch(
    "/{onepager_id}/content",
    response_model=OnePagerResponse,
    responses={
        404: {"model": ErrorResponse, "description": "One-pager not found"},
        403: {"model": ErrorResponse, "description": "Not authorized to update this one-pager"}
    }
)
async def update_onepager_content(
    onepager_id: str,
    content_update: OnePagerContentUpdate,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Directly update one-pager content (sections, headline, subheadline).

    This endpoint allows direct manipulation of sections without AI processing.
    Useful for drag-and-drop reordering, inline editing, and section deletion.

    **Path Parameters:**
    - onepager_id: MongoDB ObjectId of the one-pager

    **Request Body:**
    - sections: Updated sections array (optional)
    - headline: Updated headline (optional)
    - subheadline: Updated subheadline (optional)

    **Returns:**
    - Updated one-pager document

    **Errors:**
    - 404: One-pager not found
    - 403: User doesn't own this one-pager
    """
    # Validate ObjectId format
    if not ObjectId.is_valid(onepager_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid one-pager ID format"
        )

    # Find one-pager
    onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    if not onepager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One-pager not found"
        )

    # Verify ownership
    if str(onepager["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this one-pager"
        )

    # Build update document
    now = datetime.now(timezone.utc)
    update_doc = {"updated_at": now}

    # Update sections if provided
    if content_update.sections is not None:
        # Convert Pydantic models to dicts
        sections_data = [section.model_dump() for section in content_update.sections]
        update_doc["content.sections"] = sections_data

    # Update headline if provided
    if content_update.headline is not None:
        update_doc["content.headline"] = content_update.headline

    # Update subheadline if provided
    if content_update.subheadline is not None:
        update_doc["content.subheadline"] = content_update.subheadline

    # Update in database
    await db.onepagers.update_one(
        {"_id": ObjectId(onepager_id)},
        {"$set": update_doc}
    )

    # Fetch updated document
    updated_onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    return OnePagerResponse(**onepager_helper(updated_onepager))


@router.put(
    "/{onepager_id}/iterate",
    response_model=OnePagerResponse,
    responses={
        404: {"model": ErrorResponse, "description": "One-pager not found"},
        403: {"model": ErrorResponse, "description": "Not authorized to update this one-pager"}
    }
)
async def iterate_onepager(
    onepager_id: str,
    iteration_data: OnePagerIterate,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Iteratively refine one-pager based on user feedback.

    Supports multiple modes of refinement:
    - AI-guided refinement via feedback text
    - Direct layout modifications
    - Style override updates
    - Brand styling toggle

    **Path Parameters:**
    - onepager_id: MongoDB ObjectId of the one-pager

    **Request Body (all optional):**
    - feedback: Natural language feedback for AI refinement
    - layout_changes: Direct layout block modifications
    - style_overrides: Style override updates
    - apply_brand_styles: Toggle styled mode (default: false)

    **Returns:**
    - Updated one-pager document

    **Errors:**
    - 404: One-pager not found
    - 403: User doesn't own this one-pager
    """
    # Validate ObjectId format
    if not ObjectId.is_valid(onepager_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid one-pager ID format"
        )

    # Find one-pager
    onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    if not onepager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One-pager not found"
        )

    # Verify ownership
    if str(onepager["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this one-pager"
        )

    # Build update document
    now = datetime.now(timezone.utc)
    update_doc = {"updated_at": now}

    # Handle AI-guided refinement via feedback
    if iteration_data.feedback:
        # Fetch brand kit for context
        brand_context = None
        if onepager.get("brand_kit_id"):
            brand_kit = await db.brand_kits.find_one({"_id": onepager["brand_kit_id"]})
            if brand_kit:
                brand_context = {
                    "company_name": brand_kit.get("company_name"),
                    "brand_voice": brand_kit.get("brand_voice"),
                    "color_palette": brand_kit.get("color_palette")
                }

        # Determine which AI method to call based on iteration_type
        iteration_type = iteration_data.iteration_type

        if iteration_type in ["layout", "both"]:
            # Use new refine_onepager_with_design for layout iteration
            from backend.models.onepager import LayoutParams, validate_layout_params

            # Get current layout params or None
            current_layout_params = None
            if onepager.get("layout_params"):
                current_layout_params = validate_layout_params(onepager["layout_params"])

            # Call AI service for content + design refinement
            refined_data = await ai_service.refine_onepager_with_design(
                current_content=onepager["content"],
                current_layout_params=current_layout_params,
                user_feedback=iteration_data.feedback,
                brand_context=brand_context
            )

            logger.info(f"🎨 AI design refinement response: {list(refined_data.keys())}")

            # Update content
            if "content" in refined_data:
                content_data = refined_data["content"]
                if "headline" in content_data:
                    update_doc["content.headline"] = content_data["headline"]
                if "subheadline" in content_data:
                    update_doc["content.subheadline"] = content_data.get("subheadline")
                if "sections" in content_data:
                    logger.info(f"🔍 AI returned {len(content_data['sections'])} sections")
                    update_doc["content.sections"] = content_data["sections"]

            # Update layout parameters
            if "layout_params" in refined_data:
                update_doc["layout_params"] = refined_data["layout_params"]
                logger.info(f"🎨 Layout params updated")

            # Update design rationale
            if "design_rationale" in refined_data:
                update_doc["design_rationale"] = refined_data["design_rationale"]
                logger.info(f"💡 Design rationale: {refined_data['design_rationale'][:100]}...")

        else:
            # Use original refine_layout for content-only iteration
            refined_data = await ai_service.refine_layout(
                current_layout={
                    "content": onepager["content"],
                    "layout": onepager.get("layout", [])
                },
                user_feedback=iteration_data.feedback,
                brand_context=brand_context
            )

            logger.info(f"🤖 AI refinement response structure: {list(refined_data.keys())}")

            # Update content from AI response
            if "content" in refined_data:
                content_data = refined_data["content"]
                if "headline" in content_data:
                    update_doc["content.headline"] = content_data["headline"]
                if "subheadline" in content_data:
                    update_doc["content.subheadline"] = content_data.get("subheadline")
                if "sections" in content_data:
                    logger.info(f"🔍 AI returned {len(content_data['sections'])} sections")
                    update_doc["content.sections"] = content_data["sections"]
            # Fallback: check top level
            elif "sections" in refined_data:
                logger.info(f"🔍 AI returned {len(refined_data['sections'])} sections")
                update_doc["content.sections"] = refined_data["sections"]

        # Update generation metadata
        update_doc["generation_metadata.prompts"] = onepager["generation_metadata"]["prompts"] + [iteration_data.feedback]
        update_doc["generation_metadata.iterations"] = onepager["generation_metadata"].get("iterations", 0) + 1
        update_doc["generation_metadata.last_generated_at"] = now

    # Note: layout_changes, style_overrides, and apply_brand_styles
    # are not currently part of OnePagerIterate schema, so we skip them

    # Update in database first
    await db.onepagers.update_one(
        {"_id": ObjectId(onepager_id)},
        {"$set": update_doc}
    )

    # Fetch updated document
    updated_onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    # Create version snapshot with UPDATED content and layout_params
    version_snapshot = {
        "version": len(onepager.get("version_history", [])) + 1,
        "content": updated_onepager["content"],  # Use updated content
        "layout": updated_onepager.get("layout", []),
        "layout_params": updated_onepager.get("layout_params"),  # Include layout parameters
        "created_at": now,
        "change_description": iteration_data.feedback[:200] if iteration_data.feedback else "Manual update"
    }

    # Add version to history
    await db.onepagers.update_one(
        {"_id": ObjectId(onepager_id)},
        {"$push": {"version_history": version_snapshot}}
    )

    # Fetch final document with version history
    final_onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    return OnePagerResponse(**onepager_helper(final_onepager))


@router.post(
    "/{onepager_id}/suggest-layout",
    response_model=Dict[str, Any],
    responses={
        404: {"model": ErrorResponse, "description": "One-pager not found"},
        403: {"model": ErrorResponse, "description": "Not authorized to access this one-pager"}
    }
)
async def suggest_layout_params(
    onepager_id: str,
    design_goal: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get AI suggestions for layout parameters WITHOUT modifying the one-pager.

    Analyzes current content and suggests optimal layout parameters
    (spacing, typography, colors, section layouts). Does NOT apply changes
    automatically - user must explicitly apply suggested parameters.

    **Path Parameters:**
    - onepager_id: MongoDB ObjectId of the one-pager

    **Query Parameters:**
    - design_goal: Optional design goal (e.g., "modern", "compact", "bold")

    **Returns:**
    - suggested_layout_params: Suggested LayoutParams object
    - design_rationale: AI's explanation for suggestions

    **Errors:**
    - 404: One-pager not found
    - 403: User doesn't own this one-pager
    """
    # Validate ObjectId format
    if not ObjectId.is_valid(onepager_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid one-pager ID format"
        )

    # Find one-pager
    onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    if not onepager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One-pager not found"
        )

    # Verify ownership
    if str(onepager["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this one-pager"
        )

    # Fetch brand kit for context
    brand_context = None
    if onepager.get("brand_kit_id"):
        brand_kit = await db.brand_kits.find_one({"_id": onepager["brand_kit_id"]})
        if brand_kit:
            brand_context = {
                "company_name": brand_kit.get("company_name"),
                "brand_voice": brand_kit.get("brand_voice"),
                "color_palette": brand_kit.get("color_palette")
            }

    # Get current layout params
    from backend.models.onepager import validate_layout_params

    current_layout_params = None
    if onepager.get("layout_params"):
        current_layout_params = validate_layout_params(onepager["layout_params"])

    # Call AI service for layout suggestions
    suggestion_result = await ai_service.suggest_layout(
        current_content=onepager["content"],
        current_layout_params=current_layout_params,
        brand_context=brand_context,
        design_goal=design_goal
    )

    logger.info(f"💡 AI layout suggestion generated for onepager {onepager_id}")

    return suggestion_result


@router.patch(
    "/{onepager_id}/layout-params",
    response_model=OnePagerResponse,
    responses={
        404: {"model": ErrorResponse, "description": "One-pager not found"},
        403: {"model": ErrorResponse, "description": "Not authorized"},
        400: {"model": ErrorResponse, "description": "Invalid layout parameters"}
    }
)
async def update_layout_params(
    onepager_id: str,
    layout_params: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Directly update layout parameters WITHOUT AI generation.

    This endpoint allows manual/user-driven layout parameter updates.
    Use this when applying user-edited parameters from the UI.
    """
    from backend.models.onepager import validate_layout_params

    # Validate ObjectId
    try:
        onepager_oid = ObjectId(onepager_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid onepager ID format")

    # Fetch onepager
    onepager = await db.onepagers.find_one({"_id": onepager_oid})
    if not onepager:
        raise HTTPException(status_code=404, detail="One-pager not found")

    # Verify ownership
    if str(onepager["user_id"]) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this one-pager")

    # Validate layout params
    validated_params = validate_layout_params(layout_params)
    if not validated_params:
        raise HTTPException(status_code=400, detail="Invalid layout parameters")

    # Update onepager
    now = datetime.now(timezone.utc).isoformat()
    update_doc = {
        "$set": {
            "layout_params": validated_params.dict(),
            "updated_at": now
        }
    }

    await db.onepagers.update_one({"_id": onepager_oid}, update_doc)

    # Fetch updated onepager
    updated_onepager = await db.onepagers.find_one({"_id": onepager_oid})

    logger.info(f"✅ Layout params updated directly for onepager {onepager_id}")

    return onepager_helper(updated_onepager)


@router.post(
    "/{onepager_id}/restore/{version}",
    response_model=OnePagerResponse,
    responses={
        404: {"model": ErrorResponse, "description": "One-pager or version not found"},
        403: {"model": ErrorResponse, "description": "Not authorized to restore this one-pager"}
    }
)
async def restore_onepager_version(
    onepager_id: str,
    version: int,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Restore a one-pager to a previous version from version history.

    Reverts the one-pager's content and layout to a specific version snapshot.
    Creates a new version snapshot documenting the restore action.

    **Path Parameters:**
    - onepager_id: MongoDB ObjectId of the one-pager
    - version: Version number to restore to

    **Returns:**
    - Updated one-pager with restored content

    **Errors:**
    - 404: One-pager or version not found
    - 403: User doesn't own this one-pager
    """
    # Validate ObjectId format
    if not ObjectId.is_valid(onepager_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid one-pager ID format"
        )

    # Find one-pager
    onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    if not onepager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One-pager not found"
        )

    # Verify ownership
    if str(onepager["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to restore this one-pager"
        )

    # Find the version snapshot
    version_history = onepager.get("version_history", [])
    version_snapshot = next((v for v in version_history if v["version"] == version), None)

    if not version_snapshot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version {version} not found in version history"
        )

    # Build update document with restored content
    now = datetime.now(timezone.utc)
    update_doc = {
        "content": version_snapshot["content"],
        "layout": version_snapshot["layout"],
        "updated_at": now
    }

    # Restore layout_params if present in snapshot
    if "layout_params" in version_snapshot:
        update_doc["layout_params"] = version_snapshot["layout_params"]

    # Update in database
    await db.onepagers.update_one(
        {"_id": ObjectId(onepager_id)},
        {"$set": update_doc}
    )

    # Fetch updated document
    updated_onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    # Create new version snapshot for the restore action
    restore_snapshot = {
        "version": len(version_history) + 1,
        "content": version_snapshot["content"],
        "layout": version_snapshot["layout"],
        "layout_params": version_snapshot.get("layout_params"),  # Include layout params in snapshot
        "created_at": now,
        "change_description": f"Restored to version {version}"
    }

    # Add restore snapshot to history
    await db.onepagers.update_one(
        {"_id": ObjectId(onepager_id)},
        {"$push": {"version_history": restore_snapshot}}
    )

    # Fetch final document with updated history
    final_onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    return OnePagerResponse(**onepager_helper(final_onepager))


@router.delete(
    "/{onepager_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        404: {"model": ErrorResponse, "description": "One-pager not found"},
        403: {"model": ErrorResponse, "description": "Not authorized to delete this one-pager"}
    }
)
async def delete_onepager(
    onepager_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Delete a one-pager.

    Permanently removes the one-pager from the database.

    **Path Parameters:**
    - onepager_id: MongoDB ObjectId of the one-pager

    **Returns:**
    - 204 No Content on success

    **Errors:**
    - 404: One-pager not found
    - 403: User doesn't own this one-pager
    """
    # Validate ObjectId format
    if not ObjectId.is_valid(onepager_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid one-pager ID format"
        )

    # Find one-pager
    onepager = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    if not onepager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One-pager not found"
        )

    # Verify ownership
    if str(onepager["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this one-pager"
        )

    # Hard delete
    await db.onepagers.delete_one({"_id": ObjectId(onepager_id)})

    return None  # 204 No Content


@router.get(
    "/{onepager_id}/preview/html",
    tags=["One-Pagers", "Preview"],
    summary="Preview one-pager HTML (for PDF preview)",
    responses={
        200: {
            "content": {"text/html": {}},
            "description": "HTML preview with Brand Kit styling (same as PDF export)"
        },
        404: {"model": ErrorResponse, "description": "One-pager or Brand Kit not found"},
        403: {"model": ErrorResponse, "description": "User doesn't own this one-pager"}
    }
)
async def preview_onepager_html(
    onepager_id: str,
    template: str = Query(
        "minimalist",
        enum=["minimalist", "bold", "business", "product"],
        description="Template style to preview"
    ),
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Generate HTML preview of one-pager with PDF styling.

    Returns the exact HTML that would be used for PDF generation,
    allowing frontend to preview the final PDF appearance in an iframe.

    **Query Parameters:**
    - template: Template style (minimalist, bold, business, product) - default: minimalist

    **Returns:**
    - HTML string with Brand Kit styling applied

    **Use Case:**
    - Display in iframe for WYSIWYG PDF preview
    - Show actual PDF appearance in Styled mode
    """
    from fastapi.responses import HTMLResponse
    import logging
    from backend.services.pdf_html_generator import PDFHTMLGenerator
    from backend.models.onepager import OnePagerLayout
    from backend.models.brand_kit import BrandKitInDB

    logger = logging.getLogger(__name__)

    # Validate ObjectId format
    if not ObjectId.is_valid(onepager_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid one-pager ID format"
        )

    # Fetch one-pager
    logger.info(f"Fetching onepager {onepager_id} for HTML preview")
    onepager_doc = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    if not onepager_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One-pager not found"
        )

    # Verify ownership
    if str(onepager_doc["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to preview this one-pager"
        )

    # Fetch Brand Kit if associated
    brand_kit_doc = None
    if onepager_doc.get("brand_kit_id"):
        brand_kit_doc = await db.brand_kits.find_one({
            "_id": onepager_doc["brand_kit_id"]
        })

        if not brand_kit_doc:
            logger.warning(f"Brand Kit {onepager_doc['brand_kit_id']} not found, using defaults")

    # Use default brand kit if not found
    if not brand_kit_doc:
        brand_kit_doc = {
            "_id": ObjectId(),
            "user_id": onepager_doc["user_id"],
            "company_name": onepager_doc.get("title", "Company"),
            "brand_voice": "Professional and engaging",
            "color_palette": {
                "primary": "#0ea5e9",
                "secondary": "#64748b",
                "accent": "#10b981",
                "text": "#1f2937",
                "background": "#ffffff"
            },
            "typography": {
                "heading_font": "Montserrat",
                "body_font": "Inter",
                "heading_size": "32px",
                "body_size": "16px"
            },
            "is_active": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }

    try:
        # Convert documents to Pydantic models (same logic as PDF export)
        onepager_layout_data = {
            "title": onepager_doc.get("title", "Untitled"),
            "elements": [],
            "version": 1,
            "dimensions": {"width": 1080, "height": 1920, "unit": "px"}
        }

        # Map content sections to elements
        has_hero_section = False
        if "content" in onepager_doc and "sections" in onepager_doc["content"]:
            for idx, section in enumerate(onepager_doc["content"]["sections"]):
                section_type = section.get("type", "text_block")
                section_content = section.get("content", {})

                # Handle hero type: convert string content to proper dict format
                if section_type == "hero" and isinstance(section_content, str):
                    section_content = {
                        "headline": onepager_doc["content"].get("headline", section.get("title", "")),
                        "subheadline": onepager_doc["content"].get("subheadline", ""),
                        "description": section_content
                    }
                    has_hero_section = True

                element = {
                    "id": section.get("id", f"section-{idx}"),
                    "type": section_type,
                    "title": section.get("title"),
                    "content": section_content,
                    "styling": section.get("styling"),
                    "order": section.get("order", idx)
                }
                onepager_layout_data["elements"].append(element)

                if section_type == "hero":
                    has_hero_section = True

        # Add headline as hero element if exists and no hero section already present
        if not has_hero_section and "content" in onepager_doc and "headline" in onepager_doc["content"]:
            hero_element = {
                "id": "hero-main",
                "type": "hero",
                "content": {
                    "headline": onepager_doc["content"]["headline"],
                    "subheadline": onepager_doc["content"].get("subheadline"),
                    "description": onepager_doc["content"].get("description", "")
                },
                "order": 0
            }
            onepager_layout_data["elements"].insert(0, hero_element)

        # Normalize order values
        for idx, element in enumerate(onepager_layout_data["elements"]):
            element["order"] = idx

        onepager = OnePagerLayout(**onepager_layout_data)
        brand_kit = BrandKitInDB(**brand_kit_doc)

        # Extract layout_params from database (if exists)
        layout_params = onepager_doc.get("layout_params", {})

        # Use pdf_template from database, fall back to query parameter
        selected_template = onepager_doc.get("pdf_template") or template or "minimalist"

        # Generate HTML with Brand Kit styling
        logger.info(f"Generating HTML preview with template: {selected_template}")
        html_generator = PDFHTMLGenerator()
        html = html_generator.generate_html(onepager, brand_kit, template_name=selected_template, layout_params=layout_params)

        # Add preview-specific CSS overrides to remove height constraints
        preview_css = """
        <style>
            /* Preview Mode Overrides - Remove fixed heights for scrollable preview */
            body {
                height: auto !important;
                min-height: 11in !important;
                overflow: visible !important;
            }
            .page-container {
                height: auto !important;
                min-height: 11in !important;
                overflow: visible !important;
            }
        </style>
        """

        # Inject preview CSS before closing </head> tag
        html = html.replace('</head>', preview_css + '</head>')

        logger.info(f"✅ HTML preview generated successfully ({len(html)} characters)")

        # Return HTML for iframe display
        return HTMLResponse(content=html, status_code=200)

    except Exception as e:
        logger.error(f"HTML preview generation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"HTML preview generation failed: {str(e)}"
        )


@router.get(
    "/{onepager_id}/export/pdf",
    tags=["One-Pagers", "Export"],
    summary="Export one-pager as PDF",
    responses={
        200: {
            "content": {"application/pdf": {}},
            "description": "PDF file download with Brand Kit styling applied"
        },
        404: {"model": ErrorResponse, "description": "One-pager or Brand Kit not found"},
        403: {"model": ErrorResponse, "description": "User doesn't own this one-pager"}
    }
)
async def export_onepager_pdf(
    onepager_id: str,
    format: str = Query(
        "letter",
        enum=["letter", "a4", "tabloid"],
        description="Page format: letter (8.5×11\"), a4 (8.27×11.69\"), or tabloid (11×17\")"
    ),
    template: str = Query(
        "minimalist",
        enum=["minimalist", "bold", "business", "product"],
        description="Template style: minimalist (clean 2-column), bold (diagonal/asymmetric), business (data-focused grid), product (visual showcase)"
    ),
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Export one-pager as PDF with automatic Brand Kit styling.

    Generates a print-quality PDF using the in-house PDF engine:
    1. Fetches onepager and validates ownership
    2. Retrieves associated Brand Kit
    3. Generates styled HTML with brand colors/fonts
    4. Converts to PDF using Puppeteer
    5. Returns as downloadable file

    **Query Parameters:**
    - format: Page format (letter, a4, tabloid) - default: letter

    **Returns:**
    - PDF file with Brand Kit styling applied
    - Selectable text (not rasterized images)
    - Optimized for printing and digital sharing

    **Errors:**
    - 400: Invalid one-pager ID format
    - 403: User doesn't own this one-pager
    - 404: One-pager or Brand Kit not found
    - 500: PDF generation failed

    **Example:**
    ```
    GET /api/v1/onepagers/507f1f77bcf86cd799439011/export/pdf?format=a4
    Authorization: Bearer <token>
    ```
    """
    from fastapi.responses import StreamingResponse
    import io
    import logging
    from backend.services.pdf_html_generator import PDFHTMLGenerator
    from backend.services.pdf_generator import PDFGenerator
    from backend.models.onepager import OnePagerLayout
    from backend.models.brand_kit import BrandKitInDB

    logger = logging.getLogger(__name__)
    
    # Validate ObjectId format
    if not ObjectId.is_valid(onepager_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid one-pager ID format"
        )

    # Fetch one-pager
    logger.info(f"Fetching onepager {onepager_id} for PDF export")
    onepager_doc = await db.onepagers.find_one({"_id": ObjectId(onepager_id)})

    if not onepager_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One-pager not found"
        )

    # Verify ownership
    if str(onepager_doc["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to export this one-pager"
        )

    # Fetch Brand Kit if associated
    brand_kit_doc = None
    if onepager_doc.get("brand_kit_id"):
        brand_kit_doc = await db.brand_kits.find_one({
            "_id": onepager_doc["brand_kit_id"]
        })

        if not brand_kit_doc:
            logger.warning(f"Brand Kit {onepager_doc['brand_kit_id']} not found, using defaults")

    # Use default brand kit if not found
    if not brand_kit_doc:
        brand_kit_doc = {
            "_id": ObjectId(),  # Temporary ID for default brand kit
            "user_id": onepager_doc["user_id"],  # Use the onepager's user_id
            "company_name": onepager_doc.get("title", "Company"),
            "brand_voice": "Professional and engaging",
            "color_palette": {
                "primary": "#0ea5e9",
                "secondary": "#64748b",
                "accent": "#10b981",
                "text": "#1f2937",
                "background": "#ffffff"
            },
            "typography": {
                "heading_font": "Montserrat",
                "body_font": "Inter",
                "heading_size": "32px",
                "body_size": "16px"
            },
            "is_active": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }

    try:
        # Convert documents to Pydantic models
        # Map database structure to OnePagerLayout
        onepager_layout_data = {
            "title": onepager_doc.get("title", "Untitled"),
            "elements": [],
            "version": 1,
            "dimensions": {"width": 1080, "height": 1920, "unit": "px"}
        }

        # Map content sections to elements
        has_hero_section = False
        if "content" in onepager_doc and "sections" in onepager_doc["content"]:
            for idx, section in enumerate(onepager_doc["content"]["sections"]):
                section_type = section.get("type", "text_block")
                section_content = section.get("content", {})

                # Handle hero type: convert string content to proper dict format
                if section_type == "hero" and isinstance(section_content, str):
                    # Use OnePager's headline as the hero headline
                    section_content = {
                        "headline": onepager_doc["content"].get("headline", section.get("title", "")),
                        "subheadline": onepager_doc["content"].get("subheadline", ""),
                        "description": section_content
                    }
                    has_hero_section = True

                element = {
                    "id": section.get("id", f"section-{idx}"),
                    "type": section_type,
                    "title": section.get("title"),  # Include title from section
                    "content": section_content,
                    "styling": section.get("styling"),
                    "order": section.get("order", idx)
                }
                onepager_layout_data["elements"].append(element)

                # Track if we already have a hero section
                if section_type == "hero":
                    has_hero_section = True

        # Add headline as hero element if exists and no hero section already present
        if not has_hero_section and "content" in onepager_doc and "headline" in onepager_doc["content"]:
            hero_element = {
                "id": "hero-main",
                "type": "hero",
                "content": {
                    "headline": onepager_doc["content"]["headline"],
                    "subheadline": onepager_doc["content"].get("subheadline"),
                    "description": onepager_doc["content"].get("description", "")
                },
                "order": 0
            }
            onepager_layout_data["elements"].insert(0, hero_element)

        # Normalize order values to ensure uniqueness
        # Reassign sequential order values after building elements array
        for idx, element in enumerate(onepager_layout_data["elements"]):
            element["order"] = idx

        onepager = OnePagerLayout(**onepager_layout_data)
        brand_kit = BrandKitInDB(**brand_kit_doc)

        # Extract layout_params from database (if exists)
        layout_params = onepager_doc.get("layout_params", {})

        # Use pdf_template from database, fall back to query parameter
        # Priority: database field > query parameter > default (minimalist)
        selected_template = onepager_doc.get("pdf_template") or template or "minimalist"

        # Generate HTML with Brand Kit styling, layout params, and selected template
        logger.info(f"Generating HTML from onepager layout with template: {selected_template}")
        logger.info(f"Layout params: {layout_params}")
        html_generator = PDFHTMLGenerator()
        html = html_generator.generate_html(onepager, brand_kit, template_name=selected_template, layout_params=layout_params)

        # Generate PDF
        logger.info(f"Generating PDF with format: {format}")
        pdf_generator = PDFGenerator()
        pdf_bytes = await pdf_generator.generate_pdf(
            html,
            page_format=format
        )

        logger.info(f"✅ PDF generated successfully: {len(pdf_bytes) / 1024:.1f} KB")

        # Return as downloadable file
        filename = f"{onepager_doc['title'].replace(' ', '_')}_{format}.pdf"
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=\"{filename}\"",
                "X-PDF-Format": format,
                "X-PDF-Size-KB": str(int(len(pdf_bytes) / 1024))
            }
        )

    except Exception as e:
        logger.error(f"PDF export failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {str(e)}"
        )
