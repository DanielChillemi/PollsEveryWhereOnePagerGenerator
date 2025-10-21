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
from backend.models.onepager import (
    LayoutParams,
    get_default_layout_params,
    validate_layout_params,
    merge_layout_params
)

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
4. Use clear, benefit-driven headlines
5. Make the layout scannable and visual
6. You can include as many sections as needed to convey the message effectively

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

CRITICAL BRAND VOICE REQUIREMENTS:
Your content MUST embody this brand voice: "{brand_voice}"

Apply the brand voice to every element:
- HEADLINES: Capture attention while staying true to the voice tone
- SUBHEADLINES: Support the main message in the same voice
- BODY TEXT: Explain benefits and features using the brand's communication style
- LISTS: Keep bullet points aligned with the voice (formal vs. casual, technical vs. accessible)
- CALL-TO-ACTION: Use action words that match the brand's personality

Examples of voice application:
- If voice is "Bold and innovative" → Use strong, confident language, challenge status quo
- If voice is "Friendly and approachable" → Use conversational tone, simple language, empathy
- If voice is "Professional and authoritative" → Use formal language, data-driven, expertise
- If voice is "Playful and creative" → Use humor, metaphors, unexpected angles

The brand voice should be immediately recognizable throughout the entire one-pager.
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

CRITICAL BRAND VOICE REQUIREMENTS:
Brand Voice: "{brand_voice}"

When making ANY modifications:
1. PRESERVE the brand voice in all existing content
2. APPLY the brand voice to any new content you add
3. ENSURE tone consistency across all sections (headlines, body, CTAs)
4. REFLECT the brand's personality in word choice and phrasing

All changes must maintain the "{brand_voice}" tone throughout the entire document.
Even small edits must stay true to this brand voice.
"""

        return f"""Refine this marketing one-pager based on user feedback:

CURRENT LAYOUT:
{json.dumps(current_layout, indent=2)}

USER FEEDBACK: {user_feedback}{brand_voice_guidance}

CRITICAL INSTRUCTIONS:
- If user says "Add a new section", you MUST add a NEW section to the sections array
- If user says "Remove", you MUST delete that section
- If user says "Modify" or "Change", update the existing content
- When adding sections, increment the section count
- Maintain proper section ordering with the "order" field
- Give each section a unique "id" (e.g., "section-1", "section-2", "section-6" if adding 6th)
- Return the COMPLETE updated JSON structure with ALL sections (existing + new)

EXAMPLES:
- "Add a new section about pricing" → Add section-6 with pricing content
- "Make headline catchier" → Modify existing headline
- "Remove the benefits list" → Delete that section from array

