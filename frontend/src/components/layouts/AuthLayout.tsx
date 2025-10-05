/**
 * Auth Layout Component
 * 
 * Centered card layout with Poll Everywhere gradient background
 * Wraps login/signup forms with consistent styling
 */

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { brandConfig } from '../../config/brandConfig'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <Box
      minH="100vh"
      bg={`linear-gradient(135deg, ${brandConfig.colors.primary} 0%, ${brandConfig.colors.deepBlue} 100%)`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={{ base: 'lg', md: 'xl' }}
    >
      <Container maxW="md" width="100%">
        <VStack gap="xl" align="stretch">
          {/* Header */}
          <VStack gap="sm" textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              color="white"
              fontWeight="bold"
            >
              {title}
            </Heading>
            {subtitle && (
              <Text fontSize="lg" color="whiteAlpha.900">
                {subtitle}
              </Text>
            )}
          </VStack>

          {/* Form Card */}
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            p={{ base: 'lg', md: 'xl' }}
          >
            {children}
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default AuthLayout
