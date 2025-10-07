import type { ChangeEvent } from 'react';
import { VStack, Text, Box, NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const FONT_OPTIONS = [
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Inter', label: 'Inter' },
];

/**
 * FontSelector component with preview
 * Follows Poll Everywhere design system
 */
export const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }) => {
  return (
    <VStack align="stretch" gap={3}>
      <Text fontWeight={600} fontSize="16px" color="#333">
        Primary Font
      </Text>
      <Text fontSize="14px" color="#666">
        Choose the main font for your marketing materials
      </Text>

      <NativeSelectRoot>
        <NativeSelectField
          value={value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          h="56px"
          borderRadius="12px"
          border="2px solid #e2e8f0"
          fontSize="16px"
          fontWeight={600}
          _focus={{
            borderColor: '#007ACC',
            boxShadow: '0 0 0 1px #007ACC',
          }}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>

      <Box
        p={6}
        bg="#f7fafc"
        borderRadius="12px"
        border="1px solid #e2e8f0"
      >
        <Text
          fontFamily={`'${value}', sans-serif`}
          fontSize="18px"
          color="#333"
        >
          The quick brown fox jumps over the lazy dog
        </Text>
        <Text
          fontFamily={`'${value}', sans-serif`}
          fontSize="14px"
          color="#666"
          mt={2}
        >
          ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
        </Text>
      </Box>
    </VStack>
  );
};

export default FontSelector;
