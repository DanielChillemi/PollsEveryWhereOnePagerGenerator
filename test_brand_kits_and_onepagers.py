"""
Test Script for Brand Kits and One-Pagers API
==============================================

Tests the complete workflow:
1. User authentication
2. Brand Kit creation and management
3. One-Pager creation with AI generation
4. One-Pager iteration and refinement

Usage:
    python test_brand_kits_and_onepagers.py
"""

import requests
import json
from datetime import datetime
from colorama import Fore, Style, init

# Initialize colorama for colored terminal output
init(autoreset=True)

# API base URL
BASE_URL = "http://localhost:8000"
API_V1 = f"{BASE_URL}/api/v1"

# Test user credentials
TEST_USER = {
    "email": f"test_user_{datetime.now().timestamp()}@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User"
}

# Global variables for test data
access_token = None
brand_kit_id = None
onepager_id = None


def print_section(title: str):
    """Print a section header."""
    print(f"\n{Fore.CYAN}{'=' * 60}")
    print(f"{Fore.CYAN}{title}")
    print(f"{Fore.CYAN}{'=' * 60}{Style.RESET_ALL}\n")


def print_success(message: str):
    """Print a success message."""
    print(f"{Fore.GREEN}✅ {message}{Style.RESET_ALL}")


def print_error(message: str):
    """Print an error message."""
    print(f"{Fore.RED}❌ {message}{Style.RESET_ALL}")


def print_info(message: str):
    """Print an info message."""
    print(f"{Fore.YELLOW}ℹ️  {message}{Style.RESET_ALL}")


def test_health_check():
    """Test the health check endpoint."""
    print_section("1. Testing Health Check")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print_success(f"Server is {data['status']}")
            print_info(f"Database: {data['database']}")
            print_info(f"Version: {data['version']}")
            return True
        else:
            print_error(f"Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Health check error: {e}")
        return False


