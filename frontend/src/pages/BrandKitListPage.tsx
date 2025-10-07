import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useBrandKits, useDeleteBrandKit } from '../hooks/useBrandKit';

/**
 * BrandKitListPage - View all Brand Kits with edit/delete actions
 */
export function BrandKitListPage() {
  const navigate = useNavigate();
  const { data: brandKits, isLoading } = useBrandKits();
  const deleteMutation = useDeleteBrandKit();

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete Brand Kit:', error);
    }
  };

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="#007ACC" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="#FFFFFF">
      {/* Header */}
      <Box
        background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
        py={16}
        px={4}
      >
        <Container maxW="1200px">
          <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
            <VStack gap={4} align="start">
              <Heading
                as="h1"
                fontSize={{ base: '36px', md: '48px' }}
                fontWeight={700}
                color="white"
                lineHeight={1.2}
              >
                Your Brand Kits
              </Heading>
              <Text
                fontSize={{ base: '18px', md: '20px' }}
                color="rgba(255, 255, 255, 0.9)"
              >
                Manage your brand identities
              </Text>
            </VStack>
            <Button
              onClick={() => navigate('/brand-kit/create')}
              h="48px"
              px={8}
              borderRadius="50px"
              bg="white"
              color="#864CBD"
              fontWeight={600}
              fontSize="16px"
              _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(255,255,255,0.3)' }}
              transition="all 0.3s ease"
            >
              + Create New
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Brand Kits Grid */}
      <Container maxW="1200px" py={12}>
        {!brandKits || brandKits.length === 0 ? (
          <Center py={16}>
            <VStack gap={4}>
              <Text fontSize="20px" fontWeight={600} color="#666">
                No Brand Kits Yet
              </Text>
              <Text color="#666">Create your first Brand Kit to get started</Text>
              <Button
                onClick={() => navigate('/brand-kit/create')}
                h="48px"
                px={8}
                borderRadius="50px"
                background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
                color="white"
                fontWeight={600}
                _hover={{ transform: 'translateY(-2px)' }}
              >
                Create Brand Kit
              </Button>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {brandKits.map((kit) => (
              <Box
                key={kit.id}
                p={6}
                bg="white"
                borderRadius="12px"
                boxShadow="0 4px 12px rgba(0,0,0,0.08)"
                border="2px solid #f0f0f0"
                _hover={{ boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}
                transition="all 0.3s ease"
              >
                <VStack align="stretch" gap={4}>
                  <Heading fontSize="20px" fontWeight={700} color="#1a1a1a">
                    {kit.company_name}
                  </Heading>

                  {/* Color Swatches */}
                  <HStack gap={2}>
                    <Box w="32px" h="32px" bg={kit.primary_color} borderRadius="4px" />
                    <Box w="32px" h="32px" bg={kit.secondary_color} borderRadius="4px" />
                    <Box w="32px" h="32px" bg={kit.accent_color} borderRadius="4px" />
                  </HStack>

                  <Text fontSize="14px" color="#666" fontFamily={`'${kit.primary_font}', sans-serif`}>
                    {kit.primary_font}
                  </Text>

                  <HStack gap={2} mt={2}>
                    <Button
                      onClick={() => navigate(`/brand-kit/edit/${kit.id}`)}
                      flex={1}
                      bg="#007ACC"
                      color="white"
                      borderRadius="50px"
                      _hover={{ bg: '#005A9C' }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(kit.id, kit.company_name)}
                      flex={1}
                      bg="transparent"
                      color="#dc3545"
                      border="2px solid #dc3545"
                      borderRadius="50px"
                      _hover={{ bg: '#dc3545', color: 'white' }}
                      loading={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};