Return ONLY valid JSON matching the exact schema, no other text."""

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

    async def refine_onepager_with_design(
        self,
        current_content: Dict[str, Any],
        current_layout_params: Optional[LayoutParams],
        user_feedback: str,
        brand_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Refine both content AND layout parameters based on user feedback.

        This is the core method for iterative design - AI can modify both
        content (headlines, sections) and design (spacing, typography, colors).

        Args:
            current_content: Current one-pager content (headline, sections)
            current_layout_params: Current layout parameters (or None for defaults)
            user_feedback: User's refinement instructions
            brand_context: Brand kit data (colors, fonts, voice)

        Returns:
            dict: {
                "content": {...},  # Updated content
                "layout_params": {...},  # Updated layout parameters
                "design_rationale": "..."  # AI's explanation for design choices
            }

        Example:
            >>> result = await ai_service.refine_onepager_with_design(
            ...     current_content={"headline": "...", "sections": [...]},
            ...     current_layout_params=current_params,
            ...     user_feedback="Make it more compact and use 2 columns for features",
            ...     brand_context=brand_kit_data
            ... )
            >>> print(result["design_rationale"])
            "I've adjusted spacing to 'tight' and set features to 2 columns..."
        """
        # Get current layout params or defaults
        if current_layout_params is None:
            current_layout_params = get_default_layout_params()

        # Build enhanced system prompt that includes design capabilities
        system_prompt = self._build_design_system_prompt()

        # Build user message with content, layout params, and feedback
        user_message = self._build_design_refinement_prompt(
            current_content,
            current_layout_params,
            user_feedback,
            brand_context
        )

        # Call AI API
        try:
            response_text = await self._call_openai_api(system_prompt, user_message)

            # Parse JSON response
            result = self._parse_ai_response(response_text)

            # Validate and extract layout_params
            layout_params_data = result.get("layout_params", {})
            validated_params = validate_layout_params(layout_params_data)

            if validated_params is None:
                # If AI returned invalid layout_params, use current/default
                logger.warning("⚠️ AI returned invalid layout_params, using defaults")
                validated_params = current_layout_params

            # Extract design rationale
            design_rationale = result.get("design_rationale", "")

            if len(design_rationale) < 50:
                logger.warning("⚠️ AI design rationale too short, adding default")
                design_rationale = "Layout parameters adjusted based on user feedback."

            logger.info("✅ Successfully refined content and design using OpenAI")

            return {
                "content": result.get("content", current_content),
                "layout_params": validated_params.dict(),
                "design_rationale": design_rationale
            }

        except Exception as e:
            logger.error(f"❌ Failed to refine with design: {e}")
            # Return current state unchanged on error
            return {
                "content": current_content,
                "layout_params": current_layout_params.dict() if current_layout_params else get_default_layout_params().dict(),
                "design_rationale": "Unable to generate design suggestions at this time."
            }

    async def suggest_layout(
        self,
        current_content: Dict[str, Any],
        current_layout_params: Optional[LayoutParams],
        brand_context: Optional[Dict[str, Any]] = None,
        design_goal: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Suggest layout parameters WITHOUT modifying content.

        This method analyzes current content and suggests optimal layout
        parameters (spacing, typography, section layouts). Does NOT change
        the content itself.

        Args:
            current_content: Current one-pager content (for analysis)
            current_layout_params: Current layout parameters
            brand_context: Brand kit data
            design_goal: Optional design goal (e.g., "modern", "compact", "bold")

        Returns:
            dict: {
                "suggested_layout_params": {...},
                "design_rationale": "..."
            }

        Example:
            >>> result = await ai_service.suggest_layout(
            ...     current_content={"headline": "...", "sections": [...]},
            ...     current_layout_params=current_params,
            ...     design_goal="compact and modern"
            ... )
            >>> print(result["design_rationale"])
            "Based on your 8 features, I recommend 3-column layout..."
        """
        # Get current layout params or defaults
        if current_layout_params is None:
            current_layout_params = get_default_layout_params()

        # Build system prompt for layout suggestion
        system_prompt = self._build_layout_suggestion_system_prompt()

        # Build user message
        user_message = self._build_layout_suggestion_prompt(
            current_content,
            current_layout_params,
            brand_context,
            design_goal
        )

        # Call AI API
        try:
            response_text = await self._call_openai_api(system_prompt, user_message)

            # Parse JSON response
            result = self._parse_ai_response(response_text)

            # Validate layout_params
            layout_params_data = result.get("layout_params", {})
            validated_params = validate_layout_params(layout_params_data)

            if validated_params is None:
                logger.warning("⚠️ AI returned invalid layout_params for suggestion")
                validated_params = current_layout_params

            design_rationale = result.get("design_rationale", "")

            if len(design_rationale) < 50:
                design_rationale = "Layout suggestion based on content analysis."

            logger.info("✅ Successfully generated layout suggestion using OpenAI")

            return {
                "suggested_layout_params": validated_params.dict(),
                "design_rationale": design_rationale
            }

        except Exception as e:
            logger.error(f"❌ Failed to suggest layout: {e}")
            return {
                "suggested_layout_params": current_layout_params.dict() if current_layout_params else get_default_layout_params().dict(),
                "design_rationale": "Unable to generate layout suggestions at this time."
            }

    def _build_design_system_prompt(self) -> str:
        """Build system prompt for AI with design capabilities."""
        return """You are an expert marketing one-pager designer with expertise in both content AND visual design.

Your role is to refine BOTH content and layout parameters to create beautiful, effective marketing materials.

CAPABILITIES:
1. Content Refinement: Modify headlines, sections, text based on feedback
2. Layout Design: Adjust spacing, typography, colors, and section layouts

DESIGN PRINCIPLES:
- Content-heavy pages → Tighter spacing (tight), smaller fonts (0.9x), more columns (2-3)
- Bold marketing pages → Loose spacing (loose), larger headings (1.3-1.4x), fewer columns (1-2)
- Feature lists → Use 2-3 columns for scannability
- Long text blocks → Use 1 column with generous line height (1.2-1.3x)
- Visual hierarchy → Larger h1 for important products, smaller for data-heavy content

LAYOUT PARAMETERS CONSTRAINTS:
- h1_scale: 0.8 to 1.5 (never exceed!)
- h2_scale: 0.8 to 1.5
- body_scale: 0.8 to 1.3
- line_height_scale: 0.8 to 1.4
- padding_scale: 0.5 to 2.0
- section_gap: "tight" | "normal" | "loose"
- section columns: 1 | 2 | 3
- section alignment: "left" | "center" | "right"
- Colors: MUST be hex format #RRGGBB

USER FEEDBACK INTERPRETATION:
- "more compact" / "tighter" → section_gap: "tight", padding_scale: 0.7-0.8
- "spacious" / "breathable" → section_gap: "loose", padding_scale: 1.3-1.5
- "larger headlines" → h1_scale: 1.3-1.4
- "use 2 columns" → section_layouts.features.columns: 2
- "modern" → loose spacing, clean typography
- "professional" → normal spacing, moderate scales

RESPONSE FORMAT:
You MUST respond with valid JSON only, containing:
{
  "content": {
    "headline": "...",
    "subheadline": "...",
    "sections": [...]
  },
  "layout_params": {
    "color_scheme": {"primary": "#...", "secondary": "#...", ...},
    "typography": {"h1_scale": 1.0, "h2_scale": 1.0, ...},
    "spacing": {"section_gap": "normal", "padding_scale": 1.0},
    "section_layouts": {
      "features": {"columns": 2, "alignment": "left", "image_position": "top"},
      ...
    }
  },
  "design_rationale": "Clear explanation of your design decisions (min 50 characters)"
}

CRITICAL: design_rationale MUST explain WHY you made specific layout choices."""

    def _build_design_refinement_prompt(
        self,
        current_content: Dict[str, Any],
        current_layout_params: LayoutParams,
        user_feedback: str,
        brand_context: Optional[Dict[str, Any]]
    ) -> str:
        """Build prompt for content + design refinement."""
        # Analyze content characteristics
        sections = current_content.get("sections", [])
        feature_count = sum(1 for s in sections if s.get("type") == "list")
        text_count = sum(1 for s in sections if s.get("type") == "text")

        content_analysis = f"""
CONTENT CHARACTERISTICS:
- Total sections: {len(sections)}
- List/feature sections: {feature_count}
- Text blocks: {text_count}
"""

        brand_info = ""
        if brand_context:
            brand_voice = brand_context.get('brand_voice', 'Professional')
            brand_colors = brand_context.get('color_palette', {})
            brand_info = f"""
BRAND CONTEXT:
- Company: {brand_context.get('company_name', 'N/A')}
- Brand Voice: {brand_voice}
- Brand Primary Color: {brand_colors.get('primary', '#007ACC')}
- Brand Secondary Color: {brand_colors.get('secondary', '#5C2D91')}
"""

        # Convert layout params to dict for display
        current_layout_dict = current_layout_params.dict()

        return f"""Refine this marketing one-pager based on user feedback.

CURRENT CONTENT:
{json.dumps(current_content, indent=2)}

CURRENT LAYOUT PARAMETERS:
{json.dumps(current_layout_dict, indent=2)}
{content_analysis}{brand_info}
USER FEEDBACK: {user_feedback}

INSTRUCTIONS:
1. Analyze the user feedback to determine if it's about:
   - Content (text changes, new sections, etc.) → Modify content
   - Design (spacing, columns, fonts, etc.) → Modify layout_params
   - Both → Modify both

2. Apply design principles:
   - More features → Consider multi-column layout
   - Feedback mentions "compact" → Tighter spacing and smaller scales
   - Feedback mentions "bold" / "modern" → Larger headings and loose spacing

3. Preserve brand colors unless user explicitly requests color changes

4. Write a clear design_rationale explaining your layout decisions

Return ONLY valid JSON matching the schema."""

    def _build_layout_suggestion_system_prompt(self) -> str:
        """Build system prompt for layout-only suggestions."""
        return """You are a professional one-pager layout designer specializing in layout optimization.

Your role is to analyze content and suggest optimal layout parameters WITHOUT changing the content.

ANALYSIS FACTORS:
1. Content density: More content → tighter spacing, more columns
2. Content type: Features → multi-column, long text → single column
3. Visual emphasis: Hero products → larger headings, data → smaller fonts
4. Readability: Long paragraphs → increased line height

DESIGN RECOMMENDATIONS:
- 1-3 features: 1 column, loose spacing
- 4-6 features: 2 columns, normal spacing
- 7+ features: 3 columns, tight spacing
- Long text blocks: 1 column, line_height_scale: 1.2-1.3
- Marketing hero: h1_scale: 1.3-1.4, loose spacing
- Data-heavy: h1_scale: 0.9-1.0, tight spacing, smaller fonts

CONSTRAINTS (CRITICAL - DO NOT EXCEED):
- h1_scale: 0.8 - 1.5
- h2_scale: 0.8 - 1.5
- body_scale: 0.8 - 1.3
- line_height_scale: 0.8 - 1.4
- padding_scale: 0.5 - 2.0
- section_gap: "tight" | "normal" | "loose"
- columns: 1 | 2 | 3
- alignment: "left" | "center" | "right"
- colors: hex format #RRGGBB

RESPONSE FORMAT:
{
  "layout_params": { /* LayoutParams object */ },
  "design_rationale": "Detailed explanation of layout recommendations (min 50 chars)"
}

Return ONLY valid JSON."""

    def _build_layout_suggestion_prompt(
        self,
        current_content: Dict[str, Any],
        current_layout_params: LayoutParams,
        brand_context: Optional[Dict[str, Any]],
        design_goal: Optional[str]
    ) -> str:
        """Build prompt for layout suggestion."""
        # Analyze content
        sections = current_content.get("sections", [])
        list_sections = [s for s in sections if s.get("type") == "list"]
        text_sections = [s for s in sections if s.get("type") == "text"]

        # Count features
        total_features = 0
        for section in list_sections:
            content = section.get("content", [])
            if isinstance(content, list):
                total_features += len(content)

        content_analysis = f"""
CONTENT ANALYSIS:
- Total sections: {len(sections)}
- List sections (features/benefits): {len(list_sections)}
- Text blocks: {len(text_sections)}
- Total list items: {total_features}
"""

        brand_info = ""
        if brand_context:
            brand_colors = brand_context.get('color_palette', {})
            brand_info = f"""
BRAND CONTEXT:
- Primary Color: {brand_colors.get('primary', '#007ACC')}
- Secondary Color: {brand_colors.get('secondary', '#5C2D91')}
"""

        goal_info = ""
        if design_goal:
            goal_info = f"\nDESIGN GOAL: {design_goal}"

        current_layout_dict = current_layout_params.dict()

        return f"""Analyze this content and suggest optimal layout parameters.

CURRENT CONTENT:
{json.dumps(current_content, indent=2)}

CURRENT LAYOUT:
{json.dumps(current_layout_dict, indent=2)}
{content_analysis}{brand_info}{goal_info}

Based on the content characteristics and design goal, suggest layout parameters that will:
1. Optimize readability
2. Create visual hierarchy
3. Match the content density
4. Support the design goal (if specified)

Provide detailed rationale explaining your layout choices.

Return ONLY valid JSON matching the schema."""


# Singleton instance
ai_service = AIService()
