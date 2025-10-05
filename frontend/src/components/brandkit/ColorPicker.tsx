/**
 * Color Picker Component
 *
 * Interactive color picker with hex input
 */

import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Box, Input, Text, VStack } from '@chakra-ui/react'

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
}

export const ColorPicker = ({ label, color, onChange }: ColorPickerProps) => {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <VStack align="stretch" gap={2}>
      <Text fontSize="sm" fontWeight="semibold" color="brand.text">
        {label}
      </Text>

      <Box position="relative">
        {/* Color Preview Box */}
        <Box
          width="100%"
          height="50px"
          bg={color}
          borderRadius="md"
          border="2px solid"
          borderColor="brand.border"
          cursor="pointer"
          onClick={() => setShowPicker(!showPicker)}
          transition="all 0.2s"
          _hover={{
            borderColor: 'brand.primary',
            transform: 'scale(1.02)',
          }}
        />

        {/* Hex Input */}
        <Input
          value={color.toUpperCase()}
          onChange={(e) => {
            const value = e.target.value
            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
              onChange(value)
            }
          }}
          placeholder="#000000"
          mt={2}
          textAlign="center"
          fontFamily="monospace"
          fontSize="sm"
          textTransform="uppercase"
        />

        {/* Color Picker Popup */}
        {showPicker && (
          <>
            {/* Backdrop */}
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              zIndex={10}
              onClick={() => setShowPicker(false)}
            />

            {/* Picker */}
            <Box
              position="absolute"
              top="60px"
              left={0}
              zIndex={20}
              bg="white"
              p={4}
              borderRadius="lg"
              boxShadow="2xl"
              border="1px solid"
              borderColor="brand.border"
            >
              <HexColorPicker color={color} onChange={onChange} />
            </Box>
          </>
        )}
      </Box>
    </VStack>
  )
}
