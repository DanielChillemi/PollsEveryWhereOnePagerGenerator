import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BrandKitForm } from '../components/brandkit/BrandKitForm';
import { useCreateBrandKit } from '../hooks/useBrandKit';
import type { BrandKitData } from '../services/brandKitService';

/**
 * BrandKitCreatePage - Page for creating a new Brand Kit
 * Follows Poll Everywhere design system with gradient header
 */
export function BrandKitCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateBrandKit();

  const handleSubmit = async (data: BrandKitData) => {
    await createMutation.mutateAsync(data);
    // Navigate to dashboard after success
    navigate('/dashboard');
  };

  return (
    <Box minH="100vh" bg="#FFFFFF">
      {/* Gradient Header - Poll Everywhere Style */}
      <Box
        background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
        py={16}
        px={4}
      >
        <Container maxW="1200px">
          <VStack gap={4} align="start">
            <Heading
              as="h1"
              fontSize={{ base: '36px', md: '48px' }}
              fontWeight={700}
              color="white"
              lineHeight={1.2}
            >
              Create Your Brand Kit
            </Heading>
            <Text
              fontSize={{ base: '18px', md: '20px' }}
              color="rgba(255, 255, 255, 0.9)"
              maxW="600px"
            >
              Define your brand identity to power AI-generated marketing materials that match your style.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Form Container - Clean White Background */}
      <Container maxW="900px" px={{ base: 4, md: 8 }} py={12}>
        <Box
          bg="white"
          borderRadius="16px"
          boxShadow="0 4px 24px rgba(0, 0, 0, 0.08)"
          p={{ base: 6, md: 10 }}
          border="1px solid #e2e8f0"
          mx="auto"
          maxW="800px"
        >
          <BrandKitForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitLabel="Create Brand Kit"
          />
        </Box>
      </Container>
    </Box>
  );
};
