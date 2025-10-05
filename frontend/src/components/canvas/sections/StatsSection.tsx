/**
 * Stats Section Renderer
 *
 * Renders statistics section in wireframe or styled mode
 */

import { Box, Heading, Text, Grid, VStack, Container } from '@chakra-ui/react'
import type { OnePagerSection, RenderMode } from '../../../types/onePager'
import { SectionWrapper } from '../SectionWrapper'

interface StatsSectionProps {
  section: OnePagerSection
  mode: RenderMode
}

export const StatsSection = ({ section, mode }: StatsSectionProps) => {
  const { data, styling } = section
  const items = data.items || []

  if (mode === 'wireframe') {
    return (
      <SectionWrapper mode="wireframe" alignment={styling?.alignment}>
        <Container maxW="container.lg">
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
            gap={6}
            py={8}
          >
            {(items.length > 0 ? items : [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }]).map((item) => (
              <VStack key={item.id} gap={2}>
                {/* Stat Value */}
                <Box
                  height="60px"
                  width="100px"
                  bg="blue.200"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="xs" fontWeight="bold">
                    STAT
                  </Text>
                </Box>

                {/* Stat Label */}
                <Box height="20px" width="120px" bg="gray.300" borderRadius="sm" />
              </VStack>
            ))}
          </Grid>
        </Container>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper
      mode="styled"
      backgroundColor={styling?.backgroundColor || 'brand.backgroundBlue'}
      textColor={styling?.textColor}
      alignment={styling?.alignment}
      padding={styling?.padding}
    >
      <Container maxW="container.lg">
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
          gap={8}
          py={16}
        >
          {items.map((item) => (
            <VStack key={item.id} gap={2}>
              {/* Stat Value */}
              <Heading size="2xl" color="brand.primary">
                {item.value || '0'}
              </Heading>

              {/* Stat Label */}
              {item.label && (
                <Text fontSize="md" color="brand.textLight" textAlign="center">
                  {item.label}
                </Text>
              )}
            </VStack>
          ))}
        </Grid>
      </Container>
    </SectionWrapper>
  )
}
