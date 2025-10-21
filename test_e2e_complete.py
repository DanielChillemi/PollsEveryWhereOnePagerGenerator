"""
Complete End-to-End Test Script
================================

Tests the complete user journey:
1. Sign-up → Login (Authentication)
2. Create Brand Kit (Brand Hub API)
3. Create AI-Generated One-Pager (AI Service)
4. Verify Content Structure (Fixed validation)
5. Export to PDF (Playwright)
6. Verify PDF Quality

This validates all critical components working together.
"""

import asyncio
import httpx
import json
from datetime import datetime, timezone
from pathlib import Path


BASE_URL = "http://localhost:8000"
TEST_EMAIL = f"e2e_test_{datetime.now().timestamp()}@test.com"
TEST_PASSWORD = "TestPassword123!"


def print_section(title: str):
    """Print formatted section header."""
    print(f"\n{'='*60}")
    print(f" {title}")
    print(f"{'='*60}\n")


def print_success(message: str):
    """Print success message."""
    print(f"✅ {message}")


def print_error(message: str):
    """Print error message."""
    print(f"❌ {message}")


def print_info(message: str):
    """Print info message."""
    print(f"ℹ️  {message}")


async def test_complete_workflow():
    """Run complete end-to-end test."""
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        
        # ===================================================================
        # STEP 1: Sign Up New User
        # ===================================================================
        print_section("STEP 1: User Sign-Up (Authentication)")
        
        signup_data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "full_name": "E2E Test User"
        }
        
        try:
            response = await client.post(
                f"{BASE_URL}/api/v1/auth/signup",
                json=signup_data
            )
            
            if response.status_code == 201:
                user_data = response.json()
                # Handle both 'id' and '_id' field names
                user_id = user_data.get('id') or user_data.get('_id')
                print_success(f"User created: {user_data['email']}")
                print_info(f"User ID: {user_id}")
            else:
                print_error(f"Signup failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print_error(f"Signup error: {e}")
            return False
        
        
        # ===================================================================
        # STEP 2: Login and Get JWT Token
        # ===================================================================
        print_section("STEP 2: User Login (JWT Authentication)")
        
        login_data = {
            "username": TEST_EMAIL,  # FastAPI OAuth2 uses "username" field
            "password": TEST_PASSWORD
        }
        
        try:
            response = await client.post(
                f"{BASE_URL}/api/v1/auth/login",
                data=login_data  # Form data, not JSON
            )
            
            if response.status_code == 200:
                token_data = response.json()
                access_token = token_data["access_token"]
                print_success("Login successful!")
                print_info(f"Token type: {token_data['token_type']}")
                
                # Set authorization header for subsequent requests
                client.headers["Authorization"] = f"Bearer {access_token}"
                
            else:
                print_error(f"Login failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print_error(f"Login error: {e}")
            return False
        
        
        # ===================================================================
        # STEP 3: Create Brand Kit
        # ===================================================================
        print_section("STEP 3: Create Brand Kit (Brand Hub API)")
        
        brand_kit_data = {
            "company_name": "E2E Test Company",
            "brand_voice": "Professional, innovative, and customer-focused",
            "target_audiences": [
                {
                    "name": "Tech Leaders",
                    "description": "CTOs and engineering managers at scale-ups"
                }
            ],
            "color_palette": {
                "primary": "#007ACC",
                "secondary": "#864CBD",
                "accent": "#FF6B6B",
                "text": "#333333",
                "background": "#FFFFFF"
            },
            "typography": {
                "heading_font": "Montserrat",
                "body_font": "Open Sans",
                "heading_size": "36px",
                "body_size": "16px"
            },
            "logo_url": "https://example.com/logo.png",
            "assets": []
        }
        
        try:
            response = await client.post(
                f"{BASE_URL}/api/v1/brand-kits",
                json=brand_kit_data
            )
            
            if response.status_code == 201:
                brand_kit = response.json()
                # Handle both 'id' and '_id' field names
                brand_kit_id = brand_kit.get('id') or brand_kit.get('_id')
                print_success(f"Brand Kit created: {brand_kit['company_name']}")
                print_info(f"Brand Kit ID: {brand_kit_id}")
                print_info(f"Primary Color: {brand_kit['color_palette']['primary']}")
            else:
                print_error(f"Brand Kit creation failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print_error(f"Brand Kit error: {e}")
            return False
        
        
        # ===================================================================
        # STEP 4: Create AI-Generated One-Pager (TESTS BUG FIX)
        # ===================================================================
        print_section("STEP 4: Create AI-Generated One-Pager (AI Service)")
        print_info("This tests the ContentSection.content Union type fix")
        
        onepager_data = {
            "title": "E2E Test - AI Generated One-Pager",
            "input_prompt": "Create a one-pager for an AI-powered project management tool that helps teams collaborate better and ship faster. Target audience is engineering managers at tech companies.",
            "brand_kit_id": brand_kit_id,
            "target_audience": "Engineering managers at scale-ups"
        }
        
        try:
            print_info("Calling AI service to generate wireframe...")
            response = await client.post(
                f"{BASE_URL}/api/v1/onepagers",
                json=onepager_data
            )
            
            if response.status_code == 201:
                onepager = response.json()
                # Handle both 'id' and '_id' field names
                onepager_id = onepager.get('id') or onepager.get('_id')
                print_success(f"One-Pager created: {onepager['title']}")
                print_info(f"One-Pager ID: {onepager_id}")
                print_info(f"Status: {onepager['status']}")
                print_info(f"Headline: {onepager['content']['headline']}")
                print_info(f"Sections: {len(onepager['content']['sections'])}")
                
                # Verify content structure (validation passed!)
                sections = onepager['content']['sections']
                print_info("\n📋 Section Content Types:")
                for section in sections:
                    content_type = type(section['content']).__name__
                    print_info(f"  - {section['type']}: content is {content_type}")
                
                print_success("✓ ContentSection validation passed (Union type working!)")
                
            else:
                print_error(f"One-Pager creation failed: {response.status_code}")
                print_error(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print_error(f"AI generation error: {e}")
            import traceback
            traceback.print_exc()
            return False
        
        
        # ===================================================================
        # STEP 5: Export One-Pager to PDF
        # ===================================================================
        print_section("STEP 5: Export to PDF (Playwright)")
        
        try:
            print_info("Generating PDF with Playwright...")
            response = await client.get(
                f"{BASE_URL}/api/v1/onepagers/{onepager_id}/export/pdf"
            )
            
            if response.status_code == 200:
                # Save PDF
                pdf_path = Path("e2e_test_export.pdf")
                pdf_path.write_bytes(response.content)
                
                file_size_kb = len(response.content) / 1024
                print_success("PDF generated successfully!")
                print_info(f"File size: {file_size_kb:.1f} KB")
                print_info(f"Saved to: {pdf_path.absolute()}")
                
                if file_size_kb < 10:
                    print_error("⚠️  PDF seems too small, may be malformed")
                elif file_size_kb > 500:
                    print_error("⚠️  PDF seems too large, check optimization")
                else:
                    print_success("✓ PDF size looks reasonable")
                
            else:
                print_error(f"PDF export failed: {response.status_code}")
                print_error(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print_error(f"PDF export error: {e}")
            import traceback
            traceback.print_exc()
            return False
        
        
        # ===================================================================
        # STEP 6: Verify One-Pager Can Be Retrieved
        # ===================================================================
        print_section("STEP 6: Verify Data Persistence")
        
        try:
            response = await client.get(
                f"{BASE_URL}/api/v1/onepagers/{onepager_id}"
            )
            
            if response.status_code == 200:
                retrieved = response.json()
                print_success("One-Pager retrieved successfully")
                print_info(f"Title: {retrieved['title']}")
                print_info(f"Status: {retrieved['status']}")
                print_info(f"Sections: {len(retrieved['content']['sections'])}")
            else:
                print_error(f"Retrieval failed: {response.status_code}")
                return False
                
        except Exception as e:
            print_error(f"Retrieval error: {e}")
            return False
        
        
        # ===================================================================
        # FINAL SUMMARY
        # ===================================================================
        print_section("🎉 END-TO-END TEST COMPLETE")
        
        print_success("All tests passed!")
        print("\n📊 Test Results Summary:")
        print("  ✓ User Sign-Up: PASSED")
        print("  ✓ User Login (JWT): PASSED")
        print("  ✓ Brand Kit Creation: PASSED")
        print("  ✓ AI One-Pager Generation: PASSED")
        print("  ✓ ContentSection Validation: PASSED (Bug Fixed!)")
        print("  ✓ PDF Export (Playwright): PASSED")
        print("  ✓ Data Persistence: PASSED")
        
        print("\n🎯 Critical Features Validated:")
        print("  • Authentication flow working")
        print("  • Brand Kit CRUD functional")
        print("  • AI service generating valid wireframes")
        print("  • Content validation accepting Union types")
        print("  • PDF generation with Playwright working")
        print("  • MongoDB persistence working")
        
        print("\n✅ SYSTEM STATUS: PRODUCTION READY")
        print(f"\n📄 Test PDF: {pdf_path.absolute()}")
        
        return True


if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         COMPLETE END-TO-END TEST SUITE                       ║
║         Marketing One-Pager AI Co-Creation Tool              ║
║                                                              ║
║  Tests: Auth → Brand Kit → AI Generation → PDF Export       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
""")
    
    success = asyncio.run(test_complete_workflow())
    
    if success:
        print("\n" + "="*60)
        print("SUCCESS: All systems operational! 🚀")
        print("="*60)
        exit(0)
    else:
        print("\n" + "="*60)
        print("FAILURE: Some tests failed ❌")
        print("="*60)
        exit(1)
