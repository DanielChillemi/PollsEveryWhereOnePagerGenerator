"""
Quick Demo Test - Try Your Own Prompts!
========================================

Simple script to test the API with your own marketing prompts.
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"

# Test user (will create new each time)
EMAIL = f"demo_{datetime.now().timestamp()}@example.com"
PASSWORD = "Demo123!"

def main():
    print("\n🚀 Starting Quick Demo...\n")

    # 1. Signup
    print("1️⃣  Creating account...")
    signup_response = requests.post(
        f"{BASE_URL}/auth/signup",
        json={
            "email": EMAIL,
            "password": PASSWORD,
            "full_name": "Demo User"
        }
    )
    print(f"   ✅ Account created: {signup_response.json()['email']}")

    # 2. Login
    print("\n2️⃣  Logging in...")
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": EMAIL, "password": PASSWORD}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"   ✅ Got access token")

    # 3. Create Brand Kit
    print("\n3️⃣  Creating brand kit...")
    brand_response = requests.post(
        f"{BASE_URL}/brand-kits",
        headers=headers,
        json={
            "company_name": "Demo Company",
            "brand_voice": "Professional and innovative",
            "color_palette": {
                "primary": "#007ACC",
                "secondary": "#864CBD",
                "accent": "#FF6B6B",
                "text": "#333333",
                "background": "#FFFFFF"
            }
        }
    )
    brand_kit_id = brand_response.json()["_id"]
    print(f"   ✅ Brand kit created: {brand_kit_id}")

    # 4. Create One-Pager with YOUR OWN PROMPT!
    print("\n4️⃣  Creating one-pager with AI...")
    print("   ⏳ This may take 10-30 seconds (OpenAI is thinking)...\n")

    # 🎨 CUSTOMIZE THIS PROMPT!
    YOUR_PROMPT = """
    Create a marketing one-pager for a new AI-powered code assistant
    that helps developers write better code faster. Target audience is
    software engineers and tech companies. Highlight speed, quality,
    and ease of use.
    """

    onepager_response = requests.post(
        f"{BASE_URL}/onepagers",
        headers=headers,
        json={
            "title": "AI Code Assistant Launch",
            "input_prompt": YOUR_PROMPT.strip(),
            "brand_kit_id": brand_kit_id,
            "target_audience": "Software developers and tech companies"
        },
        timeout=60
    )

    onepager = onepager_response.json()
    onepager_id = onepager["_id"]

    print("   ✅ One-pager created!\n")
    print("=" * 70)
    print("📄 AI-GENERATED ONE-PAGER")
    print("=" * 70)
    print(f"\n📌 Title: {onepager['title']}")
    print(f"\n🎯 Headline: {onepager['content']['headline']}")
    print(f"\n📝 Subheadline: {onepager['content'].get('subheadline', 'N/A')}")
    print(f"\n📊 Sections ({len(onepager['content']['sections'])}):")

    for i, section in enumerate(onepager['content']['sections'], 1):
        print(f"\n   {i}. [{section['type'].upper()}]")
        content = section['content']
        if isinstance(content, list):
            for item in content:
                print(f"      • {item}")
        else:
            print(f"      {content[:100]}..." if len(str(content)) > 100 else f"      {content}")

    print("\n" + "=" * 70)

    # 5. Iterate/Refine
    print("\n5️⃣  Refining with AI feedback...")
    print("   ⏳ AI is making improvements...\n")

    iterate_response = requests.put(
        f"{BASE_URL}/onepagers/{onepager_id}/iterate",
        headers=headers,
        json={
            "feedback": "Make the headline shorter and more impactful. Add a section about pricing.",
            "apply_brand_styles": False
        },
        timeout=60
    )

    refined = iterate_response.json()
    print(f"   ✅ Refined! New headline: {refined['content']['headline']}")
    print(f"   📈 Iterations: {refined['generation_metadata']['iterations']}")

    # 6. Apply Brand Styles
    print("\n6️⃣  Applying brand styles...")
    style_response = requests.put(
        f"{BASE_URL}/onepagers/{onepager_id}/iterate",
        headers=headers,
        json={"apply_brand_styles": True}
    )
    print(f"   ✅ Status: {style_response.json()['status']} (styled mode)")

    # Summary
    print("\n" + "=" * 70)
    print("🎉 DEMO COMPLETE!")
    print("=" * 70)
    print(f"\n📋 One-Pager ID: {onepager_id}")
    print(f"🎨 Brand Kit ID: {brand_kit_id}")
    print(f"\n🔗 View in Swagger UI:")
    print(f"   http://localhost:8000/docs")
    print(f"\n💡 TIP: Edit 'YOUR_PROMPT' in this script to try different prompts!")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    main()
