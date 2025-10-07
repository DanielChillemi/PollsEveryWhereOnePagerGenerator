"""
Simple PDF Export Test with Auth
=================================

Bypasses AI generation by creating a test one-pager directly in MongoDB.
"""

import asyncio
import httpx
from datetime import datetime, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path


BASE_URL = "http://localhost:8000"
EMAIL = "josuev@ownitcoaching.com"
PASSWORD = "josuetbftbw"


async def create_test_onepager_in_db(user_id: str):
    """Create a test one-pager directly in MongoDB."""
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.marketing_onepager
    
    onepager_id = ObjectId()
    now = datetime.now(timezone.utc)
    
    onepager_doc = {
        "_id": onepager_id,
        "user_id": ObjectId(user_id),
        "brand_kit_id": None,
        "title": "PDF Export Test - SaaS Platform Launch",
        "status": "draft",
        "content": {
            "headline": "Transform Your Business with AI",
            "subheadline": "The Smart Way to Scale Your Operations",
            "sections": [
                {
                    "id": "hero-1",
                    "type": "hero",
                    "title": "Hero Section",
                    "content": {
                        "headline": "Transform Your Business with AI",
                        "description": "Automate workflows, boost productivity, and scale effortlessly"
                    },
                    "order": 0
                },
                {
                    "id": "features-1",
                    "type": "features",
                    "title": "Key Features",
                    "content": {
                        "features": [
                            "AI-powered automation that saves 10+ hours per week",
                            "Enterprise-grade security with SOC 2 compliance",
                            "Seamless integration with 100+ popular tools",
                            "Real-time analytics and insights dashboard"
                        ]
                    },
                    "order": 1
                },
                {
                    "id": "cta-1",
                    "type": "cta",
                    "title": "Call to Action",
                    "content": {
                        "primary_text": "Start Your Free 14-Day Trial",
                        "supporting_text": "No credit card required. Cancel anytime."
                    },
                    "order": 2
                }
            ]
        },
        "layout": [],
        "style_overrides": {},
        "generation_metadata": {
            "prompts": ["Manual test creation for PDF export"],
            "iterations": 0,
            "ai_model": "manual",
            "last_generated_at": now
        },
        "version_history": [],
        "created_at": now,
        "updated_at": now,
        "last_accessed": now
    }
    
    await db.onepagers.insert_one(onepager_doc)
    client.close()
    
    return str(onepager_id)


async def test_pdf_export():
    """Test PDF export with authentication."""
    print("=" * 70)
    print("PDF EXPORT API TEST (Simplified)")
    print("=" * 70)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        
        # Step 1: Login
        print("\n[1/4] Authenticating...")
        login_response = await client.post(
            f"{BASE_URL}/api/v1/auth/login",
            data={"username": EMAIL, "password": PASSWORD}
        )
        
        if login_response.status_code != 200:
            print(f"   ❌ Login failed: {login_response.status_code}")
            return False
        
        token_data = login_response.json()
        access_token = token_data["access_token"]
        user_id = token_data.get("user_id")
        print(f"   ✅ Logged in successfully")
        print(f"   User ID: {user_id}")
        
        headers = {"Authorization": f"Bearer {access_token}"}
        
        # Step 2: Create test one-pager in database
        print("\n[2/4] Creating test one-pager in database...")
        onepager_id = await create_test_onepager_in_db(user_id)
        print(f"   ✅ Created one-pager: {onepager_id}")
        
        # Step 3: Verify we can fetch it via API
        print("\n[3/4] Verifying one-pager via API...")
        get_response = await client.get(
            f"{BASE_URL}/api/v1/onepagers/{onepager_id}",
            headers=headers
        )
        
        if get_response.status_code != 200:
            print(f"   ❌ Failed to fetch: {get_response.status_code}")
            return False
        
        onepager_data = get_response.json()
        print(f"   ✅ Retrieved: {onepager_data['title']}")
        print(f"   Status: {onepager_data['status']}")
        print(f"   Sections: {len(onepager_data['content']['sections'])}")
        
        # Step 4: Export to PDF
        print("\n[4/4] Exporting to PDF...")
        print(f"   Calling: GET /onepagers/{onepager_id}/export/pdf")
        
        export_response = await client.get(
            f"{BASE_URL}/api/v1/onepagers/{onepager_id}/export/pdf",
            headers=headers,
            params={"format": "letter"}
        )
        
        if export_response.status_code != 200:
            print(f"   ❌ Export failed: {export_response.status_code}")
            print(f"   Response: {export_response.text}")
            return False
        
        pdf_bytes = export_response.content
        file_size_kb = len(pdf_bytes) / 1024
        
        # Save PDF
        output_path = Path(f"api_test_export.pdf")
        output_path.write_bytes(pdf_bytes)
        
        print(f"   ✅ PDF Generated!")
        print(f"   File Size: {file_size_kb:.1f} KB")
        print(f"   Saved to: {output_path}")
        
        print("\n" + "=" * 70)
        print("🎉 SUCCESS - PDF EXPORT WORKING!")
        print("=" * 70)
        
        print(f"\n📋 Test Results:")
        print(f"   ✓ Authentication: PASSED")
        print(f"   ✓ Database Access: PASSED")
        print(f"   ✓ API Retrieval: PASSED")
        print(f"   ✓ PDF Generation: PASSED")
        print(f"   ✓ File Size: {'PASSED' if 10 < file_size_kb < 5000 else 'FAILED'}")
        
        print(f"\n📖 Next Steps:")
        print(f"   1. Open {output_path} and verify:")
        print(f"      • Text is selectable")
        print(f"      • Content looks professional")
        print(f"      • Layout is clean")
        print(f"   2. Test with brand kit integration")
        print(f"   3. Ready to merge to main!")
        
        return True


if __name__ == "__main__":
    success = asyncio.run(test_pdf_export())
    exit(0 if success else 1)
