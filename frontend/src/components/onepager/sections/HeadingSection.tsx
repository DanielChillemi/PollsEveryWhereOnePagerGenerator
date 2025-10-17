/**
 * Heading Section Component
 *
 * Renders large heading text (AI type: "heading")
 * Content: string
 */

import { Heading, Input } from '@chakra-ui/react';

interface Props {
  content: string;
  isEditing?: boolean;
  onUpdate?: (newContent: string) => void;
}

export function HeadingSection({ content, isEditing, onUpdate }: Props) {
  if (isEditing && onUpdate) {
    return (
      <Input
        value={content}
        onChange={(e) => onUpdate(e.target.value)}
        fontSize="16px"
        fontWeight="bold"
        h="auto"
        py={1.5}
        px={3}
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
    <Heading
      fontSize={{ base: '15px', md: '16px' }}
      fontWeight={700}
      color="#2d3748"
      lineHeight="1.3"
    >
      {content}
    </Heading>
  );
}
