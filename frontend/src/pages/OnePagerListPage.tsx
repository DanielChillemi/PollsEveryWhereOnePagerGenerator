/**
 * OnePager List Page
 *
 * Displays user's OnePagers in a card grid layout with:
 * - Create button
 * - Filter by status
 * - Delete confirmation dialog
 * - Navigation to detail/create pages
 */

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Badge,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useOnePagers, useDeleteOnePager } from '../hooks/useOnePager';

export function OnePagerListPage() {
  const navigate = useNavigate();
  const { data: onepagers, isLoading, error } = useOnePagers();
  const deleteMutation = useDeleteOnePager();

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete OnePager:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'wireframe':
        return 'gray';
      case 'draft':
        return 'blue';
      case 'published':
        return 'green';
      case 'archived':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box minH="100vh" bg="#F9FAFB">
      {/* Header */}
      <Box background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)" py={16} px={4}>
        <Container maxW="1200px">
          <VStack gap={4} align="start">
            <Heading
              fontSize={{ base: '36px', md: '48px' }}
              fontWeight={700}
              color="white"
              letterSpacing="-0.02em"
            >
              Your One-Pagers
            </Heading>
            <Text
              fontSize={{ base: '18px', md: '20px' }}
              color="rgba(255, 255, 255, 0.9)"
              maxW="600px"
            >
              Manage and create AI-powered marketing materials with instant PDF export
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Content */}
      <Container maxW="1200px" px={{ base: 4, md: 8 }} py={12}>
        <VStack gap={6} align="stretch">
          {/* Action Buttons */}
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Button
              onClick={() => navigate('/onepager/create')}
              h="56px"
              px={8}
              borderRadius="50px"
              fontSize="18px"
              fontWeight={600}
              background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
              color="white"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(134, 76, 189, 0.4)',
              }}
              transition="all 0.3s ease"
            >
              + Create New One-Pager
            </Button>

            <Button
              onClick={() => navigate('/dashboard')}
              h="56px"
              px={6}
              borderRadius="50px"
              fontSize="16px"
              fontWeight={600}
              variant="outline"
              borderColor="#864CBD"
              color="#864CBD"
              _hover={{
                bg: 'rgba(134, 76, 189, 0.1)',
              }}
            >
              ← Back to Dashboard
            </Button>
          </HStack>

          {/* Loading State */}
          {isLoading && (
            <Box textAlign="center" py={12}>
              <Spinner size="xl" color="#864CBD" thickness="4px" />
              <Text mt={4} color="gray.600">
                Loading your one-pagers...
              </Text>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Box
              bg="#fed7d7"
              border="2px solid #fc8181"
              borderRadius="12px"
              p={6}
              textAlign="center"
            >
              <Text color="#c53030" fontWeight={600}>
                Failed to load one-pagers. Please try again.
              </Text>
            </Box>
          )}

          {/* Empty State */}
          {!isLoading && !error && (!onepagers || onepagers.length === 0) && (
            <Box
              bg="white"
              borderRadius="16px"
              p={12}
              textAlign="center"
              border="2px dashed #e2e8f0"
            >
              <Text fontSize="48px" mb={4}>
                📄
              </Text>
              <Heading size="lg" color="#2d3748" mb={2}>
                No One-Pagers Yet
              </Heading>
              <Text fontSize="lg" color="gray.600" mb={6}>
                Create your first AI-powered marketing one-pager
              </Text>
              <Button
                onClick={() => navigate('/onepager/create')}
                h="48px"
                px={6}
                borderRadius="50px"
                fontSize="16px"
                fontWeight={600}
                background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
                color="white"
              >
                Get Started
              </Button>
            </Box>
          )}

          {/* OnePager Cards Grid */}
          {!isLoading && onepagers && onepagers.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              {onepagers.map((onepager) => (
                <Box
                  key={onepager.id}
                  bg="white"
                  borderRadius="16px"
                  p={6}
                  boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
                  border="1px solid #e2e8f0"
                  _hover={{
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-2px)',
                  }}
                  transition="all 0.3s ease"
                  cursor="pointer"
                  onClick={() => navigate(`/onepager/${onepager.id}`)}
                >
                  <VStack align="stretch" gap={4}>
                    {/* Title and Status */}
                    <HStack justify="space-between" align="start">
                      <Heading
                        size="md"
                        color="#2d3748"
                        noOfLines={2}
                        flex="1"
                        fontSize="20px"
                        fontWeight={600}
                      >
                        {onepager.title}
                      </Heading>
                      <Badge
                        colorScheme={getStatusColor(onepager.status)}
                        fontSize="xs"
                        px={3}
                        py={1}
                        borderRadius="full"
                        textTransform="capitalize"
                      >
                        {onepager.status}
                      </Badge>
                    </HStack>

                    {/* Metadata */}
                    <VStack align="stretch" gap={1}>
                      <Text fontSize="sm" color="gray.600">
                        Created {new Date(onepager.created_at).toLocaleDateString()}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Updated {new Date(onepager.updated_at).toLocaleDateString()}
                      </Text>
                      {onepager.has_brand_kit && (
                        <HStack gap={1}>
                          <Text fontSize="sm" color="#864CBD" fontWeight={600}>
                            🎨
                          </Text>
                          <Text fontSize="sm" color="#864CBD" fontWeight={600}>
                            Brand Kit Applied
                          </Text>
                        </HStack>
                      )}
                    </VStack>

                    {/* Action Buttons */}
                    <HStack gap={2} onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        flex="1"
                        onClick={() => navigate(`/onepager/${onepager.id}`)}
                        colorScheme="purple"
                        variant="outline"
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDelete(onepager.id, onepager.title)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default OnePagerListPage;
