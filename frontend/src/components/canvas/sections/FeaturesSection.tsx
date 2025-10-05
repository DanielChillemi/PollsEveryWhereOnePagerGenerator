/**
 * Features Section Renderer
 *
 * Renders features section in wireframe or styled mode
 */

import { Box, Heading, Text, Grid, VStack, Container } from '@chakra-ui/react'
import type { OnePagerSection, RenderMode } from '../../../types/onePager'
import { SectionWrapper } from '../SectionWrapper'

interface FeaturesSectionProps {
  section: OnePagerSection
  mode: RenderMode
}

export const FeaturesSection = ({ section, mode }: FeaturesSectionProps) => {
  const { data, styling } = section
  const items = data.items || []

  if (mode === 'wireframe') {
    return (
      <SectionWrapper mode="wireframe" alignment={styling?.alignment}>
        <Container maxW="container.lg">
          <VStack gap={6} py={8}>
            {/* Section Title */}
            <Box
              height="40px"
              width="300px"
              bg="gray.300"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xs" fontWeight="bold">
                FEATURES TITLE
              </Text>
            </Box>

            {/* Features Grid */}
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={4}
              width="100%"
            >
              {(items.length > 0 ? items : [{ id: '1' }, { id: '2' }, { id: '3' }]).map((item) => (
                <Box
                  key={item.id}
                  border="2px dashed"
                  borderColor="gray.300"
                  p={4}
                  borderRadius="md"
                >
                  {/* Icon */}
                  <Box
                    width="48px"
                    height="48px"
                    bg="blue.100"
                    borderRadius="md"
                    mb={3}
                  />

                  {/* Title */}
                  <Box height="20px" width="80%" bg="gray.300" borderRadius="sm" mb={2} />

                  {/* Description */}
                  <Box height="40px" width="100%" bg="gray.200" borderRadius="sm" />
                </Box>
              ))}
            </Grid>
          </VStack>
        </Container>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper
      mode="styled"
      backgroundColor={styling?.backgroundColor}
      textColor={styling?.textColor}
      alignment={styling?.alignment}
      padding={styling?.padding}
    >
      <Container maxW="container.lg">
        <VStack gap={12} py={16}>
          {/* Section Title */}
          {data.title && (
            <Heading size="xl" textAlign="center">
              {data.title}
            </Heading>
          )}

          {/* Features Grid */}
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap={8}
            width="100%"
          >
            {items.map((item) => (
              <VStack
                key={item.id}
                align="start"
                p={6}
                bg={mode === 'styled' ? 'white' : undefined}
                borderRadius="lg"
                border="1px solid"
                borderColor="brand.border"
              >
                {/* Icon */}
                {item.icon && (
                  <Text fontSize="4xl" mb={2}>
                    {item.icon}
                  </Text>
                )}

                {/* Title */}
                {item.title && (
                  <Heading size="md" mb={2}>
                    {item.title}
                  </Heading>
                )}

                {/* Description */}
                {item.description && (
                  <Text color="brand.textLight">
                    {item.description}
                  </Text>
                )}
              </VStack>
            ))}
          </Grid>
        </VStack>
      </Container>
    </SectionWrapper>
  )
}
