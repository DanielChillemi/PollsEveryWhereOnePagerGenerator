"""
Authentication Flow Test Script
================================

Tests the complete authentication workflow:
1. Health check
2. User signup
3. User login
4. Token refresh
5. Get user profile
6. Verify protected route access

Run this script after starting the backend server to verify
everything is working correctly.
"""

import requests
import json
from typing import Optional, Dict, Any

# Configuration
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1"

# Test user data
TEST_USER = {
    "email": "test_user@example.com",
    "password": "TestPassword123!",
    "full_name": "Test Marketing User"
}


class Colors:
    """ANSI color codes for terminal output."""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


def print_step(step: str, status: str = "running"):
    """Print test step with formatting."""
    if status == "running":
        print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
        print(f"{Colors.BOLD}{step}{Colors.RESET}")
        print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    elif status == "success":
        print(f"{Colors.GREEN}✓ {step}{Colors.RESET}")
    elif status == "error":
        print(f"{Colors.RED}✗ {step}{Colors.RESET}")
    elif status == "info":
        print(f"{Colors.YELLOW}ℹ {step}{Colors.RESET}")


def print_response(response: requests.Response):
    """Print formatted API response."""
    print(f"\nStatus Code: {response.status_code}")
    try:
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
    except:
        print(f"Response: {response.text}")


def test_health_check() -> bool:
    """Test health check endpoint."""
    print_step("STEP 1: Health Check", "running")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") in ["healthy", "degraded"]:
                print_step("Health check passed", "success")
                return True
        
        print_step("Health check failed", "error")
        return False
        
    except requests.exceptions.ConnectionError:
        print_step("Cannot connect to server. Is it running?", "error")
        print_step(f"Start server: python -m uvicorn backend.main:app --reload", "info")
        return False
    except Exception as e:
        print_step(f"Health check error: {e}", "error")
        return False


def test_signup() -> bool:
    """Test user signup endpoint."""
    print_step("STEP 2: User Signup", "running")
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=TEST_USER,
            timeout=5
        )
        print_response(response)
        
        if response.status_code == 201:
            print_step("Signup successful", "success")
            return True
        elif response.status_code == 409:
            print_step("User already exists (continuing)", "info")
            return True  # User exists, that's okay for testing
        else:
            print_step("Signup failed", "error")
            return False
            
    except Exception as e:
        print_step(f"Signup error: {e}", "error")
        return False


def test_login() -> Optional[Dict[str, str]]:
    """Test user login endpoint."""
    print_step("STEP 3: User Login", "running")
    
    try:
        # OAuth2 password flow uses form data
        response = requests.post(
            f"{API_BASE}/auth/login",
            data={
                "username": TEST_USER["email"],
                "password": TEST_USER["password"]
            },
            timeout=5
        )
        print_response(response)
        
        if response.status_code == 200:
            tokens = response.json()
            print_step("Login successful", "success")
            print_step(f"Access token: {tokens['access_token'][:50]}...", "info")
            print_step(f"Refresh token: {tokens['refresh_token'][:50]}...", "info")
            return tokens
        else:
            print_step("Login failed", "error")
            return None
            
    except Exception as e:
        print_step(f"Login error: {e}", "error")
        return None


def test_get_profile(access_token: str) -> bool:
    """Test get current user profile endpoint."""
    print_step("STEP 4: Get User Profile", "running")
    
    try:
        response = requests.get(
            f"{API_BASE}/auth/me",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=5
        )
        print_response(response)
        
        if response.status_code == 200:
            print_step("Profile retrieval successful", "success")
            return True
        else:
            print_step("Profile retrieval failed", "error")
            return False
            
    except Exception as e:
        print_step(f"Profile error: {e}", "error")
        return False


def test_refresh_token(refresh_token: str) -> Optional[str]:
    """Test token refresh endpoint."""
    print_step("STEP 5: Refresh Access Token", "running")
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/refresh",
            json={"refresh_token": refresh_token},
            timeout=5
        )
        print_response(response)
        
        if response.status_code == 200:
            tokens = response.json()
            print_step("Token refresh successful", "success")
            return tokens["access_token"]
        else:
            print_step("Token refresh failed", "error")
            return None
            
    except Exception as e:
        print_step(f"Refresh error: {e}", "error")
        return None


def test_invalid_token() -> bool:
    """Test that invalid token is rejected."""
    print_step("STEP 6: Test Invalid Token Rejection", "running")
    
    try:
        response = requests.get(
            f"{API_BASE}/auth/me",
            headers={"Authorization": "Bearer invalid_token_here"},
            timeout=5
        )
        print_response(response)
        
        if response.status_code == 401:
            print_step("Invalid token correctly rejected", "success")
            return True
        else:
            print_step("Invalid token was accepted (security issue!)", "error")
            return False
            
    except Exception as e:
        print_step(f"Invalid token test error: {e}", "error")
        return False


def main():
    """Run all authentication tests."""
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("=" * 60)
    print("  Marketing One-Pager Authentication Flow Test")
    print("=" * 60)
    print(Colors.RESET)
    
    results = {
        "health_check": False,
        "signup": False,
        "login": False,
        "profile": False,
        "refresh": False,
        "invalid_token": False
    }
    
    # Test 1: Health Check
    results["health_check"] = test_health_check()
    if not results["health_check"]:
        print_step("\nTests aborted: Server not reachable", "error")
        return
    
    # Test 2: Signup
    results["signup"] = test_signup()
    
    # Test 3: Login
    tokens = test_login()
    if tokens:
        results["login"] = True
        access_token = tokens["access_token"]
        refresh_token = tokens["refresh_token"]
        
        # Test 4: Get Profile
        results["profile"] = test_get_profile(access_token)
        
        # Test 5: Refresh Token
        new_access_token = test_refresh_token(refresh_token)
        if new_access_token:
            results["refresh"] = True
    
    # Test 6: Invalid Token
    results["invalid_token"] = test_invalid_token()
    
    # Print Summary
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("=" * 60)
    print("  Test Summary")
    print("=" * 60)
    print(Colors.RESET)
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    for test_name, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        color = Colors.GREEN if passed else Colors.RED
        print(f"{color}{status}{Colors.RESET} - {test_name.replace('_', ' ').title()}")
    
    print(f"\n{Colors.BOLD}Results: {passed_tests}/{total_tests} tests passed{Colors.RESET}")
    
    if passed_tests == total_tests:
        print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 All tests passed! Authentication system is working correctly.{Colors.RESET}")
        print(f"\n{Colors.YELLOW}Next steps:{Colors.RESET}")
        print("  1. Access API documentation: http://localhost:8000/docs")
        print("  2. Test with frontend application")
        print("  3. Implement Brand Kit endpoints")
        print("  4. Add AI integration")
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}⚠ Some tests failed. Check the output above for details.{Colors.RESET}")
        print(f"\n{Colors.YELLOW}Troubleshooting:{Colors.RESET}")
        print("  - Ensure MongoDB is running")
        print("  - Check .env configuration")
        print("  - Review server logs for errors")


if __name__ == "__main__":
    main()
