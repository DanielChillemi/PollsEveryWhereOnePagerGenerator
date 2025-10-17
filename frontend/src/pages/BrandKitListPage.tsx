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
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrandKits, useDeleteBrandKit } from '../hooks/useBrandKit';
import { Sidebar } from '../components/layouts/Sidebar';

// Custom icons for the page
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
  </svg>
);

const MoreOptionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

/**
 * BrandKitListPage - Modern dashboard-style Brand Kit management
 * Matches the wireframe layout with sidebar navigation and clean grid design
 */
export function BrandKitListPage() {
  const navigate = useNavigate();
  const { data: brandKits, isLoading } = useBrandKits();
  const deleteMutation = useDeleteBrandKit();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      setOpenMenuId(null);
      console.log('Brand Kit deleted successfully');
    } catch (error) {
      console.error('Failed to delete Brand Kit:', error);
      alert('Failed to delete Brand Kit. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Sidebar />
        <Box ml="280px">
          <Center h="100vh">
            <Spinner size="xl" color="blue.500" />
          </Center>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content */}
      <Box ml="280px">
        <Container maxW="1200px" px={{ base: 4, md: 8 }} py={8}>
          <VStack gap="8" align="stretch">
            
            {/* Page Header */}
            <HStack justify="space-between" align="center">
              <VStack align="start" gap="1">
                <Heading
                  as="h1"
                  fontSize="32px"
                  fontWeight="700"
                  color="#007ACC"
                  lineHeight="1.2"
                >
                  Brand Kit
                </Heading>
                <Text
                  fontSize="16px"
                  color="gray.600"
                >
                  Create or edit your brand kits
                </Text>
              </VStack>
            </HStack>

            {/* Brand Kits Grid */}
            {!brandKits || brandKits.length === 0 ? (
              <Box
                bg="white"
                borderRadius="16px"
                border="1px solid"
                borderColor="gray.200"
                p={12}
              >
                <Center>
                  <VStack gap={6} maxW="400px" textAlign="center">
                    <Box
                      w="80px"
                      h="80px"
                      bg="gray.100"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <PlusIcon />
                    </Box>
                    <VStack gap={3}>
                      <Heading fontSize="24px" fontWeight="600" color="gray.900">
                        Create New Brand Kit
                      </Heading>
                      <Text fontSize="16px" color="gray.600" lineHeight="1.5">
                        Set up your brand colors, fonts, and visual identity to create consistent marketing materials.
                      </Text>
                    </VStack>
                    <Button
                      onClick={() => navigate('/brand-kit/create')}
                      size="lg"
                      bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
                      color="white"
                      borderRadius="xl"
                      px={8}
                      py={6}
                      fontSize="16px"
                      fontWeight="600"
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: 'lg'
                      }}
                      transition="all 0.2s"
                    >
                      <HStack gap="2">
                        <PlusIcon />
                        <Text>Create New</Text>
                      </HStack>
                    </Button>
                  </VStack>
                </Center>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {/* Create New Card */}
                <Box
                  bg="white"
                  borderRadius="16px"
                  border="2px dashed"
                  borderColor="gray.300"
                  p={8}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  _hover={{
                    borderColor: "blue.400",
                    bg: "blue.50"
                  }}
                  transition="all 0.2s"
                  onClick={() => navigate('/brand-kit/create')}
                  minH="200px"
                >
                  <VStack gap={4} textAlign="center">
                    <Box
                      w="48px"
                      h="48px"
                      bg="gray.100"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <PlusIcon />
                    </Box>
                    <VStack gap={1}>
                      <Text fontSize="16px" fontWeight="600" color="gray.700">
                        Create new
                      </Text>
                      <Text fontSize="14px" color="gray.500">
                        Add a new brand kit
                      </Text>
                    </VStack>
                  </VStack>
                </Box>

                {/* Existing Brand Kit Cards */}
                {brandKits && brandKits.map((kit) => (
                  <Box
                    key={kit.id}
                    bg="white"
                    borderRadius="16px"
                    boxShadow="0 1px 3px rgba(0,0,0,0.08)"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{
                      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                      transform: 'translateY(-1px)',
                      cursor: 'pointer',
                      borderColor: 'blue.300'
                    }}
                    transition="all 0.2s ease"
                    overflow="hidden"
                    onClick={() => navigate(`/brand-kit/edit/${kit.id}`)}
                    position="relative"
                  >
                    {/* Card Header */}
                    <HStack 
                      justify="space-between" 
                      align="center" 
                      p={4} 
                      borderBottom="1px solid" 
                      borderColor="gray.100"
                    >
                      <Heading fontSize="18px" fontWeight="600" color="gray.900">
                        {kit.company_name}
                      </Heading>
                      <Box position="relative">
                        <IconButton
                          aria-label="More options"
                          variant="ghost"
                          size="sm"
                          color="gray.500"
                          _hover={{ bg: "gray.100" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === kit.id ? null : kit.id);
                          }}
                        >
                          <MoreOptionsIcon />
                        </IconButton>
                        {openMenuId === kit.id && (
                          <>
                            {/* Backdrop to close menu when clicking outside */}
                            <Box
                              position="fixed"
                              top="0"
                              left="0"
                              right="0"
                              bottom="0"
                              zIndex="10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                              }}
                            />
                            {/* Dropdown Menu */}
                            <Box
                              position="absolute"
                              top="calc(100% + 4px)"
                              right="0"
                              bg="white"
                              borderRadius="lg"
                              boxShadow="0 4px 12px rgba(0,0,0,0.15)"
                              border="1px solid"
                              borderColor="gray.200"
                              minW="140px"
                              zIndex="20"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <VStack gap={0} align="stretch" p={1}>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(kit.id, kit.company_name);
                                  }}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  justifyContent="flex-start"
                                  fontWeight="500"
                                  borderRadius="md"
                                  loading={deleteMutation.isPending}
                                  px={3}
                                  py={2}
                                >
                                  Delete
                                </Button>
                              </VStack>
                            </Box>
                          </>
                        )}
                      </Box>
                    </HStack>

                    {/* Card Content */}
                    <VStack align="stretch" p={4} gap={4}>
                      {/* Color Swatches */}
                      <VStack align="start" gap={2}>
                        <Text fontSize="12px" fontWeight="500" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
                          Colors
                        </Text>
                        <HStack gap={2}>
                          <Box 
                            w="32px" 
                            h="32px" 
                            bg={kit.color_palette?.primary || '#0ea5e9'} 
                            borderRadius="6px"
                            border="1px solid"
                            borderColor="gray.200"
                          />
                          <Box 
                            w="32px" 
                            h="32px" 
                            bg={kit.color_palette?.secondary || '#64748b'} 
                            borderRadius="6px"
                            border="1px solid"
                            borderColor="gray.200"
                          />
                          <Box 
                            w="32px" 
                            h="32px" 
                            bg={kit.color_palette?.accent || '#10b981'} 
                            borderRadius="6px"
                            border="1px solid"
                            borderColor="gray.200"
                          />
                        </HStack>
                      </VStack>

                      {/* Typography */}
                      <VStack align="start" gap={2}>
                        <Text fontSize="12px" fontWeight="500" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
                          Typography
                        </Text>
                        <Text 
                          fontSize="14px" 
                          color="gray.700" 
                          fontFamily={`'${kit.typography?.heading_font || 'Arial'}', sans-serif`}
                          fontWeight="500"
                        >
                          {kit.typography?.heading_font || 'Arial'}
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};
