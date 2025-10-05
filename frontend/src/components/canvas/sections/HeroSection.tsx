/**
 * Hero Section Renderer
 *
 * Renders hero section in wireframe or styled mode
 */

import { Box, Heading, Text, Button, VStack, Container } from '@chakra-ui/react'
import { OnePagerSection, RenderMode } from '../../../types/onePager'
import { SectionWrapper } from '../SectionWrapper'

interface HeroSectionProps {
  section: OnePagerSection
  mode: RenderMode
}

export const HeroSection = ({ section, mode }: HeroSectionProps) => {
  const { data, styling } = section

  if (mode === 'wireframe') {
    return (
      <SectionWrapper mode="wireframe" alignment={styling?.alignment}>
        <Container maxW="container.lg">
          <VStack gap={4} py={12}>
            {/* Title */}
            <Box
              height="60px"
              width="80%"
              bg="gray.300"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xs" color="gray.600" fontWeight="bold">
                HERO TITLE
              </Text>
            </Box>

            {/* Subtitle */}
            {data.subtitle && (
              <Box
                height="30px"
                width="60%"
                bg="gray.200"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" color="gray.500">
                  Subtitle
                </Text>
              </Box>
            )}

            {/* Description */}
            {data.description && (
              <Box width="70%" p={4} border="1px dashed" borderColor="gray.300">
                <Text fontSize="xs" color="gray.500">
                  Description text goes here...
                </Text>
              </Box>
            )}

            {/* CTA Button */}
            {data.button_text && (
              <Box
                height="48px"
                width="200px"
                bg="blue.200"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" fontWeight="semibold">
                  CTA BUTTON
                </Text>
              </Box>
            )}
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
        <VStack gap={6} py={20}>
          {/* Title */}
          <Heading
            size="2xl"
            fontWeight="bold"
            maxW="800px"
            lineHeight="1.2"
          >
            {data.title || 'Hero Title'}
          </Heading>

          {/* Subtitle */}
          {data.subtitle && (
            <Text fontSize="xl" color="brand.textLight" maxW="700px">
              {data.subtitle}
            </Text>
          )}

          {/* Description */}
          {data.description && (
            <Text fontSize="lg" maxW="600px" lineHeight="1.8">
              {data.description}
            </Text>
          )}

          {/* CTA Button */}
          {data.button_text && (
            <Button
              size="lg"
              colorScheme="blue"
              borderRadius="full"
              px={8}
              mt={4}
            >
              {data.button_text}
            </Button>
          )}
        </VStack>
      </Container>
    </SectionWrapper>
  )
}
