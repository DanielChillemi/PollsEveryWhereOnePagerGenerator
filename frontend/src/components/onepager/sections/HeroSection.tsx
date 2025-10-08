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
      <VStack align="stretch" gap={4}>
        <Input
          value={data.headline}
          onChange={(e) => onUpdate({ ...data, headline: e.target.value })}
          placeholder="Headline"
          fontSize="36px"
          fontWeight="bold"
          border="2px solid"
          borderColor="#864CBD"
        />
        {data.subheadline !== undefined && (
          <Input
            value={data.subheadline}
            onChange={(e) => onUpdate({ ...data, subheadline: e.target.value })}
            placeholder="Subheadline"
            fontSize="20px"
            border="2px solid"
            borderColor="#864CBD"
          />
        )}
        {data.description !== undefined && (
          <Textarea
            value={data.description}
            onChange={(e) => onUpdate({ ...data, description: e.target.value })}
            placeholder="Description"
            minH="100px"
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
      gap={4}
      py={12}
      px={{ base: 4, md: 8 }}
      bg="linear-gradient(135deg, rgba(134, 76, 189, 0.05) 0%, rgba(21, 104, 184, 0.05) 100%)"
      borderRadius="16px"
      textAlign="center"
    >
      <Heading
        fontSize={{ base: '36px', md: '48px' }}
        fontWeight={700}
        color="#2d3748"
        lineHeight="1.2"
      >
        {data.headline}
      </Heading>
      {data.subheadline && (
        <Heading
          fontSize={{ base: '20px', md: '24px' }}
          fontWeight={500}
          color="#4a5568"
          lineHeight="1.4"
        >
          {data.subheadline}
        </Heading>
      )}
      {data.description && (
        <Text
          fontSize={{ base: '16px', md: '18px' }}
          color="#718096"
          maxW="700px"
          lineHeight="1.7"
        >
          {data.description}
        </Text>
      )}
    </VStack>
  );
}
