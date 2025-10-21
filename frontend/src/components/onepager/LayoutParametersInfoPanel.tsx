/**
 * LayoutParametersInfoPanel Component
 *
 * Displays current layout parameters in a compact info panel.
 * Useful for showing what typography and spacing values are currently applied.
 */

import { memo } from 'react';
import { Box, HStack, VStack, Text, Badge } from '@chakra-ui/react';
import type { LayoutParams } from '../../types/onepager';

interface LayoutParametersInfoPanelProps {
  /** Current layout parameters to display */
  layoutParams: LayoutParams | null | undefined;

  /** Whether to show in compact mode */
  compact?: boolean;
}

/**
 * LayoutParametersInfoPanel Component
 *
 * Shows current typography scales, spacing, and section layouts
 * in a compact, easy-to-read format.
 */
export const LayoutParametersInfoPanel = memo(({
  layoutParams,
  compact = false,
}: LayoutParametersInfoPanelProps) => {
  if (!layoutParams) {
    return (
      <Box
        p={3}
        bg="gray.50"
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Text fontSize="sm" color="gray.600">
          No layout parameters set. Using defaults.
        </Text>
      </Box>
    );
  }

  const { typography, spacing } = layoutParams;

  // Helper to format scale values
  const formatScale = (value: number) => `${value.toFixed(1)}x`;

  if (compact) {
    return (
      <HStack gap={2} flexWrap="wrap" fontSize="xs">
        <Badge colorScheme="blue" px={2} py={1}>
          H1: {formatScale(typography.h1_scale)}
        </Badge>
        <Badge colorScheme="blue" px={2} py={1}>
          H2: {formatScale(typography.h2_scale)}
        </Badge>
        <Badge colorScheme="green" px={2} py={1}>
          Body: {formatScale(typography.body_scale)}
        </Badge>
        <Badge colorScheme="purple" px={2} py={1}>
          Gap: {spacing.section_gap}
        </Badge>
        <Badge colorScheme="orange" px={2} py={1}>
          Padding: {formatScale(spacing.padding_scale)}
        </Badge>
      </HStack>
    );
  }

  return (
    <Box
      p={4}
      bg="gray.50"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <VStack align="stretch" gap={3}>
        {/* Typography Section */}
        <Box>
          <Text fontSize="xs" fontWeight="600" color="gray.700" mb={2} textTransform="uppercase" letterSpacing="wider">
            Typography
          </Text>
          <HStack gap={2} flexWrap="wrap">
            <Badge colorScheme="blue" px={2} py={1} fontSize="xs">
              H1: {formatScale(typography.h1_scale)}
            </Badge>
            <Badge colorScheme="blue" px={2} py={1} fontSize="xs">
              H2: {formatScale(typography.h2_scale)}
            </Badge>
            <Badge colorScheme="green" px={2} py={1} fontSize="xs">
              Body: {formatScale(typography.body_scale)}
            </Badge>
            <Badge colorScheme="cyan" px={2} py={1} fontSize="xs">
              Line Height: {formatScale(typography.line_height_scale)}
            </Badge>
          </HStack>
        </Box>

        {/* Spacing Section */}
        <Box>
          <Text fontSize="xs" fontWeight="600" color="gray.700" mb={2} textTransform="uppercase" letterSpacing="wider">
            Spacing
          </Text>
          <HStack gap={2} flexWrap="wrap">
            <Badge colorScheme="purple" px={2} py={1} fontSize="xs">
              Section Gap: {spacing.section_gap}
            </Badge>
            <Badge colorScheme="orange" px={2} py={1} fontSize="xs">
              Padding: {formatScale(spacing.padding_scale)}
            </Badge>
          </HStack>
        </Box>

        {/* Fonts Info */}
        <Box>
          <Text fontSize="xs" fontWeight="600" color="gray.700" mb={2} textTransform="uppercase" letterSpacing="wider">
            Fonts
          </Text>
          <HStack gap={2} flexWrap="wrap">
            <Badge colorScheme="gray" px={2} py={1} fontSize="xs">
              Heading: {typography.heading_font}
            </Badge>
            <Badge colorScheme="gray" px={2} py={1} fontSize="xs">
              Body: {typography.body_font}
            </Badge>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
});

LayoutParametersInfoPanel.displayName = 'LayoutParametersInfoPanel';
