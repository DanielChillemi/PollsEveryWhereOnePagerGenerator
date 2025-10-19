/**
 * LayoutParamsEditor Component
 *
 * Provides UI controls for editing typography and spacing parameters.
 * Used within DesignControlPanel for AI-driven layout customization.
 */

import { memo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Field,
} from '@chakra-ui/react';
import type { Typography, Spacing } from '../../types/onepager';

interface LayoutParamsEditorProps {
  /** Current typography parameters */
  typography: Typography;

  /** Current spacing parameters */
  spacing: Spacing;

  /** Callback when typography changes */
  onTypographyChange: (typography: Typography) => void;

  /** Callback when spacing changes */
  onSpacingChange: (spacing: Spacing) => void;

  /** Whether controls are disabled */
  disabled?: boolean;
}

/**
 * LayoutParamsEditor Component
 *
 * Provides sliders and selectors for adjusting layout parameters:
 * - Typography: H1/H2/Body scales, line height
 * - Spacing: Section gap, padding scale
 */
export const LayoutParamsEditor = memo(({
  typography,
  spacing,
  onTypographyChange,
  onSpacingChange,
  disabled = false,
}: LayoutParamsEditorProps) => {
  // Helper to format slider values
  const formatScale = (value: number) => `${value.toFixed(1)}x`;

  return (
    <VStack align="stretch" gap={6}>
      {/* Typography Controls */}
      <Box>
        <Text fontSize="16px" fontWeight="600" color="#2d3748" mb={4}>
          Typography Scaling
        </Text>

        <VStack align="stretch" gap={4}>
          {/* H1 Scale */}
          <Field.Root>
            <HStack justify="space-between" mb={2}>
              <Field.Label fontSize="14px" color="gray.700">
                Heading 1 Size
              </Field.Label>
              <Text fontSize="13px" color="gray.600" fontWeight="500">
                {formatScale(typography.h1_scale)}
              </Text>
            </HStack>
            <Input
              type="range"
              value={typography.h1_scale}
              min={0.8}
              max={1.5}
              step={0.1}
              disabled={disabled}
              onChange={(e) =>
                onTypographyChange({ ...typography, h1_scale: parseFloat(e.target.value) })
              }
              cursor="pointer"
            />
            <HStack justify="space-between" mt={1}>
              <Text fontSize="11px" color="gray.500">0.8x (Smaller)</Text>
              <Text fontSize="11px" color="gray.500">1.5x (Larger)</Text>
            </HStack>
          </Field.Root>

          {/* H2 Scale */}
          <Field.Root>
            <HStack justify="space-between" mb={2}>
              <Field.Label fontSize="14px" color="gray.700">
                Heading 2 Size
              </Field.Label>
              <Text fontSize="13px" color="gray.600" fontWeight="500">
                {formatScale(typography.h2_scale)}
              </Text>
            </HStack>
            <Input
              type="range"
              value={typography.h2_scale}
              min={0.8}
              max={1.5}
              step={0.1}
              disabled={disabled}
              onChange={(e) =>
                onTypographyChange({ ...typography, h2_scale: parseFloat(e.target.value) })
              }
              cursor="pointer"
            />
            <HStack justify="space-between" mt={1}>
              <Text fontSize="11px" color="gray.500">0.8x</Text>
              <Text fontSize="11px" color="gray.500">1.5x</Text>
            </HStack>
          </Field.Root>

          {/* Body Scale */}
          <Field.Root>
            <HStack justify="space-between" mb={2}>
              <Field.Label fontSize="14px" color="gray.700">
                Body Text Size
              </Field.Label>
              <Text fontSize="13px" color="gray.600" fontWeight="500">
                {formatScale(typography.body_scale)}
              </Text>
            </HStack>
            <Input
              type="range"
              value={typography.body_scale}
              min={0.8}
              max={1.3}
              step={0.1}
              disabled={disabled}
              onChange={(e) =>
                onTypographyChange({ ...typography, body_scale: parseFloat(e.target.value) })
              }
              cursor="pointer"
            />
            <HStack justify="space-between" mt={1}>
              <Text fontSize="11px" color="gray.500">0.8x</Text>
              <Text fontSize="11px" color="gray.500">1.3x</Text>
            </HStack>
          </Field.Root>

          {/* Line Height Scale */}
          <Field.Root>
            <HStack justify="space-between" mb={2}>
              <Field.Label fontSize="14px" color="gray.700">
                Line Height
              </Field.Label>
              <Text fontSize="13px" color="gray.600" fontWeight="500">
                {formatScale(typography.line_height_scale)}
              </Text>
            </HStack>
            <Input
              type="range"
              value={typography.line_height_scale}
              min={0.8}
              max={1.4}
              step={0.1}
              disabled={disabled}
              onChange={(e) =>
                onTypographyChange({ ...typography, line_height_scale: parseFloat(e.target.value) })
              }
              cursor="pointer"
            />
            <HStack justify="space-between" mt={1}>
              <Text fontSize="11px" color="gray.500">0.8x (Compact)</Text>
              <Text fontSize="11px" color="gray.500">1.4x (Loose)</Text>
            </HStack>
          </Field.Root>
        </VStack>
      </Box>

      {/* Spacing Controls */}
      <Box pt={4} borderTop="1px solid" borderColor="gray.200">
        <Text fontSize="16px" fontWeight="600" color="#2d3748" mb={4}>
          Spacing & Layout
        </Text>

        <VStack align="stretch" gap={4}>
          {/* Section Gap - Dropdown with enhanced visibility */}
          <Box
            p={3}
            bg="gray.50"
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
            transition="all 0.2s"
            _hover={{
              bg: 'blue.50',
              borderColor: 'blue.300',
            }}
          >
            <Field.Root>
              <Field.Label fontSize="14px" color="gray.700" mb={2} fontWeight="500">
                Section Gap
              </Field.Label>
              <select
                value={spacing.section_gap}
                onChange={(e) =>
                  onSpacingChange({ ...spacing, section_gap: e.target.value as 'tight' | 'normal' | 'loose' })
                }
                disabled={disabled}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: '#CBD5E0',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!disabled) {
                    e.currentTarget.style.borderColor = '#3182CE';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E0';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3182CE';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E0';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
              >
                <option value="tight">Tight (2rem)</option>
                <option value="normal">Normal (4rem)</option>
                <option value="loose">Loose (6rem)</option>
              </select>
              <Text fontSize="11px" color="gray.600" mt={2} fontStyle="italic">
                ↑ Click to select vertical spacing between sections
              </Text>
            </Field.Root>
          </Box>

          {/* Padding Scale - Slider with enhanced visibility */}
          <Box
            p={3}
            bg="gray.50"
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Field.Root>
              <HStack justify="space-between" mb={3}>
                <Field.Label fontSize="14px" color="gray.700" fontWeight="500">
                  Padding Scale
                </Field.Label>
                <Text fontSize="14px" color="blue.600" fontWeight="600" px={2} py={0.5} bg="blue.50" borderRadius="md">
                  {formatScale(spacing.padding_scale)}
                </Text>
              </HStack>
              <Box
                p={2}
                bg="white"
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
              >
                <Input
                  type="range"
                  value={spacing.padding_scale}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  disabled={disabled}
                  onChange={(e) =>
                    onSpacingChange({ ...spacing, padding_scale: parseFloat(e.target.value) })
                  }
                  cursor="pointer"
                  accentColor="blue.500"
                />
              </Box>
              <HStack justify="space-between" mt={2}>
                <Text fontSize="11px" color="gray.500">0.5x (Compact)</Text>
                <Text fontSize="11px" color="gray.500">2.0x (Spacious)</Text>
              </HStack>
            </Field.Root>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
});

LayoutParamsEditor.displayName = 'LayoutParamsEditor';
