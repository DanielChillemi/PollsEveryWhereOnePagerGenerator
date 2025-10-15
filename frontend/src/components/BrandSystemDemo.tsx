/**
 * Brand System Demo Component
 * 
 * Demonstrates the Poll Everywhere brand system implementation
 * with examples of colors, typography, buttons, and components.
 */

import { Box, Button, Container, Heading, Text, VStack, HStack, Grid } from '@chakra-ui/react'
import { brandConfig } from '../config/brandConfig'
// import { brandUtils } from '../utils/brandUtils' // Available for future use

export function BrandSystemDemo() {
  return (
    <Box minH="100vh" bg="brand.background">
      {/* Hero Section with Gradient */}
      <Box
        background={brandConfig.gradients.primary}
        color="white"
        py="xxl"
        textAlign="center"
      >
        <Container maxW="1200px">
          <Heading
            fontSize="4xl"
            fontWeight="bold"
            mb="md"
            lineHeight="tight"
          >
            Poll Everywhere Design System
          </Heading>
          <Text fontSize="xl" mb="xl" opacity={0.9}>
            Brand guidelines and component library for Marketing One-Pager Tool
          </Text>
          <HStack gap="md" justify="center">
            <Button
              bg="white"
              color="brand.primary"
              size="lg"
              px="lg"
              borderRadius="full"
              fontWeight="semibold"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: brandConfig.shadows.button,
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              borderColor="white"
              color="white"
              size="lg"
              px="lg"
              borderRadius="full"
              fontWeight="semibold"
              _hover={{
                bg: 'white',
                color: 'brand.primary',
              }}
            >
              Learn More
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Color Palette Section */}
      <Container maxW="1200px" py="xxl">
        <Heading fontSize="3xl" fontWeight="bold" mb="lg" color="brand.textDark">
          Color Palette
        </Heading>

        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="md" mb="xl">
          {Object.entries(brandConfig.colors).map(([name, color]) => (
            <Box
              key={name}
              borderRadius="lg"
              overflow="hidden"
              boxShadow={brandConfig.shadows.md}
            >
              <Box bg={color} h="160px" />
              <Box bg="brand.backgroundGray" p="md">
                <Text fontWeight="bold" fontSize="lg" mb="xs" textTransform="capitalize">
                  {name.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text fontFamily="mono" fontSize="sm" color="brand.textLight">
                  {color}
                </Text>
              </Box>
            </Box>
          ))}
        </Grid>

        {/* Gradient Demo */}
        <Box
          h="160px"
          borderRadius="lg"
          background={brandConfig.gradients.primary}
          mb="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontSize="xl"
          fontWeight="bold"
        >
          Primary Gradient
        </Box>
        <Text fontFamily="mono" color="brand.textLight" fontSize="sm" mb="xxl">
          linear-gradient(135deg, #864CBD 0%, #1568B8 100%)
        </Text>
      </Container>

      {/* Typography Section */}
      <Box bg="brand.backgroundGray" py="xxl">
        <Container maxW="1200px">
          <Heading fontSize="3xl" fontWeight="bold" mb="lg" color="brand.textDark">
            Typography
          </Heading>
          <Text fontSize="lg" color="brand.textLight" mb="xl">
            Font Family: Source Sans Pro
          </Text>

          <VStack align="stretch" gap="lg">
            <Box bg="white" p="lg" borderRadius="md">
              <Text fontSize="xs" color="brand.primary" fontWeight="semibold" mb="sm" letterSpacing="wide">
                HEADING 1 - HERO
              </Text>
              <Heading fontSize="4xl" fontWeight="bold" lineHeight="tight" mb="xs">
                Meet Poll Everywhere 2.0
              </Heading>
              <Text fontFamily="mono" fontSize="sm" color="brand.textLight">
                48px / 700 weight / 1.2 line-height
              </Text>
            </Box>

            <Box bg="white" p="lg" borderRadius="md">
              <Text fontSize="xs" color="brand.primary" fontWeight="semibold" mb="sm" letterSpacing="wide">
                HEADING 2 - SECTION
              </Text>
              <Heading fontSize="3xl" fontWeight="bold" mb="xs">
                Create Your Poll
              </Heading>
              <Text fontFamily="mono" fontSize="sm" color="brand.textLight">
                32px / 700 weight
              </Text>
            </Box>

            <Box bg="white" p="lg" borderRadius="md">
              <Text fontSize="xs" color="brand.primary" fontWeight="semibold" mb="sm" letterSpacing="wide">
                HEADING 3 - SUBSECTION
              </Text>
              <Heading fontSize="2xl" fontWeight="semibold" mb="xs">
                Engage Your Audience
              </Heading>
              <Text fontFamily="mono" fontSize="sm" color="brand.textLight">
                24px / 600 weight
              </Text>
            </Box>

            <Box bg="white" p="lg" borderRadius="md">
              <Text fontSize="xs" color="brand.primary" fontWeight="semibold" mb="sm" letterSpacing="wide">
                BODY TEXT
              </Text>
              <Text fontSize="lg" lineHeight="normal" mb="xs">
                The next evolution of Poll Everywhere. Same great features, with a faster, better experience.
              </Text>
              <Text fontFamily="mono" fontSize="sm" color="brand.textLight">
                18px / 400 weight / 1.6 line-height
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Button Variants Section */}
      <Container maxW="1200px" py="xxl">
        <Heading fontSize="3xl" fontWeight="bold" mb="lg" color="brand.textDark">
          Buttons
        </Heading>

        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="md">
          <Box bg="brand.backgroundGray" p="lg" borderRadius="md" textAlign="center">
            <Button
              background={brandConfig.gradients.primary}
              color="white"
              size="lg"
              px="lg"
              borderRadius="full"
              fontWeight="semibold"
              mb="md"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: brandConfig.shadows.button,
              }}
            >
              Get Started
            </Button>
            <Text fontSize="sm" color="brand.textLight">
              Primary Gradient Button
            </Text>
          </Box>

          <Box bg="brand.backgroundGray" p="lg" borderRadius="md" textAlign="center">
            <Button
              bg="brand.primary"
              color="white"
              size="lg"
              px="lg"
              borderRadius="full"
              fontWeight="semibold"
              mb="md"
              _hover={{
                bg: '#005A9C',
                transform: 'translateY(-2px)',
              }}
            >
              Learn More
            </Button>
            <Text fontSize="sm" color="brand.textLight">
              Secondary Solid Button
            </Text>
          </Box>

          <Box bg="brand.backgroundGray" p="lg" borderRadius="md" textAlign="center">
            <Button
              variant="outline"
              borderColor="brand.primary"
              color="brand.primary"
              size="lg"
              px="lg"
              borderRadius="full"
              fontWeight="semibold"
              mb="md"
              _hover={{
                bg: 'brand.primary',
                color: 'white',
              }}
            >
              Contact Sales
            </Button>
            <Text fontSize="sm" color="brand.textLight">
              Outline Button
            </Text>
          </Box>
        </Grid>
      </Container>

      {/* Stats Display Section */}
      <Box bg="brand.backgroundBlue" py="xxl">
        <Container maxW="1200px">
          <Heading fontSize="3xl" fontWeight="bold" mb="xl" color="brand.textDark" textAlign="center">
            Statistics Display
          </Heading>

          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="lg">
            <Box textAlign="center">
              <Text fontSize="5xl" fontWeight="bold" color="brand.primary" mb="xs">
                10m+
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color="brand.textLight">
                Presenters<br />Empowered
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="5xl" fontWeight="bold" color="brand.primary" mb="xs">
                200m+
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color="brand.textLight">
                Participants<br />Engaged
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="5xl" fontWeight="bold" color="brand.primary" mb="xs">
                40m+
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color="brand.textLight">
                Presentations<br />Given
              </Text>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Spacing System Section */}
      <Container maxW="1200px" py="xxl">
        <Heading fontSize="3xl" fontWeight="bold" mb="lg" color="brand.textDark">
          Spacing System
        </Heading>

        <VStack align="stretch" gap="md">
          {Object.entries(brandConfig.spacing).map(([name, value]) => (
            <HStack key={name} bg="brand.backgroundGray" p="md" borderRadius="md" gap="md">
              <Text fontFamily="mono" fontWeight="semibold" minW="80px">
                {name.toUpperCase()} - {value}
              </Text>
              <Box bg="brand.primary" h="40px" w={value} borderRadius="sm" />
            </HStack>
          ))}
        </VStack>
      </Container>

      {/* Footer */}
      <Box
        borderTop="1px solid"
        borderColor="brand.border"
        py="xl"
        textAlign="center"
        mt="xxl"
      >
        <Text color="brand.textLight" fontSize="sm">
          Poll Everywhere Design System • Version 2.0
        </Text>
      </Box>
    </Box>
  )
}

export default BrandSystemDemo
