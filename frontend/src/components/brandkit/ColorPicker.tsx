import { useState } from 'react';
import { Box, VStack, HStack, Text, Input } from '@chakra-ui/react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  description?: string;
}

/**
 * ColorPicker component with hex input and visual color picker
 * Follows Poll Everywhere design system
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange, description }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow typing # and hex characters
    if (value === '' || /^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <VStack align="stretch" gap={2}>
      <Text fontWeight={600} fontSize="16px" color="#333">
        {label}
      </Text>
      {description && (
        <Text fontSize="14px" color="#666" mb={1}>
          {description}
        </Text>
      )}
      <HStack gap={4}>
        <Box position="relative">
          <Box
            w="64px"
            h="56px"
            bg={color || '#FFFFFF'}
            border="2px solid #e2e8f0"
            borderRadius="12px"
            cursor="pointer"
            onClick={() => setShowPicker(!showPicker)}
            transition="all 0.2s"
            _hover={{ transform: 'scale(1.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderColor: '#cbd5e0' }}
          />
          {showPicker && (
            <>
              <Box
                position="fixed"
                top="0"
                left="0"
                right="0"
                bottom="0"
                onClick={() => setShowPicker(false)}
                zIndex={10}
              />
              <Box
                position="absolute"
                top="50px"
                left="0"
                zIndex={20}
                bg="white"
                p={3}
                borderRadius="8px"
                boxShadow="0 4px 12px rgba(0,0,0,0.15)"
              >
                <HexColorPicker color={color} onChange={onChange} />
              </Box>
            </>
          )}
        </Box>

        <Input
          value={color}
          onChange={handleHexChange}
          placeholder="#FFFFFF"
          fontFamily="'Courier New', monospace"
          fontSize="16px"
          maxW="140px"
          h="56px"
          borderRadius="12px"
          border="2px solid #e2e8f0"
          _focus={{
            borderColor: '#007ACC',
            boxShadow: '0 0 0 1px #007ACC',
          }}
        />
      </HStack>
    </VStack>
  );
};
