"""
One-Pager API Schemas
======================

Pydantic request/response models for one-pager endpoints.
"""

from backend.models.onepager import (
    OnePagerCreate,
    OnePagerUpdate,
    OnePagerIterate,
    OnePagerResponse,
    OnePagerSummary,
    OnePagerStatus,
    ContentSection,
    OnePagerContent,
    LayoutBlock,
    GenerationMetadata,
    VersionSnapshot
)

# Re-export models for convenience
__all__ = [
    "OnePagerCreate",
    "OnePagerUpdate",
    "OnePagerIterate",
    "OnePagerResponse",
    "OnePagerSummary",
    "OnePagerStatus",
    "ContentSection",
    "OnePagerContent",
    "LayoutBlock",
    "GenerationMetadata",
    "VersionSnapshot"
]
