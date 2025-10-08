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
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
      {features.map((feature, index) => (
        <Box
          key={index}
          p={6}
          bg="white"
          borderRadius="12px"
          border="1px solid #e2e8f0"
          _hover={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          }}
          transition="all 0.3s ease"
        >
          <VStack align="start" gap={3}>
            <Heading size="md" color="#2d3748">
              {feature.title}
            </Heading>
            {feature.description && (
              <Text fontSize="sm" color="#718096" lineHeight="1.6">
                {feature.description}
              </Text>
            )}
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
