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
        <VStack gap={6} align="stretch">
          {/* Logo */}
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src="/onepaige-white.svg"
              alt="One Paige Logo"
              style={{
                height: 'clamp(50px, 6vw, 70px)',
                width: 'auto',
              }}
            />
          </Box>

          {/* Header */}
          <VStack gap={2} textAlign="center">
            <Heading
              as="h1"
              size="xl"
              color="white"
              fontWeight="bold"
            >
              {title}
            </Heading>
            {subtitle && (
              <Text fontSize="md" color="whiteAlpha.900">
                {subtitle}
              </Text>
            )}
          </VStack>

          {/* Form Card */}
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            p={{ base: 6, md: 8 }}
          >
            {children}
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default AuthLayout
