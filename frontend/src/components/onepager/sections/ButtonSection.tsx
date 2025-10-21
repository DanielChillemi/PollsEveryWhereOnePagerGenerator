/**
 * Button Section Component
 *
 * Renders call-to-action button (AI type: "button")
 * Content: string (button text)
 */

import { Button, Input, HStack } from '@chakra-ui/react';

interface Props {
  text: string;
  url?: string;
  isEditing?: boolean;
  onUpdate?: (newText: string) => void;
}

export function ButtonSection({ text, url, isEditing, onUpdate }: Props) {
  if (isEditing && onUpdate) {
    return (
      <HStack gap={2}>
        <Input
          value={text}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="Button text"
          size="sm"
          fontSize="13px"
          px={3}
          border="2px solid"
          borderColor="#864CBD"
        />
      </HStack>
    );
  }

  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Button
      h="32px"
      px={4}
      borderRadius="16px"
      fontSize="13px"
      fontWeight={600}
      background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
      color="white"
      cursor={url ? 'pointer' : 'default'}
      onClick={handleClick}
      _hover={{
        transform: url ? 'translateY(-1px)' : 'none',
        boxShadow: url ? '0 3px 10px rgba(134, 76, 189, 0.3)' : 'none',
      }}
      transition="all 0.2s ease"
    >
      {text}
    </Button>
  );
}