def test_user_signup():
    """Test user registration."""
    print_section("2. Testing User Signup")
    try:
        response = requests.post(
            f"{API_V1}/auth/signup",
            json=TEST_USER
        )
        if response.status_code == 201:
            data = response.json()
            print_success("User created successfully")
            print_info(f"User ID: {data['_id']}")
            print_info(f"Email: {data['email']}")
            return True
        else:
            print_error(f"Signup failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_error(f"Signup error: {e}")
        return False


def test_user_login():
    """Test user login and obtain access token."""
    global access_token
    print_section("3. Testing User Login")
    try:
        response = requests.post(
            f"{API_V1}/auth/login",
            data={
                "username": TEST_USER["email"],
                "password": TEST_USER["password"]
            }
        )
        if response.status_code == 200:
            data = response.json()
            access_token = data["access_token"]
            print_success("Login successful")
            print_info(f"Access Token: {access_token[:20]}...")
            print_info(f"Expires in: {data['expires_in']} seconds")
            return True
        else:
            print_error(f"Login failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_error(f"Login error: {e}")
        return False


def test_create_brand_kit():
    """Test creating a brand kit."""
    global brand_kit_id
    print_section("4. Testing Brand Kit Creation")

    brand_kit_data = {
        "company_name": "Test Company Inc.",
        "brand_voice": "Professional, innovative, and customer-focused",
        "target_audiences": [
            {
                "name": "Enterprise Buyers",
                "description": "Large companies looking for scalable solutions"
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
        "assets": [
            {
                "url": "https://example.com/hero-image.jpg",
                "type": "image",
                "name": "Hero Image"
            }
        ]
    }

    try:
        response = requests.post(
            f"{API_V1}/brand-kits",
            json=brand_kit_data,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 201:
            data = response.json()
            brand_kit_id = data["_id"]
            print_success("Brand Kit created successfully")
            print_info(f"Brand Kit ID: {brand_kit_id}")
            print_info(f"Company: {data['company_name']}")
            print_info(f"Colors: Primary={data['color_palette']['primary']}, Secondary={data['color_palette']['secondary']}")
            return True
        else:
            print_error(f"Brand Kit creation failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_error(f"Brand Kit creation error: {e}")
        return False


def test_get_brand_kit():
    """Test retrieving brand kit."""
    print_section("5. Testing Get Brand Kit")
    try:
        response = requests.get(
            f"{API_V1}/brand-kits/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            data = response.json()
            print_success("Brand Kit retrieved successfully")
            print_info(f"Company: {data['company_name']}")
            print_info(f"Brand Voice: {data['brand_voice'][:50]}...")
            return True
        else:
            print_error(f"Get Brand Kit failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_error(f"Get Brand Kit error: {e}")
        return False


def test_create_onepager():
    """Test creating a one-pager with AI generation."""
    global onepager_id
    print_section("6. Testing One-Pager Creation (with AI)")

    onepager_data = {
        "title": "Product Launch One-Pager",
        "input_prompt": "Create a marketing one-pager for a new SaaS project management tool. Highlight key features like team collaboration, task tracking, and real-time updates. Target audience is small to medium-sized businesses.",
        "brand_kit_id": brand_kit_id,
        "target_audience": "Small to medium-sized business owners and project managers"
    }

    print_info("Generating wireframe with AI... (this may take 10-30 seconds)")

    try:
        response = requests.post(
            f"{API_V1}/onepagers",
            json=onepager_data,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=60  # Allow time for AI generation
        )
        if response.status_code == 201:
            data = response.json()
            onepager_id = data["_id"]
            print_success("One-Pager created successfully")
            print_info(f"One-Pager ID: {onepager_id}")
            print_info(f"Title: {data['title']}")
            print_info(f"Status: {data['status']}")
            print_info(f"Headline: {data['content']['headline']}")
            print_info(f"Sections: {len(data['content']['sections'])}")
            print_info(f"Layout blocks: {len(data['layout'])}")

            print(f"\n{Fore.MAGENTA}Generated Content Preview:{Style.RESET_ALL}")
            print(f"  Headline: {data['content']['headline']}")
            if data['content'].get('subheadline'):
                print(f"  Subheadline: {data['content']['subheadline']}")
            print(f"  Sections:")
            for section in data['content']['sections'][:3]:  # Show first 3 sections
                print(f"    - [{section['type']}] {str(section['content'])[:60]}...")

            return True
        else:
            print_error(f"One-Pager creation failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_error(f"One-Pager creation error: {e}")
        return False


def test_list_onepagers():
    """Test listing one-pagers."""
    print_section("7. Testing List One-Pagers")
    try:
        response = requests.get(
            f"{API_V1}/onepagers?limit=10",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved {len(data)} one-pager(s)")
            for op in data:
                print_info(f"  - {op['title']} (Status: {op['status']}, Iterations: {op['iterations']})")
            return True
        else:
            print_error(f"List one-pagers failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_error(f"List one-pagers error: {e}")
        return False


def test_iterate_onepager():
    """Test iterating on one-pager with feedback."""
    print_section("8. Testing One-Pager Iteration (with AI Refinement)")

    iteration_data = {
        "feedback": "Make the headline shorter and more punchy. Add a section about pricing tiers.",
        "apply_brand_styles": False
    }

    print_info("Refining layout with AI... (this may take 10-30 seconds)")

    try:
        response = requests.put(
            f"{API_V1}/onepagers/{onepager_id}/iterate",
            json=iteration_data,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=60
        )
        if response.status_code == 200:
            data = response.json()
            print_success("One-Pager refined successfully")
            print_info(f"New Headline: {data['content']['headline']}")
            print_info(f"Iterations: {data['generation_metadata']['iterations']}")
            print_info(f"Sections: {len(data['content']['sections'])}")
            print_info(f"Version history entries: {len(data['version_history'])}")
            return True
        else:
            print_error(f"One-Pager iteration failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_error(f"One-Pager iteration error: {e}")
        return False


def test_apply_brand_styles():
    """Test applying brand styles to one-pager."""
    print_section("9. Testing Apply Brand Styles")

    iteration_data = {
        "apply_brand_styles": True
    }

    try:
        response = requests.put(
            f"{API_V1}/onepagers/{onepager_id}/iterate",
            json=iteration_data,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            data = response.json()
            print_success("Brand styles applied")
            print_info(f"Status: {data['status']} (should be 'styled')")
            return True
        else:
            print_error(f"Apply brand styles failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_error(f"Apply brand styles error: {e}")
        return False


def test_update_brand_kit():
    """Test updating brand kit."""
    print_section("10. Testing Update Brand Kit")

    update_data = {
        "company_name": "Test Company Inc. (Updated)",
        "color_palette": {
            "primary": "#FF6B6B",
            "secondary": "#4ECDC4",
            "accent": "#FFE66D",
            "text": "#2C3E50",
            "background": "#F7F9FC"
        }
    }

    try:
        response = requests.put(
            f"{API_V1}/brand-kits/{brand_kit_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            data = response.json()
            print_success("Brand Kit updated successfully")
            print_info(f"New Company Name: {data['company_name']}")
            print_info(f"New Primary Color: {data['color_palette']['primary']}")
            return True
        else:
            print_error(f"Update Brand Kit failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print_error(f"Update Brand Kit error: {e}")
        return False


def print_summary(results: list):
    """Print test summary."""
    print_section("Test Summary")

    total = len(results)
    passed = sum(1 for r in results if r["passed"])
    failed = total - passed

    print(f"Total Tests: {total}")
    print(f"{Fore.GREEN}Passed: {passed}{Style.RESET_ALL}")
    print(f"{Fore.RED}Failed: {failed}{Style.RESET_ALL}")
    print(f"Success Rate: {(passed/total)*100:.1f}%\n")

    for result in results:
        status = f"{Fore.GREEN}✅ PASS" if result["passed"] else f"{Fore.RED}❌ FAIL"
        print(f"{status}{Style.RESET_ALL} - {result['name']}")


def main():
    """Run all tests."""
    print(f"\n{Fore.MAGENTA}{'=' * 60}")
    print(f"{Fore.MAGENTA}Brand Kits & One-Pagers API Test Suite")
    print(f"{Fore.MAGENTA}{'=' * 60}{Style.RESET_ALL}\n")

    results = []

    # Run tests
    tests = [
        ("Health Check", test_health_check),
        ("User Signup", test_user_signup),
        ("User Login", test_user_login),
        ("Create Brand Kit", test_create_brand_kit),
        ("Get Brand Kit", test_get_brand_kit),
        ("Create One-Pager", test_create_onepager),
        ("List One-Pagers", test_list_onepagers),
        ("Iterate One-Pager", test_iterate_onepager),
        ("Apply Brand Styles", test_apply_brand_styles),
        ("Update Brand Kit", test_update_brand_kit),
    ]

    for name, test_func in tests:
        try:
            passed = test_func()
            results.append({"name": name, "passed": passed})
        except Exception as e:
            print_error(f"Unexpected error in {name}: {e}")
            results.append({"name": name, "passed": False})

    # Print summary
    print_summary(results)

    # Print test data for manual verification
    if onepager_id:
        print_section("Test Data for Manual Verification")
        print_info(f"Brand Kit ID: {brand_kit_id}")
        print_info(f"One-Pager ID: {onepager_id}")
        print_info(f"View in Swagger UI: {BASE_URL}/docs")
        print_info(f"Use access token for protected endpoints")


if __name__ == "__main__":
    main()
