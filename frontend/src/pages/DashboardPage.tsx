/**
 * Dashboard Page
 * 
 * Main authenticated dashboard with user profile and logout
 */

import { Box, Container, Heading, Text, VStack, HStack } from '@chakra-ui/react'
import { useAuth, useLogout } from '../hooks/useAuth'
import { FormButton } from '../components/auth/FormButton'
import { brandConfig } from '../config/brandConfig'

export function DashboardPage() {
  const { user } = useAuth()
  const logout = useLogout()

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

          {/* Coming Soon */}
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            p="xl"
            textAlign="center"
          >
            <Heading size="lg" color="brand.text" mb="md">
              Smart Canvas Coming Soon 🎨
            </Heading>
            <Text fontSize="lg" color="brand.textLight">
              This is where you'll create your AI-powered marketing one-pagers using our
              interactive Smart Canvas and Brand Kit integration.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default DashboardPage
