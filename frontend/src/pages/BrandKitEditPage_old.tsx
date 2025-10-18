import { Box, Container, Heading, Text, VStack, Spinner, Center } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useBrandKit } from '../hooks/useBrandKit';

/**
 * BrandKitEditPage - Redirects to modern tabbed interface
 * TODO: Implement full modern edit interface like create page
 */
export function BrandKitEditPage() {
  const { id } = useParams<{ id: string }>();

  const { data: brandKit, isLoading, error } = useBrandKit(id!);

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

  // TODO: Replace this temporary message with full modern tabbed interface
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
              Modern Edit Interface Coming Soon
            </Heading>
            <Text
              fontSize={{ base: '18px', md: '20px' }}
              color="rgba(255, 255, 255, 0.9)"
              maxW="600px"
            >
              The new tabbed interface like the create page will be implemented here.
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="900px" px={{ base: 4, md: 8 }} py={12}>
        <Text>Brand Kit ID: {id}</Text>
        <Text>Company: {brandKit.company_name}</Text>
      </Container>
    </Box>
  );
}
