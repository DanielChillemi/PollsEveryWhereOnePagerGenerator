"""
Canva OAuth Token Regeneration Script
======================================

This script helps you regenerate your Canva access token with the correct scopes,
including the newly required 'asset:read' scope for Phase 2.4 asset upload functionality.

Usage:
    python -m backend.scripts.regenerate_canva_token

The script will:
1. Display the authorization URL with all required scopes
2. Wait for you to authorize and paste the callback URL
3. Exchange the authorization code for an access token
4. Display the new token to update in your .env file
"""

import os
import sys
import requests
from urllib.parse import urlencode, urlparse, parse_qs

# Required scopes for full functionality
REQUIRED_SCOPES = [
    "profile:read",           # Read user profile
    "design:content:read",    # Read design contents
    "design:content:write",   # Create and modify designs
    "asset:write",            # Upload assets
    "asset:read",             # Read asset metadata and check upload status (NEWLY REQUIRED)
]

# Canva OAuth endpoints
AUTHORIZE_URL = "https://www.canva.com/api/oauth/authorize"
TOKEN_URL = "https://api.canva.com/rest/v1/oauth/token"


def get_env_value(key: str) -> str:
    """Get value from .env file or environment."""
    value = os.getenv(key)
    if not value:
        print(f"❌ Error: {key} not found in environment")
        print(f"   Please set it in your .env file")
        sys.exit(1)
    return value


def build_authorization_url(client_id: str, redirect_uri: str, state: str = "regenerate_token") -> str:
    """Build the OAuth authorization URL with all required scopes."""
    params = {
        "client_id": client_id,
        "scope": " ".join(REQUIRED_SCOPES),
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "state": state
    }
    return f"{AUTHORIZE_URL}?{urlencode(params)}"


def exchange_code_for_token(code: str, client_id: str, client_secret: str, redirect_uri: str) -> dict:
    """Exchange authorization code for access token."""
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri
    }
    
    response = requests.post(TOKEN_URL, data=data)
    
    if response.status_code != 200:
        print(f"❌ Token exchange failed: {response.status_code}")
        print(f"   Response: {response.text}")
        sys.exit(1)
    
    return response.json()


def main():
    print("=" * 70)
    print("Canva OAuth Token Regeneration")
    print("=" * 70)
    print()
    print("This script will help you generate a new Canva access token")
    print("with the correct scopes for Phase 2.4 asset upload functionality.")
    print()
    
    # Load configuration
    print("📋 Loading configuration from environment...")
    client_id = get_env_value("CANVA_CLIENT_ID")
    client_secret = get_env_value("CANVA_CLIENT_SECRET")
    redirect_uri = get_env_value("CANVA_REDIRECT_URI")
    
    print(f"   Client ID: {client_id[:10]}...")
    print(f"   Redirect URI: {redirect_uri}")
    print()
    
    # Display required scopes
    print("🔑 Required OAuth Scopes:")
    for scope in REQUIRED_SCOPES:
        marker = "🆕 NEW" if scope == "asset:read" else "  "
        print(f"   {marker} {scope}")
    print()
    
    # Build authorization URL
    auth_url = build_authorization_url(client_id, redirect_uri)
    
    print("=" * 70)
    print("STEP 1: Authorize Application")
    print("=" * 70)
    print()
    print("Open this URL in your browser:")
    print()
    print(f"  {auth_url}")
    print()
    print("After authorizing:")
    print("1. You'll be redirected to your callback URL")
    print("2. Copy the ENTIRE URL from your browser's address bar")
    print("3. Paste it below")
    print()
    print("-" * 70)
    
    # Wait for callback URL
    callback_url = input("Paste the callback URL here: ").strip()
    
    # Extract authorization code
    try:
        parsed = urlparse(callback_url)
        params = parse_qs(parsed.query)
        
        if "code" not in params:
            print("❌ Error: No authorization code found in URL")
            print("   Make sure you pasted the complete callback URL")
            sys.exit(1)
        
        code = params["code"][0]
        print(f"✓ Authorization code extracted: {code[:20]}...")
        print()
        
    except Exception as e:
        print(f"❌ Error parsing callback URL: {e}")
        sys.exit(1)
    
    # Exchange code for token
    print("=" * 70)
    print("STEP 2: Exchange Code for Token")
    print("=" * 70)
    print()
    print("Requesting access token from Canva...")
    
    try:
        token_data = exchange_code_for_token(code, client_id, client_secret, redirect_uri)
        
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token")
        expires_in = token_data.get("expires_in")
        token_type = token_data.get("token_type")
        scope = token_data.get("scope")
        
        print("✅ Token received successfully!")
        print()
        print("=" * 70)
        print("STEP 3: Update Your .env File")
        print("=" * 70)
        print()
        print("Replace the CANVA_ACCESS_TOKEN value in your .env file with:")
        print()
        print(f"CANVA_ACCESS_TOKEN={access_token}")
        print()
        
        if refresh_token:
            print("Optional: Add refresh token for auto-renewal:")
            print(f"CANVA_REFRESH_TOKEN={refresh_token}")
            print()
        
        print("=" * 70)
        print("Token Details")
        print("=" * 70)
        print(f"  Type: {token_type}")
        print(f"  Expires in: {expires_in} seconds ({expires_in / 3600:.1f} hours)")
        print(f"  Scopes: {scope}")
        print()
        
        # Verify asset:read is included
        if "asset:read" in scope:
            print("✅ VERIFIED: 'asset:read' scope is included!")
        else:
            print("⚠️  WARNING: 'asset:read' scope NOT found in token!")
            print("   You may need to re-authorize with the correct scope")
        
        print()
        print("=" * 70)
        print("Next Steps")
        print("=" * 70)
        print()
        print("1. Update your .env file with the new token")
        print("2. Restart your backend server if it's running")
        print("3. Re-run the Phase 2.4 test:")
        print("   python -m backend.tests.test_phase_2_4_quick")
        print()
        print("🎉 Done! Your token should now work with asset uploads.")
        print()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
