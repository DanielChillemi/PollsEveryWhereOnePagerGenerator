/**
 * Features Section Component
 *
 * Renders feature grid (AI type: "features")
 * Content: { items: Array<{ title: string, description: string }> } | string[]
 */

import { SimpleGrid, VStack, Heading, Text, Box } from '@chakra-ui/react';

interface FeatureItem {
  title: string;
  description: string;
}

interface FeaturesContent {
  items?: FeatureItem[];
}

interface Props {
  data: FeaturesContent | string[];
  isEditing?: boolean;
  onUpdate?: (newData: any) => void;
}

export function FeaturesSection({ data, isEditing, onUpdate }: Props) {
  // Handle array format (fallback)
  if (Array.isArray(data)) {
    const items = data.map((item) => ({
      title: item,
      description: '',
    }));
    return <FeaturesSection data={{ items }} isEditing={isEditing} onUpdate={onUpdate} />;
  }

  // Handle object format
  const features = data.items || [];

  if (isEditing && onUpdate) {
    return (
      <VStack align="stretch" gap={4}>
        <Text fontSize="sm" color="gray.600">
          Features section (edit mode coming soon)
        </Text>
        <Text fontSize="xs" color="gray.500">
          {features.length} features
        </Text>
      </VStack>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={2}>
      {features.map((feature, index) => (
        <Box
          key={index}
          p={3}
          bg="white"
          borderRadius="6px"
          border="1px solid #e2e8f0"
          _hover={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
          }}
          transition="all 0.2s ease"
        >
          <VStack align="start" gap={1.5}>
            <Heading fontSize="14px" fontWeight={600} color="#2d3748">
              {feature.title}
            </Heading>
            {feature.description && (
              <Text fontSize="12px" color="#718096" lineHeight="1.4">
                {feature.description}
              </Text>
            )}
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
