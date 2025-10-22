import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import './ColorPicker.css';

interface ColorPickerProps {
  label: string;
  description: string;
  value: string;
  onChange: (color: string) => void;
  required?: boolean;
}

export function ColorPicker({ label, description, value, onChange, required = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        boxRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !boxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <VStack align="stretch" gap={2}>
      <HStack gap={2}>
        <Text fontWeight="600" fontSize="14px" color="gray.700">
          {label}
        </Text>
        {required && (
          <Box
            as="span"
            fontSize="10px"
            fontWeight="700"
            px={2}
            py={0.5}
            bg="red.50"
            color="red.600"
            borderRadius="4px"
          >
            REQUIRED
          </Box>
        )}
      </HStack>
      <Text fontSize="12px" color="gray.500">
        {description}
      </Text>
      <HStack gap={3}>
        <Box position="relative">
          <Box
            ref={boxRef}
            w="48px"
            h="48px"
            bg={value}
            borderRadius="8px"
            border="2px solid"
            borderColor="gray.300"
            cursor="pointer"
            onClick={() => setIsOpen(!isOpen)}
            _hover={{
              borderColor: "#007ACC",
              transform: "scale(1.05)",
            }}
            transition="all 0.2s"
            boxShadow="sm"
          />
          {isOpen && (
            <Box
              ref={popoverRef}
              position="absolute"
              top="calc(100% + 8px)"
              left="0"
              zIndex="1000"
              bg="white"
              borderRadius="12px"
              boxShadow="0 8px 24px rgba(0,0,0,0.15)"
              border="1px solid"
              borderColor="gray.200"
              p={4}
            >
              <VStack gap={3} align="stretch">
                <HStack gap={2} bg="gray.50" px={3} py={2} borderRadius="8px">
                  <Box
                    w="32px"
                    h="32px"
                    bg={value}
                    borderRadius="6px"
                    border="1px solid"
                    borderColor="gray.200"
                    flexShrink={0}
                  />
                  <Text
                    fontSize="13px"
                    fontWeight="600"
                    color="gray.700"
                    fontFamily="mono"
                    px={2}
                  >
                    {value.toUpperCase()}
                  </Text>
                </HStack>
                <Box className="color-picker-wrapper">
                  <HexColorPicker color={value} onChange={onChange} />
                </Box>
              </VStack>
            </Box>
          )}
        </Box>
        <Input
          value={value}
          onChange={(e) => {
            let newValue = e.target.value;
            // Remove all spaces
            newValue = newValue.replace(/\s/g, '');
            // Ensure # prefix
            if (newValue && !newValue.startsWith('#')) {
              newValue = '#' + newValue;
            }
            // Remove duplicate # symbols
            newValue = newValue.replace(/^#+/, '#');
            onChange(newValue);
          }}
          placeholder="#0094CC"
          size="lg"
          fontFamily="mono"
          textTransform="uppercase"
          px={4}
        />
      </HStack>
    </VStack>
  );
}
