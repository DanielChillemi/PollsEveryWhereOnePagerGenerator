"""
Brand Kit Routes
================

API endpoints for brand kit CRUD operations:
- POST /brand-kits - Create new brand kit
- GET /brand-kits/me - Get user's active brand kit
- GET /brand-kits/{id} - Get specific brand kit
- PUT /brand-kits/{id} - Update brand kit
- DELETE /brand-kits/{id} - Soft-delete brand kit
"""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
from bson import ObjectId
from typing import Optional, List
import uuid

from backend.brand_kits.schemas import (
    BrandKitCreate,
    BrandKitUpdate,
    BrandKitResponse
)
from backend.models.brand_kit import brand_kit_helper
from backend.models.user import UserInDB
from backend.auth.dependencies import get_current_active_user
from backend.database.mongodb import get_db
from backend.auth.schemas import ErrorResponse

router = APIRouter(prefix="/brand-kits", tags=["Brand Kits"])


@router.post(
    "",
    response_model=BrandKitResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request data"}
    }
)
async def create_brand_kit(
    brand_kit_data: BrandKitCreate,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Create a new brand kit for the authenticated user.

    Creates a brand profile with colors, typography, assets, and brand voice.
    Users can have multiple brand kits for different brands/companies.

    **Request Body:**
    - company_name: Company/brand name (required)
    - color_palette: Primary, secondary, accent colors (required)
    - typography: Font configurations (optional)
    - brand_voice: Brand voice description (optional)
    - target_audiences: Target audience personas (optional)
    - logo_url: Logo URL (optional)
    - assets: Brand assets list (optional)

    **Returns:**
    - Created brand kit with ID and metadata

    **Errors:**
    - 400: Invalid input data
    """
    # Create brand kit document
    now = datetime.now(timezone.utc)

    # Generate IDs for products if not provided
    products_with_ids = []
    for product in brand_kit_data.products:
        product_dict = product.model_dump()
        if not product_dict.get("id"):
            product_dict["id"] = str(uuid.uuid4())
        products_with_ids.append(product_dict)

    brand_kit_doc = {
        "user_id": ObjectId(current_user.id),
        "company_name": brand_kit_data.company_name,
        "brand_voice": brand_kit_data.brand_voice,
        "target_audiences": [audience.model_dump() for audience in brand_kit_data.target_audiences],
        "color_palette": brand_kit_data.color_palette.model_dump(),
        "typography": brand_kit_data.typography.model_dump(),
        "logo_url": brand_kit_data.logo_url,
        "assets": [asset.model_dump() for asset in brand_kit_data.assets],
        "products": products_with_ids,
        "is_active": True,
        "created_at": now,
        "updated_at": now
    }

    # Insert into database
    result = await db.brand_kits.insert_one(brand_kit_doc)
    brand_kit_doc["_id"] = result.inserted_id

    # Update user's brand_kit_id reference
    await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"brand_kit_id": str(result.inserted_id), "updated_at": now}}
    )

    # Return brand kit
    return BrandKitResponse(**brand_kit_helper(brand_kit_doc))


@router.get(
    "/me",
    response_model=List[BrandKitResponse],
    responses={
        200: {"description": "List of user's active brand kits (may be empty)"}
    }
)
async def get_my_brand_kits(
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get all of the current user's active brand kits.

    Returns a list of the user's active brand profiles. May be empty if user has no brand kits.

    **Returns:**
    - Array of brand kit data with all configurations

    **Errors:**
    - None (returns empty array if no brand kits)
    """
    cursor = db.brand_kits.find({
        "user_id": ObjectId(current_user.id),
        "is_active": True
    }).sort("created_at", -1)  # Most recent first

    brand_kits = await cursor.to_list(length=None)

    return [BrandKitResponse(**brand_kit_helper(kit)) for kit in brand_kits]


@router.get(
    "/{brand_kit_id}",
    response_model=BrandKitResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Brand kit not found"},
        403: {"model": ErrorResponse, "description": "Not authorized to access this brand kit"}
    }
)
async def get_brand_kit(
    brand_kit_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get a specific brand kit by ID.

    Requires ownership verification - users can only access their own brand kits.

    **Path Parameters:**
    - brand_kit_id: MongoDB ObjectId of the brand kit

    **Returns:**
    - Brand kit data

    **Errors:**
    - 404: Brand kit not found
    - 403: User doesn't own this brand kit
    """
    # Validate ObjectId format
    if not ObjectId.is_valid(brand_kit_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid brand kit ID format"
        )

    # Find brand kit
    brand_kit = await db.brand_kits.find_one({"_id": ObjectId(brand_kit_id)})

    if not brand_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand kit not found"
        )

    # Verify ownership
    if str(brand_kit["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this brand kit"
        )

    return BrandKitResponse(**brand_kit_helper(brand_kit))


@router.put(
    "/{brand_kit_id}",
    response_model=BrandKitResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Brand kit not found"},
        403: {"model": ErrorResponse, "description": "Not authorized to update this brand kit"}
    }
)
async def update_brand_kit(
    brand_kit_id: str,
    update_data: BrandKitUpdate,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Update an existing brand kit.

    Allows partial updates - only provided fields will be modified.

    **Path Parameters:**
    - brand_kit_id: MongoDB ObjectId of the brand kit

    **Request Body (all optional):**
    - company_name: Update company name
    - color_palette: Update color scheme
    - typography: Update font configurations
    - brand_voice: Update brand voice description
    - target_audiences: Update target audiences
    - logo_url: Update logo URL
    - assets: Update brand assets

    **Returns:**
    - Updated brand kit data

    **Errors:**
    - 404: Brand kit not found
    - 403: User doesn't own this brand kit
    """
    # Validate ObjectId format
    if not ObjectId.is_valid(brand_kit_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid brand kit ID format"
        )

    # Find brand kit
    brand_kit = await db.brand_kits.find_one({"_id": ObjectId(brand_kit_id)})

    if not brand_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand kit not found"
        )

    # Verify ownership
    if str(brand_kit["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this brand kit"
        )

    # Build update document (only include provided fields)
    update_doc = {"updated_at": datetime.now(timezone.utc)}

    if update_data.company_name is not None:
        update_doc["company_name"] = update_data.company_name
    if update_data.brand_voice is not None:
        update_doc["brand_voice"] = update_data.brand_voice
    if update_data.target_audiences is not None:
        update_doc["target_audiences"] = [audience.model_dump() for audience in update_data.target_audiences]
    if update_data.color_palette is not None:
        update_doc["color_palette"] = update_data.color_palette.model_dump()
    if update_data.typography is not None:
        update_doc["typography"] = update_data.typography.model_dump()
    if update_data.logo_url is not None:
        update_doc["logo_url"] = update_data.logo_url
    if update_data.assets is not None:
        update_doc["assets"] = [asset.model_dump() for asset in update_data.assets]
    if update_data.products is not None:
        # Generate IDs for products if not provided
        products_with_ids = []
        for product in update_data.products:
            product_dict = product.model_dump()
            if not product_dict.get("id"):
                product_dict["id"] = str(uuid.uuid4())
            products_with_ids.append(product_dict)
        update_doc["products"] = products_with_ids

    # Update in database
    await db.brand_kits.update_one(
        {"_id": ObjectId(brand_kit_id)},
        {"$set": update_doc}
    )

    # Fetch updated document
    updated_brand_kit = await db.brand_kits.find_one({"_id": ObjectId(brand_kit_id)})

    return BrandKitResponse(**brand_kit_helper(updated_brand_kit))


@router.delete(
    "/{brand_kit_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        404: {"model": ErrorResponse, "description": "Brand kit not found"},
        403: {"model": ErrorResponse, "description": "Not authorized to delete this brand kit"}
    }
)
async def delete_brand_kit(
    brand_kit_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Soft-delete a brand kit (sets is_active=false).

    The brand kit is not permanently deleted, just marked as inactive.
    This preserves data integrity for one-pagers that reference it.

    **Path Parameters:**
    - brand_kit_id: MongoDB ObjectId of the brand kit

    **Returns:**
    - 204 No Content on success

    **Errors:**
    - 404: Brand kit not found
    - 403: User doesn't own this brand kit
    """
    # Validate ObjectId format
    if not ObjectId.is_valid(brand_kit_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid brand kit ID format"
        )

    # Find brand kit
    brand_kit = await db.brand_kits.find_one({"_id": ObjectId(brand_kit_id)})

    if not brand_kit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand kit not found"
        )

    # Verify ownership
    if str(brand_kit["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this brand kit"
        )

    # Soft delete (set is_active=false)
    await db.brand_kits.update_one(
        {"_id": ObjectId(brand_kit_id)},
        {"$set": {"is_active": False, "updated_at": datetime.now(timezone.utc)}}
    )

    # Clear user's brand_kit_id reference
    await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"brand_kit_id": None, "updated_at": datetime.now(timezone.utc)}}
    )

    return None  # 204 No Content
