/**
 * Dashboard Page
 * 
 * Main authenticated dashboard with user profile and logout
 */

import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useLogout } from '../hooks/useAuth'
import { FormButton } from '../components/auth/FormButton'
import { brandConfig } from '../config/brandConfig'

export function DashboardPage() {
  const { user } = useAuth()
  const logout = useLogout()
  const navigate = useNavigate()

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
                opacity={0.6}
              >
                <Text fontSize="48px" mb="sm">🎨</Text>
                <Heading size="md" color="brand.text" mb="sm">
                  Smart Canvas
                </Heading>
                <Text fontSize="sm" color="brand.textLight">
                  Coming Soon - AI-powered one-pager creation
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
