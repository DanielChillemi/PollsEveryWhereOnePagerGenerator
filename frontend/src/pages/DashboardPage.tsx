/**
 * Dashboard Page
 * 
 * Main authenticated dashboard with user profile and logout
 */

import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Button, Badge, Spinner, Alert, IconButton } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth, useLogout } from '../hooks/useAuth'
import { useOnePagerList } from '../hooks/useOnePagerList'
import { useOnePagerDelete } from '../hooks/useOnePagerDelete'
import { FormButton } from '../components/auth/FormButton'
import { brandConfig } from '../config/brandConfig'

export function DashboardPage() {
  const { user } = useAuth()
  const logout = useLogout()
  const navigate = useNavigate()
  
  // Fetch user's one-pagers
  const { data: onePagers, isLoading: isLoadingOnePagers, error: onePagersError } = useOnePagerList({ limit: 6 })
  
  // Delete functionality
  const { deleteOnePager } = useOnePagerDelete()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // Handle delete with confirmation
  const handleDelete = async (e: React.MouseEvent, onePagerId: string, title: string) => {
    e.stopPropagation() // Prevent navigation when clicking delete
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
    )
    
    if (!confirmed) return
    
    try {
      setDeletingId(onePagerId)
      await deleteOnePager(onePagerId)
      // Success handled by the hook (invalidates queries)
    } catch (error) {
      console.error('Failed to delete one-pager:', error)
      alert('Failed to delete one-pager. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box
        bg={brandConfig.gradients.primary}
        color="white"
        py="lg"
        boxShadow="md"
      >
        <Container maxW="container.xl">
          <HStack justify="space-between" align="center">
            <Heading size="lg">Marketing One-Pager Creator</Heading>
            <FormButton
              variant="outline"
              onClick={logout}
            >
              Sign Out
            </FormButton>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py="xl">
        <VStack gap="lg" align="stretch">
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p="xl"
          >
            <VStack gap="md" align="start">
              <Heading size="xl" color="brand.primary">
                Welcome, {user?.full_name}! 👋
              </Heading>
              <Text fontSize="lg" color="brand.textLight">
                You're successfully authenticated and ready to start creating professional
                marketing one-pagers with AI assistance.
              </Text>
              <Box
                bg="brand.background"
                borderRadius="lg"
                p="md"
                borderLeftWidth="4px"
                borderLeftColor="brand.primary"
              >
                <Text fontWeight="semibold" color="brand.text" mb="xs">
                  Your Account Details
                </Text>
                <VStack gap="xs" align="start" fontSize="sm" color="brand.textLight">
                  <Text><strong>Email:</strong> {user?.email}</Text>
                  <Text><strong>Account Status:</strong> {user?.is_active ? 'Active' : 'Inactive'}</Text>
                  <Text><strong>Member Since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</Text>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* One-Pager Creation - Primary Action */}
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            p="xl"
            borderWidth="2px"
            borderColor="brand.primary"
          >
            <HStack justify="space-between" align="start" mb="lg">
              <VStack align="start" gap="sm">
                <Heading size="lg" color="brand.primary">
                  🚀 Create Marketing One-Pager
                </Heading>
                <Text fontSize="md" color="brand.textLight">
                  Generate professional one-pagers with AI in minutes
                </Text>
              </VStack>
              <Button
                onClick={() => navigate('/onepager/create')}
                background={brandConfig.gradients.primary}
                color="white"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="semibold"
                borderRadius="lg"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: brandConfig.shadows.button,
                }}
                transition="all 0.2s"
              >
                + New One-Pager
              </Button>
            </HStack>
            <Text fontSize="sm" color="brand.textLight">
              Our AI will help you create compelling marketing materials using your brand kit, 
              target audience insights, and best practices.
            </Text>
          </Box>

          {/* Recent One-Pagers */}
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p="xl"
          >
            <HStack justify="space-between" align="center" mb="lg">
              <Heading size="lg" color="brand.text">
                Your One-Pagers
              </Heading>
              {onePagers && onePagers.length > 0 && (
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => navigate('/onepager/create')}
                >
                  View All
                </Button>
              )}
            </HStack>

            {/* Loading State */}
            {isLoadingOnePagers && (
              <HStack justify="center" py={8}>
                <Spinner size="lg" color="blue.500" />
                <Text color="gray.600">Loading your one-pagers...</Text>
              </HStack>
            )}

            {/* Error State */}
            {onePagersError && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Description>
                  Failed to load one-pagers. Please try refreshing the page.
                </Alert.Description>
              </Alert.Root>
            )}

            {/* Empty State */}
            {!isLoadingOnePagers && !onePagersError && (!onePagers || onePagers.length === 0) && (
              <VStack gap={4} py={8} textAlign="center">
                <Text fontSize="48px">📄</Text>
                <Heading size="md" color="gray.700">
                  No One-Pagers Yet
                </Heading>
                <Text color="gray.600" maxW="md">
                  Create your first marketing one-pager using AI. It only takes a few minutes!
                </Text>
                <Button
                  onClick={() => navigate('/onepager/create')}
                  background={brandConfig.gradients.primary}
                  color="white"
                  size="lg"
                  mt={2}
                >
                  Create Your First One-Pager
                </Button>
              </VStack>
            )}

            {/* One-Pager Grid */}
            {!isLoadingOnePagers && onePagers && onePagers.length > 0 && (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="md">
                {onePagers.map((onePager) => (
                  <Box
                    key={onePager.id}
                    bg="gray.50"
                    borderRadius="lg"
                    p="lg"
                    cursor="pointer"
                    onClick={() => navigate(`/onepager/${onePager.id}`)}
                    transition="all 0.2s"
                    borderWidth="1px"
                    borderColor="gray.200"
                    position="relative"
                    _hover={{
                      boxShadow: 'lg',
                      transform: 'translateY(-2px)',
                      borderColor: 'brand.primary',
                    }}
                  >
                    <VStack align="start" gap="sm">
                      <HStack justify="space-between" w="full">
                        <HStack gap={2}>
                          <Badge
                            colorScheme={
                              onePager.status === 'final' ? 'green' :
                              onePager.status === 'styled' ? 'blue' :
                              onePager.status === 'wireframe' ? 'purple' :
                              'gray'
                            }
                          >
                            {onePager.status}
                          </Badge>
                          {onePager.has_brand_kit && (
                            <Text fontSize="xs" color="gray.600">
                              🎨 Branded
                            </Text>
                          )}
                        </HStack>
                        <IconButton
                          aria-label="Delete one-pager"
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={(e) => handleDelete(e, onePager.id, onePager.title)}
                          loading={deletingId === onePager.id}
                          disabled={deletingId === onePager.id}
                        >
                          🗑️
                        </IconButton>
                      </HStack>
                      <Heading size="sm" color="brand.text" css={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {onePager.title}
                      </Heading>
                      <Text fontSize="xs" color="gray.600">
                        Updated {new Date(onePager.updated_at).toLocaleDateString()}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>

          {/* Brand Kit Actions */}
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p="xl"
          >
            <Heading size="lg" color="brand.text" mb="lg">
              Brand Kit Management
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="md">
              <Box
                bg="brand.background"
                borderRadius="lg"
                p="lg"
                textAlign="center"
                cursor="pointer"
                onClick={() => navigate('/brand-kit/create')}
                transition="all 0.2s"
                _hover={{
                  boxShadow: 'lg',
                  transform: 'translateY(-2px)',
                }}
              >
                <Text fontSize="48px" mb="sm">✨</Text>
                <Heading size="md" color="brand.text" mb="sm">
                  Create Brand Kit
                </Heading>
                <Text fontSize="sm" color="brand.textLight">
                  Define your brand identity with colors, fonts, and style
                </Text>
              </Box>

              <Box
                bg="brand.background"
                borderRadius="lg"
                p="lg"
                textAlign="center"
                cursor="pointer"
                onClick={() => navigate('/brand-kit/list')}
                transition="all 0.2s"
                _hover={{
                  boxShadow: 'lg',
                  transform: 'translateY(-2px)',
                }}
              >
                <Text fontSize="48px" mb="sm">📋</Text>
                <Heading size="md" color="brand.text" mb="sm">
                  View Brand Kits
                </Heading>
                <Text fontSize="sm" color="brand.textLight">
                  Manage and edit your existing brand kits
                </Text>
              </Box>

              <Box
                bg="brand.background"
                borderRadius="lg"
                p="lg"
                textAlign="center"
                cursor="pointer"
                onClick={() => navigate('/canvas-test')}
                transition="all 0.2s"
                _hover={{
                  boxShadow: 'lg',
                  transform: 'translateY(-2px)',
                }}
              >
                <Text fontSize="48px" mb="sm">🎨</Text>
                <Heading size="md" color="brand.text" mb="sm">
                  Smart Canvas
                </Heading>
                <Text fontSize="sm" color="brand.textLight">
                  Test the interactive canvas editor
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default DashboardPage
