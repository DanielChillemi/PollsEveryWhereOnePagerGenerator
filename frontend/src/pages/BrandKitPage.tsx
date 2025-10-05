/**
 * Brand Kit Page
 *
 * Page for managing brand kits
 */

import { useState } from 'react'
import { Box, Container, Heading, Text, VStack, Button, HStack, Spinner } from '@chakra-ui/react'
import { BrandKitForm } from '../components/brandkit/BrandKitForm'
import type { BrandKitFormData } from '../types/brandKit'
import { useBrandKit, useCreateBrandKit, useUpdateBrandKit } from '../hooks/useBrandKit'

export const BrandKitPage = () => {
  const [isEditing, setIsEditing] = useState(false)

  // Fetch brand kit data
  const { data: brandKit, isLoading, error } = useBrandKit()

  // Mutations
  const createMutation = useCreateBrandKit()
  const updateMutation = useUpdateBrandKit()

  const handleSubmit = async (data: BrandKitFormData) => {
    try {
      if (brandKit?.id) {
        // Update existing
        await updateMutation.mutateAsync({
          id: brandKit.id,
          data,
        })
        alert('Brand Kit updated successfully!')
      } else {
        // Create new
        await createMutation.mutateAsync(data)
        alert('Brand Kit created successfully!')
      }
      setIsEditing(false)
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.detail || error.message}`)
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  if (isLoading) {
    return (
      <Box minHeight="100vh" bg="brand.backgroundGray" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="brand.primary" />
      </Box>
    )
  }

  if (error) {
    return (
      <Box minHeight="100vh" bg="brand.backgroundGray" py={8}>
        <Container maxW="container.lg">
          <VStack gap={4} py={12} textAlign="center">
            <Text fontSize="4xl">⚠️</Text>
            <Heading size="lg" color="brand.textDark">
              Error Loading Brand Kit
            </Heading>
            <Text color="brand.textLight">
              {(error as any).message || 'Please try again later'}
            </Text>
            <Button onClick={() => window.location.reload()} mt={4}>
              Retry
            </Button>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box minHeight="100vh" bg="brand.backgroundGray" py={8}>
      <Container maxW="container.lg">
        {!isEditing && !brandKit ? (
          // Empty State
          <VStack gap={6} py={12} textAlign="center">
            <Box fontSize="6xl">🎨</Box>
            <Heading size="xl" color="brand.textDark">
              Create Your Brand Kit
            </Heading>
            <Text fontSize="lg" color="brand.textLight" maxW="600px">
              Define your brand identity once, and we'll use it across all your marketing
              materials to ensure consistency.
            </Text>
            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => setIsEditing(true)}
              mt={4}
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.600' }}
              px={8}
              py={6}
            >
              Get Started
            </Button>
          </VStack>
        ) : brandKit && !isEditing ? (
          // Existing Brand Kit View
          <VStack gap={6}>
            <HStack justify="space-between" width="100%">
              <Box>
                <Heading size="lg" color="brand.textDark">
                  {brandKit.company_name}
                </Heading>
                <Text color="brand.textLight">Your brand kit</Text>
              </Box>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </HStack>

            <Box
              width="100%"
              bg="white"
              p={8}
              borderRadius="lg"
              border="1px solid"
              borderColor="brand.border"
            >
              <VStack align="stretch" gap={6}>
                {/* Logo */}
                {brandKit.logo_url && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>
                      Logo
                    </Text>
                    <Box
                      height="100px"
                      bg="brand.backgroundGray"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <img
                        src={brandKit.logo_url}
                        alt="Company logo"
                        style={{ maxHeight: '80px', maxWidth: '90%', objectFit: 'contain' }}
                      />
                    </Box>
                  </Box>
                )}

                {/* Colors */}
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Brand Colors
                  </Text>
                  <HStack gap={3}>
                    <Box flex={1}>
                      <Box
                        height="60px"
                        bg={brandKit.primary_color}
                        borderRadius="md"
                        mb={1}
                      />
                      <Text fontSize="xs" textAlign="center">
                        Primary
                      </Text>
                    </Box>
                    <Box flex={1}>
                      <Box
                        height="60px"
                        bg={brandKit.secondary_color}
                        borderRadius="md"
                        mb={1}
                      />
                      <Text fontSize="xs" textAlign="center">
                        Secondary
                      </Text>
                    </Box>
                    <Box flex={1}>
                      <Box
                        height="60px"
                        bg={brandKit.accent_color}
                        borderRadius="md"
                        mb={1}
                      />
                      <Text fontSize="xs" textAlign="center">
                        Accent
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                {/* Fonts */}
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Typography
                  </Text>
                  <VStack align="stretch" gap={2}>
                    <Box p={3} bg="brand.backgroundGray" borderRadius="md">
                      <Text fontSize="xs" color="brand.textLight" mb={1}>
                        Heading Font
                      </Text>
                      <Text fontFamily={brandKit.font_heading} fontSize="xl" fontWeight="bold">
                        {brandKit.font_heading}
                      </Text>
                    </Box>
                    <Box p={3} bg="brand.backgroundGray" borderRadius="md">
                      <Text fontSize="xs" color="brand.textLight" mb={1}>
                        Body Font
                      </Text>
                      <Text fontFamily={brandKit.font_body} fontSize="md">
                        {brandKit.font_body}
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                {/* Brand Voice */}
                {brandKit.brand_voice && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>
                      Brand Voice
                    </Text>
                    <Text fontSize="sm" color="brand.textLight">
                      {brandKit.brand_voice}
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </VStack>
        ) : (
          // Form View
          <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="brand.border">
            <BrandKitForm
              initialData={brandKit || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
              isLoading={isSubmitting}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}
