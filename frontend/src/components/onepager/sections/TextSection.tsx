/**
 * Text Section Component
 *
 * Renders paragraph text (AI type: "text")
 * Content: string
 */

import { Text, Textarea } from '@chakra-ui/react';

interface Props {
  content: string;
  isEditing?: boolean;
  onUpdate?: (newContent: string) => void;
}

export function TextSection({ content, isEditing, onUpdate }: Props) {
  if (isEditing && onUpdate) {
    return (
      <Textarea
        value={content}
        onChange={(e) => onUpdate(e.target.value)}
        fontSize="13px"
        minH="60px"
        px={3}
        py={2}
        border="2px solid"
        borderColor="#864CBD"
        _focus={{
          borderColor: '#864CBD',
          boxShadow: '0 0 0 1px #864CBD',
        }}
      />
    );
  }

  return (
    <Text
      fontSize={{ base: '13px', md: '14px' }}
      color="#4a5568"
      lineHeight="1.5"
      whiteSpace="pre-wrap"
    >
      {content}
    </Text>
  );
}
