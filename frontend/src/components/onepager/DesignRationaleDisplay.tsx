/**
 * DesignRationaleDisplay Component
 *
 * Displays AI's design rationale and explanations for layout choices.
 * Shows why specific layout parameters were suggested.
 */

import { memo } from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';

interface DesignRationaleDisplayProps {
  /** AI's design rationale text */
  rationale?: string | null;

  /** Whether the rationale is from a suggestion (vs applied iteration) */
  isSuggestion?: boolean;
}

/**
 * DesignRationaleDisplay Component
 *
 * Renders AI design rationale with appropriate styling:
 * - Purple background for suggestions (not yet applied)
 * - Blue background for applied changes
 * - Displays explanation text with proper formatting
 */
export const DesignRationaleDisplay = memo(({
  rationale,
  isSuggestion = false,
}: DesignRationaleDisplayProps) => {
  // Don't render if no rationale
  if (!rationale || rationale.trim() === '') {
    return null;
  }

  const bgColor = isSuggestion ? 'purple.50' : 'blue.50';
  const borderColor = isSuggestion ? 'purple.200' : 'blue.200';
  const iconBgColor = isSuggestion ? 'purple.100' : 'blue.100';
  const textColor = isSuggestion ? 'purple.900' : 'blue.900';
  const icon = isSuggestion ? '💡' : '✨';
  const title = isSuggestion ? 'AI Suggestion' : 'Design Rationale';

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      role="region"
      aria-label="Design rationale"
    >
      <HStack align="start" gap={3}>
        {/* Icon */}
        <Box
          flexShrink={0}
          w="32px"
          h="32px"
          bg={iconBgColor}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="18px"
        >
          {icon}
        </Box>

        {/* Content */}
        <Box flex="1">
          <Text
            fontSize="13px"
            fontWeight="600"
            color={textColor}
            mb={2}
            textTransform="uppercase"
            letterSpacing="0.5px"
          >
            {title}
          </Text>
          <Text
            fontSize="14px"
            color="gray.800"
            lineHeight="1.6"
            whiteSpace="pre-wrap"
          >
            {rationale}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
});

DesignRationaleDisplay.displayName = 'DesignRationaleDisplay';
