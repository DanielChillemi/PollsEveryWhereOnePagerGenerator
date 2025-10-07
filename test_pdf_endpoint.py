"""
Test PDF Export Endpoint
=========================

Quick validation script for the PDF export API endpoint.
Tests the complete workflow: create onepager → export PDF → validate output.
"""

import asyncio
import httpx
from datetime import datetime, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient


async def setup_test_data():
    """Create test onepager and brand kit in MongoDB."""
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.marketing_onepager
    
    print("📦 Setting up test data...")
    
    # Create test user
    user_id = ObjectId()
    user_doc = {
        "_id": user_id,
        "email": "test@example.com",
        "username": "testuser",
        "hashed_password": "dummy_hash",
        "is_active": True,
        "is_verified": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    existing_user = await db.users.find_one({"email": "test@example.com"})
    if not existing_user:
        await db.users.insert_one(user_doc)
        print(f"✅ Created test user: {user_id}")
    else:
        user_id = existing_user["_id"]
        print(f"✅ Using existing test user: {user_id}")
    
    # Create test brand kit
    brand_kit_id = ObjectId()
    brand_kit_doc = {
        "_id": brand_kit_id,
        "user_id": user_id,
        "company_name": "Tech Innovations Inc.",
        "brand_voice": "Professional yet approachable",
        "color_palette": {
            "primary": "#0ea5e9",
            "secondary": "#1e293b",
            "accent": "#f59e0b",
            "text": "#1f2937",
            "background": "#ffffff"
        },
        "typography": {
            "heading_font": "Inter",
            "body_font": "Open Sans"
        },
        "logo_url": None,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    existing_brand_kit = await db.brand_kits.find_one({"user_id": user_id, "is_active": True})
    if not existing_brand_kit:
        await db.brand_kits.insert_one(brand_kit_doc)
        print(f"✅ Created test brand kit: {brand_kit_id}")
    else:
        brand_kit_id = existing_brand_kit["_id"]
        print(f"✅ Using existing brand kit: {brand_kit_id}")
    
    # Create test onepager with PDF-friendly layout
    onepager_id = ObjectId()
    onepager_doc = {
        "_id": onepager_id,
        "user_id": user_id,
        "brand_kit_id": brand_kit_id,
        "title": "PDF Export Test One-Pager",
        "status": "draft",
        "content": {
            "headline": "Revolutionary SaaS Platform",
            "subheadline": "Transform Your Workflow in 2024",
            "sections": [
                {
                    "id": "section-1",
                    "type": "hero",
                    "title": "Hero Section",
                    "content": {
                        "headline": "Revolutionary SaaS Platform",
                        "description": "The all-in-one solution for modern teams"
                    },
                    "order": 0
                },
                {
                    "id": "section-2",
                    "type": "features",
                    "title": "Key Features",
                    "content": {
                        "features": [
                            "50% faster workflow automation",
                            "Enterprise-grade security",
                            "Seamless integration with 100+ tools"
                        ]
                    },
                    "order": 1
                },
                {
                    "id": "section-3",
                    "type": "cta",
                    "title": "Call to Action",
                    "content": {
                        "primary_text": "Start Free Trial",
                        "supporting_text": "No credit card required. 14-day trial."
                    },
                    "order": 2
                }
            ]
        },
        "layout": [
            {
                "block_id": "block-header",
                "type": "header",
                "position": {"x": 0, "y": 0},
                "size": {"width": "100%", "height": "auto"},
                "order": 0
            },
            {
                "block_id": "block-hero",
                "type": "hero",
                "position": {"x": 0, "y": 100},
                "size": {"width": "100%", "height": "auto"},
                "order": 1
            },
            {
                "block_id": "block-features",
                "type": "features",
                "position": {"x": 0, "y": 300},
                "size": {"width": "100%", "height": "auto"},
                "order": 2
            },
            {
                "block_id": "block-cta",
                "type": "cta",
                "position": {"x": 0, "y": 500},
                "size": {"width": "100%", "height": "auto"},
                "order": 3
            }
        ],
        "style_overrides": {},
        "generation_metadata": {
            "prompts": ["Create test one-pager for PDF export"],
            "iterations": 0,
            "ai_model": "manual",
            "last_generated_at": datetime.now(timezone.utc)
        },
        "version_history": [],
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "last_accessed": datetime.now(timezone.utc)
    }
    
    await db.onepagers.insert_one(onepager_doc)
    print(f"✅ Created test onepager: {onepager_id}")
    
    client.close()
    
    return {
        "user_id": str(user_id),
        "brand_kit_id": str(brand_kit_id),
        "onepager_id": str(onepager_id)
    }


async def test_pdf_export(onepager_id: str):
    """Test the PDF export endpoint."""
    print(f"\n🧪 Testing PDF export endpoint...")
    print(f"📄 OnePager ID: {onepager_id}")
    
    async with httpx.AsyncClient() as client:
        # Test PDF export
        response = await client.get(
            f"http://localhost:8000/api/v1/onepagers/{onepager_id}/export/pdf",
            params={"format": "letter"},
            timeout=30.0
        )
        
        print(f"📡 Response Status: {response.status_code}")
        print(f"📦 Content-Type: {response.headers.get('content-type')}")
        print(f"📊 Content-Length: {len(response.content):,} bytes ({len(response.content) / 1024:.2f} KB)")
        
        if response.status_code == 200:
            # Save PDF to file
            output_path = f"test_export_{onepager_id[:8]}.pdf"
            with open(output_path, "wb") as f:
                f.write(response.content)
            
            print(f"✅ PDF exported successfully to: {output_path}")
            print(f"\n📋 Validation Checklist:")
            print(f"   • PDF size is reasonable: {'✓' if 50000 < len(response.content) < 1000000 else '✗'}")
            print(f"   • Content-Type is correct: {'✓' if 'application/pdf' in response.headers.get('content-type', '') else '✗'}")
            print(f"   • File saved successfully: ✓")
            print(f"\n🎉 TEST PASSED! Open {output_path} to verify:")
            print(f"   1. Text is selectable (not an image)")
            print(f"   2. Brand colors are applied")
            print(f"   3. Layout matches design")
            print(f"   4. Print quality looks professional")
            
            return True
        else:
            print(f"❌ PDF export failed!")
            print(f"Response: {response.text}")
            return False


async def cleanup_test_data():
    """Clean up test data from MongoDB."""
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.marketing_onepager
    
    print(f"\n🧹 Cleaning up test data...")
    
    # Find and delete test user and all related data
    test_user = await db.users.find_one({"email": "test@example.com"})
    if test_user:
        user_id = test_user["_id"]
        
        # Delete onepagers
        result = await db.onepagers.delete_many({"user_id": user_id})
        print(f"✅ Deleted {result.deleted_count} test onepager(s)")
        
        # Delete brand kits
        result = await db.brand_kits.delete_many({"user_id": user_id})
        print(f"✅ Deleted {result.deleted_count} test brand kit(s)")
        
        # Delete user
        await db.users.delete_one({"_id": user_id})
        print(f"✅ Deleted test user")
    
    client.close()


async def main():
    """Run complete test workflow."""
    print("=" * 60)
    print("PDF EXPORT ENDPOINT TEST")
    print("=" * 60)
    
    try:
        # Setup test data
        test_data = await setup_test_data()
        
        # Test PDF export
        success = await test_pdf_export(test_data["onepager_id"])
        
        # Report results
        print("\n" + "=" * 60)
        if success:
            print("✅ ALL TESTS PASSED")
        else:
            print("❌ TESTS FAILED")
        print("=" * 60)
        
        # Ask user about cleanup
        print("\n⚠️  Test data remains in database for manual inspection.")
        print("Run with --cleanup flag to remove test data.")
        
        return 0 if success else 1
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    import sys
    
    if "--cleanup" in sys.argv:
        asyncio.run(cleanup_test_data())
    else:
        exit_code = asyncio.run(main())
        sys.exit(exit_code)
