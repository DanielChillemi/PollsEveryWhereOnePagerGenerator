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
      h="56px"
      px={8}
      borderRadius="50px"
      fontSize="18px"
      fontWeight={600}
      background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
      color="white"
      cursor={url ? 'pointer' : 'default'}
      onClick={handleClick}
      _hover={{
        transform: url ? 'translateY(-2px)' : 'none',
        boxShadow: url ? '0 6px 20px rgba(134, 76, 189, 0.4)' : 'none',
      }}
      transition="all 0.3s ease"
    >
      {text}
    </Button>
  );
}
