/**
 * Hero Section Component
 *
 * Renders hero with headline, subheadline, description (AI type: "hero")
 * Content: { headline: string, subheadline?: string, description?: string }
 */

import { VStack, Heading, Text, Input, Textarea } from '@chakra-ui/react';

interface HeroContent {
  headline: string;
  subheadline?: string;
  description?: string;
}

interface Props {
  data: HeroContent;
  isEditing?: boolean;
  onUpdate?: (newData: HeroContent) => void;
}

export function HeroSection({ data, isEditing, onUpdate }: Props) {
  if (isEditing && onUpdate) {
    return (
      <VStack align="stretch" gap={2}>
        <Input
          value={data.headline}
          onChange={(e) => onUpdate({ ...data, headline: e.target.value })}
          placeholder="Headline"
          fontSize="16px"
          fontWeight="bold"
          size="sm"
          px={3}
          border="2px solid"
          borderColor="#864CBD"
        />
        {data.subheadline !== undefined && (
          <Input
            value={data.subheadline}
            onChange={(e) => onUpdate({ ...data, subheadline: e.target.value })}
            placeholder="Subheadline"
            fontSize="14px"
            size="sm"
            px={3}
            border="2px solid"
            borderColor="#864CBD"
          />
        )}
        {data.description !== undefined && (
          <Textarea
            value={data.description}
            onChange={(e) => onUpdate({ ...data, description: e.target.value })}
            placeholder="Description"
            minH="60px"
            fontSize="13px"
            px={3}
            py={2}
            border="2px solid"
            borderColor="#864CBD"
          />
        )}
      </VStack>
    );
  }

  return (
    <VStack
      align="center"
      gap={2}
      py={4}
      px={{ base: 3, md: 4 }}
      bg="linear-gradient(135deg, rgba(134, 76, 189, 0.05) 0%, rgba(21, 104, 184, 0.05) 100%)"
      borderRadius="8px"
      textAlign="center"
    >
      <Heading
        fontSize={{ base: '16px', md: '18px' }}
        fontWeight={700}
        color="#2d3748"
        lineHeight="1.3"
      >
        {data.headline}
      </Heading>
      {data.subheadline && (
        <Heading
          fontSize={{ base: '14px', md: '15px' }}
          fontWeight={500}
          color="#4a5568"
          lineHeight="1.3"
        >
          {data.subheadline}
        </Heading>
      )}
      {data.description && (
        <Text
          fontSize={{ base: '13px', md: '14px' }}
          color="#718096"
          maxW="600px"
          lineHeight="1.5"
        >
          {data.description}
        </Text>
      )}
    </VStack>
  );
}
