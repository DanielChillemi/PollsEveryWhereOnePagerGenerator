"""
Complete API Test - PDF Export with Authentication
===================================================

Tests the full workflow:
1. Register/login user
2. Create brand kit
3. Create onepager
4. Export PDF via API
5. Validate output
"""

import asyncio
import httpx
from datetime import datetime


# API Configuration
BASE_URL = "http://localhost:8000/api/v1"
TEST_USER = {
    "email": "pdftest@example.com",
    "username": "pdftest",
    "password": "TestPassword123!"
}


async def register_and_login():
    """Register user and get JWT token."""
    print("\n🔐 Step 1: Authentication")
    print("-" * 60)
    
    async with httpx.AsyncClient() as client:
        # Try to register
        print("   • Attempting to register user...")
        register_response = await client.post(
            f"{BASE_URL}/auth/register",
            json={
                "email": TEST_USER["email"],
                "username": TEST_USER["username"],
                "password": TEST_USER["password"]
            }
        )
        
        if register_response.status_code == 201:
            print(f"   ✓ User registered successfully")
        elif register_response.status_code == 400 and "already exists" in register_response.text:
            print(f"   ✓ User already exists, proceeding to login")
        else:
            print(f"   ✗ Registration failed: {register_response.text}")
            return None
        
        # Login to get token
        print("   • Logging in...")
        login_response = await client.post(
            f"{BASE_URL}/auth/login",
            data={
                "username": TEST_USER["email"],  # FastAPI OAuth2 uses 'username' field
                "password": TEST_USER["password"]
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data["access_token"]
            print(f"   ✓ Login successful")
            print(f"   ✓ JWT token obtained")
            return token
        else:
            print(f"   ✗ Login failed: {login_response.text}")
            return None


async def create_brand_kit(token):
    """Create a test brand kit."""
    print("\n🎨 Step 2: Create Brand Kit")
    print("-" * 60)
    
    headers = {"Authorization": f"Bearer {token}"}
    
    brand_kit_data = {
        "company_name": "PDF Test Company",
        "brand_voice": "Professional and innovative",
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
        }
    }
    
    async with httpx.AsyncClient() as client:
        print("   • Creating brand kit...")
        response = await client.post(
            f"{BASE_URL}/brand-kits",
            json=brand_kit_data,
            headers=headers
        )
        
        if response.status_code == 201:
            brand_kit = response.json()
            print(f"   ✓ Brand kit created: {brand_kit['id']}")
            print(f"   ✓ Company: {brand_kit['company_name']}")
            print(f"   ✓ Primary color: {brand_kit['color_palette']['primary']}")
            return brand_kit["id"]
        else:
            print(f"   ✗ Failed to create brand kit: {response.text}")
            return None


async def create_onepager(token, brand_kit_id):
    """Create a test one-pager."""
    print("\n📄 Step 3: Create One-Pager")
    print("-" * 60)
    
    headers = {"Authorization": f"Bearer {token}"}
    
    onepager_data = {
        "title": "API Test One-Pager for PDF Export",
        "input_prompt": "Create a compelling one-pager for a SaaS platform that helps marketing teams automate their workflows. Target audience is marketing managers at mid-size companies. Include key benefits, features, and a strong call to action.",
        "brand_kit_id": brand_kit_id,
        "target_audience": "Marketing managers and directors"
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        print("   • Creating one-pager with AI generation...")
        print("   • This may take 10-15 seconds...")
        response = await client.post(
            f"{BASE_URL}/onepagers",
            json=onepager_data,
            headers=headers
        )
        
        if response.status_code == 201:
            onepager = response.json()
            print(f"   ✓ One-pager created: {onepager['id']}")
            print(f"   ✓ Title: {onepager['title']}")
            print(f"   ✓ Status: {onepager['status']}")
            print(f"   ✓ Content sections: {len(onepager['content']['sections'])}")
            return onepager["id"]
        else:
            print(f"   ✗ Failed to create one-pager: {response.status_code}")
            print(f"   ✗ Response: {response.text}")
            return None


async def export_pdf(token, onepager_id, format="letter"):
    """Export one-pager as PDF."""
    print(f"\n📥 Step 4: Export PDF (format: {format})")
    print("-" * 60)
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        print("   • Requesting PDF export...")
        print("   • Generating HTML from template...")
        print("   • Rendering PDF with Playwright + Chromium...")
        
        start_time = datetime.now()
        
        response = await client.get(
            f"{BASE_URL}/onepagers/{onepager_id}/export/pdf",
            params={"format": format},
            headers=headers
        )
        
        elapsed = (datetime.now() - start_time).total_seconds()
        
        if response.status_code == 200:
            pdf_bytes = response.content
            file_size_kb = len(pdf_bytes) / 1024
            
            # Save PDF
            output_filename = f"api_test_export_{onepager_id[:8]}_{format}.pdf"
            with open(output_filename, "wb") as f:
                f.write(pdf_bytes)
            
            print(f"   ✓ PDF generated successfully!")
            print(f"   ✓ Generation time: {elapsed:.2f} seconds")
            print(f"   ✓ File size: {file_size_kb:.1f} KB")
            print(f"   ✓ Saved to: {output_filename}")
            
            # Validate
            print(f"\n📋 Validation Results:")
            print(f"   • Content-Type: {response.headers.get('content-type')} {'✓' if 'application/pdf' in response.headers.get('content-type', '') else '✗'}")
            print(f"   • File size reasonable: {'✓' if 50 < file_size_kb < 1000 else '✗ (expected 50-1000 KB)'}")
            print(f"   • Generation time acceptable: {'✓' if elapsed < 10.0 else '✗ (expected < 10s)'}")
            print(f"   • PDF magic bytes: {'✓' if pdf_bytes[:4] == b'%PDF' else '✗'}")
            
            return output_filename
        else:
            print(f"   ✗ PDF export failed!")
            print(f"   ✗ Status code: {response.status_code}")
            print(f"   ✗ Response: {response.text}")
            return None


async def cleanup(token):
    """Clean up test data."""
    print(f"\n🧹 Step 5: Cleanup")
    print("-" * 60)
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with httpx.AsyncClient() as client:
        # List and delete onepagers
        print("   • Fetching user's one-pagers...")
        onepagers_response = await client.get(
            f"{BASE_URL}/onepagers",
            headers=headers
        )
        
        if onepagers_response.status_code == 200:
            onepagers = onepagers_response.json()
            for onepager in onepagers:
                if "API Test" in onepager.get("title", ""):
                    print(f"   • Deleting one-pager: {onepager['id']}")
                    await client.delete(
                        f"{BASE_URL}/onepagers/{onepager['id']}",
                        headers=headers
                    )
        
        # List and delete brand kits
        print("   • Fetching user's brand kits...")
        kits_response = await client.get(
            f"{BASE_URL}/brand-kits",
            headers=headers
        )
        
        if kits_response.status_code == 200:
            kits = kits_response.json()
            for kit in kits:
                if "PDF Test" in kit.get("company_name", ""):
                    print(f"   • Deleting brand kit: {kit['id']}")
                    await client.delete(
                        f"{BASE_URL}/brand-kits/{kit['id']}",
                        headers=headers
                    )
        
        print("   ✓ Cleanup complete")


async def main():
    """Run complete API test workflow."""
    print("=" * 60)
    print("PDF EXPORT API TEST - FULL WORKFLOW")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print(f"Test User: {TEST_USER['email']}")
    
    try:
        # Step 1: Authenticate
        token = await register_and_login()
        if not token:
            print("\n❌ FAILED: Could not authenticate")
            return False
        
        # Step 2: Create brand kit
        brand_kit_id = await create_brand_kit(token)
        if not brand_kit_id:
            print("\n❌ FAILED: Could not create brand kit")
            return False
        
        # Step 3: Create one-pager
        onepager_id = await create_onepager(token, brand_kit_id)
        if not onepager_id:
            print("\n❌ FAILED: Could not create one-pager")
            return False
        
        # Step 4: Export PDF
        pdf_file = await export_pdf(token, onepager_id, format="letter")
        if not pdf_file:
            print("\n❌ FAILED: Could not export PDF")
            return False
        
        # Success!
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        print(f"\n🎉 Success! Your PDF is ready:")
        print(f"   • Open {pdf_file} to review the exported one-pager")
        print(f"   • Check that text is selectable (not an image)")
        print(f"   • Verify brand colors are applied correctly")
        print(f"   • Ensure layout looks professional")
        
        # Ask about cleanup
        print(f"\n⚠️  Test data remains in database.")
        print(f"   Run with --cleanup flag to remove test data.")
        
        return True
        
    except Exception as e:
        print(f"\n❌ TEST FAILED WITH ERROR:")
        print(f"{e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    import sys
    
    # Check if cleanup requested
    if "--cleanup" in sys.argv:
        print("Running cleanup only...")
        async def cleanup_only():
            token = await register_and_login()
            if token:
                await cleanup(token)
        asyncio.run(cleanup_only())
    else:
        # Run full test
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
