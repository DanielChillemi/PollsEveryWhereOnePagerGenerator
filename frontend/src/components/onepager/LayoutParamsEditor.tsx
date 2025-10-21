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
    <VStack align="stretch" gap={2}>
      {/* Typography Controls */}
      <Box>
        <Text fontSize="14px" fontWeight="700" color="#2d3748" mb={1.5}>
          Typography Scaling
        </Text>

        <VStack align="stretch" gap={2}>
          {/* H1 Scale */}
          <Field.Root>
            <HStack justify="space-between" mb={0.5}>
              <Field.Label fontSize="13px" color="gray.700" fontWeight="500">
                Heading 1 Size
              </Field.Label>
              <Text fontSize="13px" color="purple.600" fontWeight="700">
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
          </Field.Root>

          {/* H2 Scale */}
          <Field.Root>
            <HStack justify="space-between" mb={0.5}>
              <Field.Label fontSize="13px" color="gray.700" fontWeight="500">
                Heading 2 Size
              </Field.Label>
              <Text fontSize="13px" color="purple.600" fontWeight="700">
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
          </Field.Root>

          {/* Body Scale */}
          <Field.Root>
            <HStack justify="space-between" mb={0.5}>
              <Field.Label fontSize="13px" color="gray.700" fontWeight="500">
                Body Text Size
              </Field.Label>
              <Text fontSize="13px" color="purple.600" fontWeight="700">
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
          </Field.Root>

          {/* Line Height Scale */}
          <Field.Root>
            <HStack justify="space-between" mb={0.5}>
              <Field.Label fontSize="13px" color="gray.700" fontWeight="500">
                Line Height
              </Field.Label>
              <Text fontSize="13px" color="purple.600" fontWeight="700">
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
          </Field.Root>
        </VStack>
      </Box>

      {/* Spacing Controls */}
      <Box pt={1.5} borderTop="1px solid" borderColor="gray.200">
        <Text fontSize="14px" fontWeight="700" color="#2d3748" mb={1.5}>
          Spacing & Layout
        </Text>

        <VStack align="stretch" gap={2}>
          {/* Section Gap */}
          <Field.Root>
            <Field.Label fontSize="13px" color="gray.700" mb={0.5} fontWeight="500">
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
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: '500',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#CBD5E0',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="tight">Tight (2rem)</option>
              <option value="normal">Normal (4rem)</option>
              <option value="loose">Loose (6rem)</option>
            </select>
          </Field.Root>

          {/* Padding Scale */}
          <Field.Root>
            <HStack justify="space-between" mb={0.5}>
              <Field.Label fontSize="13px" color="gray.700" fontWeight="500">
                Padding Scale
              </Field.Label>
              <Text fontSize="13px" color="purple.600" fontWeight="700">
                {formatScale(spacing.padding_scale)}
              </Text>
            </HStack>
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
            />
          </Field.Root>
        </VStack>
      </Box>
    </VStack>
  );
});

LayoutParamsEditor.displayName = 'LayoutParamsEditor';
