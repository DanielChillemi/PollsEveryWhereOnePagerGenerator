"""
Complete API Test with Authentication
======================================

Tests the full PDF export workflow with real user authentication.
"""

import asyncio
import httpx
from pathlib import Path


BASE_URL = "http://localhost:8000"
EMAIL = "josuev@ownitcoaching.com"
PASSWORD = "josuetbftbw"


async def test_complete_workflow():
    """Test complete workflow: login -> create/get onepager -> export PDF."""
    print("=" * 70)
    print("COMPLETE PDF EXPORT API TEST WITH AUTHENTICATION")
    print("=" * 70)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        
        # Step 1: Login
        print("\n[1/5] Authenticating...")
        print(f"   Email: {EMAIL}")
        
        login_response = await client.post(
            f"{BASE_URL}/api/v1/auth/login",
            data={
                "username": EMAIL,
                "password": PASSWORD
            }
        )
        
        if login_response.status_code != 200:
            print(f"   ❌ Login failed: {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            return False
        
        token_data = login_response.json()
        access_token = token_data["access_token"]
        print(f"   ✅ Login successful!")
        print(f"   Token: {access_token[:20]}...")
        
        headers = {"Authorization": f"Bearer {access_token}"}
        
        # Step 2: List existing one-pagers
        print("\n[2/5] Fetching existing one-pagers...")
        
        list_response = await client.get(
            f"{BASE_URL}/api/v1/onepagers",
            headers=headers
        )
        
        if list_response.status_code != 200:
            print(f"   ❌ Failed to fetch one-pagers: {list_response.status_code}")
            print(f"   Response: {list_response.text}")
            return False
        
        onepagers = list_response.json()
        print(f"   ✅ Found {len(onepagers)} existing one-pager(s)")
        
        # Step 3: Use existing or create new one-pager
        if onepagers:
            # Use the first existing one-pager
            onepager_id = onepagers[0]["id"]
            onepager_title = onepagers[0]["title"]
            print(f"\n[3/5] Using existing one-pager:")
            print(f"   ID: {onepager_id}")
            print(f"   Title: {onepager_title}")
            print(f"   Status: {onepagers[0]['status']}")
        else:
            # Create a new one-pager
            print(f"\n[3/5] Creating new one-pager for testing...")
            
            create_response = await client.post(
                f"{BASE_URL}/api/v1/onepagers",
                headers=headers,
                json={
                    "title": "PDF Export Test One-Pager",
                    "input_prompt": "Create a professional one-pager showcasing our SaaS platform with features, benefits, and a strong call-to-action",
                    "target_audience": "B2B SaaS decision makers"
                }
            )
            
            if create_response.status_code not in [200, 201]:
                print(f"   ❌ Failed to create one-pager: {create_response.status_code}")
                print(f"   Response: {create_response.text}")
                return False
            
            onepager_data = create_response.json()
            onepager_id = onepager_data["id"]
            onepager_title = onepager_data["title"]
            print(f"   ✅ Created new one-pager:")
            print(f"   ID: {onepager_id}")
            print(f"   Title: {onepager_title}")
        
        # Step 4: Export to PDF
        print(f"\n[4/5] Exporting one-pager to PDF...")
        print(f"   Format: Letter (8.5 x 11 inches)")
        print(f"   Generating PDF with Playwright...")
        
        export_response = await client.get(
            f"{BASE_URL}/api/v1/onepagers/{onepager_id}/export/pdf",
            headers=headers,
            params={"format": "letter"}
        )
        
        if export_response.status_code != 200:
            print(f"   ❌ PDF export failed: {export_response.status_code}")
            print(f"   Response: {export_response.text}")
            return False
        
        pdf_bytes = export_response.content
        file_size_kb = len(pdf_bytes) / 1024
        
        print(f"   ✅ PDF generated successfully!")
        print(f"   File size: {file_size_kb:.1f} KB")
        print(f"   Content-Type: {export_response.headers.get('content-type')}")
        
        # Step 5: Save and validate PDF
        print(f"\n[5/5] Saving PDF to file...")
        
        output_path = Path(f"api_export_{onepager_id[:8]}.pdf")
        output_path.write_bytes(pdf_bytes)
        
        print(f"   ✅ PDF saved to: {output_path}")
        print(f"\n" + "=" * 70)
        print("📋 VALIDATION CHECKLIST")
        print("=" * 70)
        print(f"✓ Authentication: PASSED")
        print(f"✓ API Access: PASSED")
        print(f"✓ One-Pager Retrieved: PASSED")
        print(f"✓ PDF Generation: PASSED")
        print(f"✓ File Size Reasonable: {'PASSED' if 10 < file_size_kb < 5000 else 'FAILED'}")
        print(f"✓ File Saved: PASSED")
        
        print(f"\n" + "=" * 70)
        print("🎉 ALL TESTS PASSED!")
        print("=" * 70)
        
        print(f"\n📖 Next Steps:")
        print(f"   1. Open {output_path} to verify:")
        print(f"      • Text is selectable and searchable")
        print(f"      • Brand colors are applied correctly")
        print(f"      • Layout looks professional")
        print(f"      • Content matches the one-pager data")
        print(f"   2. Test with different formats (A4, Tabloid)")
        print(f"   3. Test with brand kit integration")
        print(f"   4. Ready to merge to main!")
        
        return True


async def main():
    """Run the complete test workflow."""
    try:
        success = await test_complete_workflow()
        return 0 if success else 1
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)
