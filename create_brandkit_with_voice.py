"""
Create a brand kit with brand voice to test the new feature
"""
import requests
import json

API_BASE = "http://localhost:8000"

# Test credentials
EMAIL = "anthony@test.com"
PASSWORD = "testpassword123"

def create_brand_kit_with_voice():
    """Create a brand kit with custom brand voice"""

    # Step 1: Login
    print("=== Step 1: Logging in ===")
    login_response = requests.post(
        f"{API_BASE}/api/v1/auth/login",
        data={"username": EMAIL, "password": PASSWORD}  # OAuth2 uses form data, not JSON
    )

    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        print("\nTrying to create account first...")

        # Try to create account
        signup_response = requests.post(
            f"{API_BASE}/api/v1/auth/signup",
            json={"email": EMAIL, "password": PASSWORD, "full_name": "Anthony Ruan"}  # Signup uses JSON
        )

        if signup_response.status_code not in [200, 201]:
            print(f"❌ Signup failed: {signup_response.status_code}")
            print(f"Response: {signup_response.text}")
            return

        print("✅ Account created successfully!")
        # Login again with form data
        login_response = requests.post(
            f"{API_BASE}/api/v1/auth/login",
            data={"username": EMAIL, "password": PASSWORD}  # OAuth2 uses form data
        )

    token = login_response.json()["access_token"]
    print(f"✅ Logged in successfully! Token: {token[:20]}...")

    # Step 2: Create Brand Kit with custom brand voice
    print("\n=== Step 2: Creating Brand Kit with Brand Voice ===")

    brand_kit_data = {
        "company_name": "TechVibe Innovations",
        "brand_voice": "Energetic and innovative with a friendly, conversational tone. We speak to tech-savvy millennials who value creativity and authenticity. Our voice is optimistic, slightly playful, and always empowering.",
        "color_palette": {
            "primary": "#6366F1",    # Indigo - modern tech vibe
            "secondary": "#EC4899",  # Pink - creative energy
            "accent": "#10B981",     # Green - growth/innovation
            "text": "#1F2937",       # Dark gray
            "background": "#FFFFFF"  # White
        },
        "typography": {
            "heading_font": "Inter",
            "body_font": "Inter",
            "heading_size": "36px",
            "body_size": "16px"
        },
        "logo_url": "https://example.com/techvibe-logo.png",
        "target_audiences": [
            {
                "name": "Tech Entrepreneurs",
                "description": "Early-stage founders building innovative software products"
            },
            {
                "name": "Product Managers",
                "description": "PMs at tech companies looking for modern tools and solutions"
            }
        ],
        "products": [
            {
                "name": "CloudSync Pro",
                "description": "Real-time collaboration platform for distributed teams",
                "default_problem": "Remote teams struggle with fragmented communication and lost context across multiple tools.",
                "default_solution": "CloudSync Pro unifies your team's communication, files, and tasks in one intelligent workspace.",
                "features": [
                    "Real-time collaboration with version control",
                    "AI-powered search across all content",
                    "Seamless integration with 50+ tools",
                    "Enterprise-grade security and compliance"
                ],
                "benefits": [
                    "Reduce context switching by 60%",
                    "Ship products 2x faster with unified workflows",
                    "Never lose important information again",
                    "Scale from 5 to 5000 team members effortlessly"
                ]
            }
        ]
    }

    print("Brand Kit Data:")
    print(json.dumps(brand_kit_data, indent=2))

    create_response = requests.post(
        f"{API_BASE}/api/v1/brand-kits",
        json=brand_kit_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    if create_response.status_code not in [200, 201]:
        print(f"\n❌ Brand Kit creation failed: {create_response.status_code}")
        print(f"Response: {create_response.text}")
        return

    brand_kit = create_response.json()
    print(f"\n✅ Brand Kit created successfully!")
    print(f"\nBrand Kit ID: {brand_kit['_id']}")
    print(f"Company Name: {brand_kit['company_name']}")
    print(f"Brand Voice: {brand_kit['brand_voice']}")
    print(f"Products: {len(brand_kit.get('products', []))}")
    print(f"Target Audiences: {len(brand_kit.get('target_audiences', []))}")

    # Step 3: Verify brand voice is stored
    print("\n=== Step 3: Verifying Brand Voice Storage ===")

    get_response = requests.get(
        f"{API_BASE}/api/v1/brand-kits/{brand_kit['_id']}",
        headers={"Authorization": f"Bearer {token}"}
    )

    if get_response.status_code == 200:
        retrieved_kit = get_response.json()
        print(f"✅ Retrieved Brand Kit")
        print(f"\nStored Brand Voice:")
        print(f"  \"{retrieved_kit['brand_voice']}\"")
        print(f"\nCharacter count: {len(retrieved_kit['brand_voice'])}/1000")

    print("\n" + "="*60)
    print("🎉 SUCCESS! Brand voice feature is working!")
    print("="*60)
    print(f"\nYou can now:")
    print(f"1. View this brand kit in the UI: http://localhost:5174/brand-kit/edit/{brand_kit['_id']}")
    print(f"2. Create a OnePager using this brand kit - the AI will use your brand voice!")
    print(f"3. Test the brand voice in action by creating marketing content")

if __name__ == "__main__":
    create_brand_kit_with_voice()
