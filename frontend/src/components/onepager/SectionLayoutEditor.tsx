/**
 * SectionLayoutEditor Component
 *
 * Provides UI controls for editing per-section layout configuration.
 * Allows customization of columns, alignment, and image positioning for each section.
 */

import { memo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Field,
  Badge,
} from '@chakra-ui/react';
import type { SectionLayout } from '../../types/onepager';

interface SectionLayoutEditorProps {
  /** Section layouts keyed by section name */
  sectionLayouts: Record<string, SectionLayout>;

  /** Callback when section layout changes */
  onSectionLayoutChange: (sectionName: string, layout: SectionLayout) => void;

  /** Whether controls are disabled */
  disabled?: boolean;
}

/**
 * SectionLayoutEditor Component
 *
 * Provides controls for per-section layout configuration:
 * - Columns (1-3 columns)
 * - Alignment (left/center/right)
 * - Image Position (top/left/right/none)
 */
export const SectionLayoutEditor = memo(({
  sectionLayouts,
  onSectionLayoutChange,
  disabled = false,
}: SectionLayoutEditorProps) => {
  // Define common section types with user-friendly labels
  const sections = [
    { key: 'features', label: 'Features', icon: '✨' },
    { key: 'benefits', label: 'Benefits', icon: '💎' },
    { key: 'integrations', label: 'Integrations', icon: '🔌' },
  ];

  // Get layout for a section or return default
  const getLayout = (sectionKey: string): SectionLayout => {
    return sectionLayouts[sectionKey] || {
      columns: 1,
      alignment: 'left',
      image_position: 'top',
    };
  };

  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Text fontSize="14px" color="gray.600" mb={4}>
          Configure the layout for each section type. These settings control how
          content is displayed in the exported PDF.
        </Text>

        <VStack align="stretch" gap={5}>
          {sections.map((section) => {
            const layout = getLayout(section.key);

            return (
              <Box
                key={section.key}
                p={4}
                bg="gray.50"
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
              >
                {/* Section Header */}
                <HStack mb={4}>
                  <Text fontSize="18px">{section.icon}</Text>
                  <Text fontSize="15px" fontWeight="600" color="#2d3748">
                    {section.label}
                  </Text>
                  <Badge
                    colorScheme={layout.columns > 1 ? 'purple' : 'gray'}
                    size="sm"
                  >
                    {layout.columns} col{layout.columns > 1 ? 's' : ''}
                  </Badge>
                </HStack>

                <VStack align="stretch" gap={3}>
                  {/* Columns Selector */}
                  <Field.Root>
                    <Field.Label fontSize="13px" color="gray.700">
                      Columns
                    </Field.Label>
                    <Select.Root
                      value={[String(layout.columns)]}
                      onValueChange={({ value }) =>
                        onSectionLayoutChange(section.key, {
                          ...layout,
                          columns: Number(value[0]) as 1 | 2 | 3,
                        })
                      }
                      disabled={disabled}
                      size="sm"
                    >
                      <Select.Trigger>
                        <Select.ValueText />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item item="1">
                          <Select.ItemText>1 Column (Full width)</Select.ItemText>
                        </Select.Item>
                        <Select.Item item="2">
                          <Select.ItemText>2 Columns (Grid)</Select.ItemText>
                        </Select.Item>
                        <Select.Item item="3">
                          <Select.ItemText>3 Columns (Grid)</Select.ItemText>
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Field.Root>

                  {/* Alignment Selector */}
                  <Field.Root>
                    <Field.Label fontSize="13px" color="gray.700">
                      Alignment
                    </Field.Label>
                    <Select.Root
                      value={[layout.alignment]}
                      onValueChange={({ value }) =>
                        onSectionLayoutChange(section.key, {
                          ...layout,
                          alignment: value[0] as 'left' | 'center' | 'right',
                        })
                      }
                      disabled={disabled}
                      size="sm"
                    >
                      <Select.Trigger>
                        <Select.ValueText />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item item="left">
                          <Select.ItemText>← Left</Select.ItemText>
                        </Select.Item>
                        <Select.Item item="center">
                          <Select.ItemText>↔ Center</Select.ItemText>
                        </Select.Item>
                        <Select.Item item="right">
                          <Select.ItemText>→ Right</Select.ItemText>
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Field.Root>

                  {/* Image Position Selector */}
                  <Field.Root>
                    <Field.Label fontSize="13px" color="gray.700">
                      Image Position
                    </Field.Label>
                    <Select.Root
                      value={[layout.image_position || 'top']}
                      onValueChange={({ value }) =>
                        onSectionLayoutChange(section.key, {
                          ...layout,
                          image_position: value[0] as 'top' | 'left' | 'right' | 'none',
                        })
                      }
                      disabled={disabled}
                      size="sm"
                    >
                      <Select.Trigger>
                        <Select.ValueText />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item item="top">
                          <Select.ItemText>Top</Select.ItemText>
                        </Select.Item>
                        <Select.Item item="left">
                          <Select.ItemText>Left</Select.ItemText>
                        </Select.Item>
                        <Select.Item item="right">
                          <Select.ItemText>Right</Select.ItemText>
                        </Select.Item>
                        <Select.Item item="none">
                          <Select.ItemText>None</Select.ItemText>
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Field.Root>
                </VStack>
              </Box>
            );
          })}
        </VStack>
      </Box>
    </VStack>
  );
});

SectionLayoutEditor.displayName = 'SectionLayoutEditor';
