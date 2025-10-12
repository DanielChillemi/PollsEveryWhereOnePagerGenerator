"""
AI Service
==========

Integration with OpenAI API for GPT-4 and GPT-3.5-Turbo.
Generates and refines marketing one-pager layouts based on user prompts.
"""

import httpx
import json
import logging
from typing import Dict, Any, List, Optional
from backend.config import settings

logger = logging.getLogger(__name__)


class AIService:
    """
    AI service for generating and refining one-pager layouts.

    Uses OpenAI API with GPT-4 or GPT-3.5-Turbo.
    """

    def __init__(self):
        self.api_url = "https://api.openai.com/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {settings.openai_api_key}",
            "Content-Type": "application/json"
        }
        self.model = settings.ai_model_name  # Default: gpt-4-turbo-preview or gpt-3.5-turbo
        self.timeout = 60.0  # 60 seconds timeout for OpenAI

    async def generate_initial_wireframe(
        self,
        user_prompt: str,
        brand_context: Optional[Dict[str, Any]] = None,
        target_audience: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate initial wireframe layout from user prompt.

        Args:
            user_prompt: User's description of desired one-pager
            brand_context: Brand kit data (colors, fonts, voice)
            target_audience: Target audience description

        Returns:
            dict: Wireframe layout with content and structure
        """
        # Build system prompt
        system_prompt = self._build_system_prompt()

        # Build user message with context
        user_message = self._build_generation_prompt(
            user_prompt,
            brand_context,
            target_audience
        )

        # Call AI API
        try:
            response_text = await self._call_openai_api(system_prompt, user_message)

            # Parse JSON response
            wireframe = self._parse_ai_response(response_text)

            logger.info("✅ Successfully generated initial wireframe using OpenAI")
            return wireframe

        except Exception as e:
            logger.error(f"❌ Failed to generate wireframe: {e}")
            # Return fallback wireframe
            return self._get_fallback_wireframe(user_prompt)

    async def refine_layout(
        self,
        current_layout: Dict[str, Any],
        user_feedback: str,
        brand_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Refine existing layout based on user feedback.

        Args:
            current_layout: Current one-pager state (content + layout)
            user_feedback: User's refinement instructions
            brand_context: Brand kit data

        Returns:
            dict: Refined layout with modifications
        """
        # Build refinement prompt
        system_prompt = self._build_system_prompt()

        user_message = self._build_refinement_prompt(
            current_layout,
            user_feedback,
            brand_context
        )

        # Call AI API
        try:
            response_text = await self._call_openai_api(system_prompt, user_message)

            # Parse JSON response
            refined_layout = self._parse_ai_response(response_text)

            logger.info("✅ Successfully refined layout using OpenAI")
            return refined_layout

        except Exception as e:
            logger.error(f"❌ Failed to refine layout: {e}")
            # Return current layout with minor modifications
            return current_layout

    async def _call_openai_api(self, system_prompt: str, user_message: str) -> str:
        """
        Call OpenAI Chat Completions API.

        Args:
            system_prompt: System instructions
            user_message: User message

        Returns:
            str: AI response text
        """
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.7,
            "max_tokens": 2000,
            "response_format": {"type": "json_object"}  # Force JSON response
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                self.api_url,
                headers=self.headers,
                json=payload
            )

            if response.status_code != 200:
                error_detail = response.text
                logger.error(f"OpenAI API error: {response.status_code} - {error_detail}")
                raise Exception(f"OpenAI API returned status {response.status_code}: {error_detail}")

            result = response.json()

            # Extract content from OpenAI response
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                return content
            else:
                raise Exception("Unexpected OpenAI API response format")

    def _build_system_prompt(self) -> str:
        """Build system prompt for AI."""
        return """You are an expert marketing one-pager designer. Your role is to generate structured JSON layouts for professional marketing materials.

IMPORTANT RULES:
1. Always respond with valid JSON only - no other text
2. Use the exact JSON schema provided
3. Keep content concise and marketing-focused
4. Include 4-6 main sections maximum
5. Use clear, benefit-driven headlines
6. Make the layout scannable and visual

Your output must be parseable JSON that follows the schema exactly."""

    def _build_generation_prompt(
        self,
        user_prompt: str,
        brand_context: Optional[Dict[str, Any]],
        target_audience: Optional[str]
    ) -> str:
        """Build prompt for initial generation."""
        brand_info = ""
        if brand_context:
            brand_voice = brand_context.get('brand_voice', 'Professional and clear')
            brand_info = f"""
BRAND CONTEXT:
- Company: {brand_context.get('company_name', 'N/A')}
- Brand Voice: {brand_voice}
- Primary Color: {brand_context.get('color_palette', {}).get('primary', '#007ACC')}

TONE & STYLE GUIDANCE:
- Write all content in a tone that matches: "{brand_voice}"
- Ensure headlines, body text, and CTAs reflect this brand voice
- Maintain consistency with the brand's communication style throughout
"""

        audience_info = ""
        if target_audience:
            audience_info = f"\nTARGET AUDIENCE: {target_audience}"

        return f"""Generate a marketing one-pager layout based on this request:

USER REQUEST: {user_prompt}
{brand_info}{audience_info}

Generate a JSON wireframe with this EXACT schema:
{{
  "headline": "Main attention-grabbing headline (10-15 words max)",
  "subheadline": "Supporting subheadline (15-25 words max)",
  "sections": [
    {{
      "id": "section-1",
      "type": "heading",
      "content": "Section title",
      "order": 1
    }},
    {{
      "id": "section-2",
      "type": "text",
      "content": "Benefits-focused body text (2-3 sentences)",
      "order": 2
    }},
    {{
      "id": "section-3",
      "type": "list",
      "content": ["Key point 1", "Key point 2", "Key point 3"],
      "order": 3
    }},
    {{
      "id": "section-4",
      "type": "button",
      "content": "Call-to-action text",
      "order": 4
    }}
  ]
}}

Generate ONLY the JSON, no other text."""

    def _build_refinement_prompt(
        self,
        current_layout: Dict[str, Any],
        user_feedback: str,
        brand_context: Optional[Dict[str, Any]]
    ) -> str:
        """Build prompt for layout refinement."""
        brand_voice_guidance = ""
        if brand_context and brand_context.get('brand_voice'):
            brand_voice = brand_context['brand_voice']
            brand_voice_guidance = f"""

BRAND VOICE: {brand_voice}
- Maintain this brand voice in all content modifications
- Ensure tone and style remain consistent with: "{brand_voice}"
"""

        return f"""Refine this marketing one-pager based on user feedback:

CURRENT LAYOUT:
{json.dumps(current_layout, indent=2)}

USER FEEDBACK: {user_feedback}{brand_voice_guidance}

Modify the layout to address the feedback while maintaining the JSON schema.
Return the COMPLETE updated JSON structure with all sections, not just the changes.

Return ONLY valid JSON, no other text."""

    def _parse_ai_response(self, response_text: str) -> Dict[str, Any]:
        """
        Parse AI response and extract JSON.

        Args:
            response_text: Raw AI response

        Returns:
            dict: Parsed layout data
        """
        # OpenAI with json_object format should return clean JSON
        try:
            data = json.loads(response_text)
            return data
        except json.JSONDecodeError:
            # Fallback: Try to find JSON in response (in case format isn't enforced)
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1

            if start_idx == -1 or end_idx == 0:
                raise ValueError("No JSON found in AI response")

            json_str = response_text[start_idx:end_idx]

            try:
                data = json.loads(json_str)
                return data
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error: {e}")
                logger.error(f"Attempted to parse: {json_str[:200]}...")
                raise ValueError("Invalid JSON in AI response")

    def _get_fallback_wireframe(self, user_prompt: str) -> Dict[str, Any]:
        """
        Generate fallback wireframe when AI fails.

        Args:
            user_prompt: Original user prompt

        Returns:
            dict: Basic wireframe structure
        """
        return {
            "headline": "Your Marketing One-Pager",
            "subheadline": "Professional marketing materials made simple",
            "sections": [
                {
                    "id": "section-1",
                    "type": "heading",
                    "content": "About Our Solution",
                    "order": 1
                },
                {
                    "id": "section-2",
                    "type": "text",
                    "content": f"Based on your input: {user_prompt[:100]}...",
                    "order": 2
                },
                {
                    "id": "section-3",
                    "type": "list",
                    "content": [
                        "Key benefit or feature",
                        "Another important point",
                        "Final value proposition"
                    ],
                    "order": 3
                },
                {
                    "id": "section-4",
                    "type": "button",
                    "content": "Get Started",
                    "order": 4
                }
            ]
        }


# Singleton instance
ai_service = AIService()
