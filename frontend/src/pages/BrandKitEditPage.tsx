import { Box, Container, Heading, Text, VStack, Spinner, Center } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { BrandKitForm } from '../components/brandkit/BrandKitForm';
import { useBrandKit, useUpdateBrandKit } from '../hooks/useBrandKit';
import type { BrandKitData } from '../services/brandKitService';

/**
 * BrandKitEditPage - Page for editing an existing Brand Kit
 * Pre-fills form with existing data
 */
export function BrandKitEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: brandKit, isLoading, error } = useBrandKit(id!);
  const updateMutation = useUpdateBrandKit();

  const handleSubmit = async (data: BrandKitData) => {
    await updateMutation.mutateAsync({ id: id!, data });
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="#007ACC" />
      </Center>
    );
  }

  if (error || !brandKit) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Text fontSize="24px" fontWeight={700} color="#dc3545">
            Brand Kit Not Found
          </Text>
          <Text color="#666">The requested Brand Kit could not be loaded.</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="#FFFFFF">
      {/* Gradient Header */}
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
              Edit Brand Kit
            </Heading>
            <Text
              fontSize={{ base: '18px', md: '20px' }}
              color="rgba(255, 255, 255, 0.9)"
              maxW="600px"
            >
              Update your brand identity and preferences.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Form Container */}
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
            initialData={brandKit}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            submitLabel="Update Brand Kit"
          />
        </Box>
      </Container>
    </Box>
  );
};
