/**
 * Font Selector Component
 *
 * Dropdown selector for font families with preview
 */

import { Select, Text, VStack } from '@chakra-ui/react'
import { FONT_OPTIONS } from '../../types/brandKit'

interface FontSelectorProps {
  label: string
  value: string
  onChange: (font: string) => void
}

export const FontSelector = ({ label, value, onChange }: FontSelectorProps) => {
  return (
    <VStack align="stretch" gap={2}>
      <Text fontSize="sm" fontWeight="semibold" color="brand.text">
        {label}
      </Text>

      <Select.Root
        value={[value]}
        onValueChange={(e) => onChange(e.value[0])}
        positioning={{ sameWidth: true }}
      >
        <Select.Trigger>
          <Select.ValueText placeholder="Select a font" />
        </Select.Trigger>
        <Select.Content>
          {FONT_OPTIONS.map((font) => (
            <Select.Item key={font.value} item={font.value}>
              <span style={{ fontFamily: font.value }}>{font.label}</span>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* Font Preview */}
      {value && (
        <Text
          fontSize="md"
          fontFamily={value}
          p={3}
          bg="brand.backgroundGray"
          borderRadius="md"
          border="1px solid"
          borderColor="brand.border"
        >
          The quick brown fox jumps over the lazy dog
        </Text>
      )}
    </VStack>
  )
}
