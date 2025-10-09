/**
 * Smart Canvas Preview Page
 * 
 * Interactive preview and testing interface for Smart Canvas
 * Load sample content to explore canvas capabilities
 */

import { Box, Button, Heading, Text, VStack, HStack, Container, Spinner, Center } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { SmartCanvas } from '@/components/canvas/SmartCanvas'
import { useOnePagerStore } from '@/stores/onePagerStore'
import { useBrandKits } from '@/hooks/useBrandKit'
import type { FrontendOnePager } from '@/types'
import { brandConfig } from '@/config/brandConfig'

/**
 * Mock One-Pager Data
 * Demonstrates all 8 element types with realistic content
 */
const MOCK_ONEPAGER: FrontendOnePager = {
  id: 'test-onepager-001',
  user_id: 'test-user-001',
  brand_kit_id: 'test-brandkit-001',
  title: 'AI-Powered Marketing Platform Launch',
  version: 1,
  status: 'draft',
  style_overrides: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  elements: [
    // Hero Section - Brand Kit colors will be applied in styled mode
    {
      id: 'hero-001',
      type: 'hero',
      order: 0,
      content: {
        headline: 'Transform Your Marketing with AI',
        subheadline: 'Create stunning one-pagers in minutes, not hours',
        description: 'Our AI-powered platform helps marketing teams co-create professional collateral.',
        cta_text: 'Start Free Trial',
        cta_url: 'https://example.com/signup'
      },
      styling: {
        // Empty styling - let Brand Kit apply colors in styled mode
        padding: 48
      }
    },
    
    // Heading - Problem Statement
    {
      id: 'heading-001',
      type: 'heading',
      order: 1,
      content: {
        text: 'The Challenge',
        level: 2
      },
      styling: {
        text_align: 'center',
        padding: 24
      }
    },
    
    // Text - Problem Description
    {
      id: 'text-001',
      type: 'text',
      order: 2,
      content: {
        text: 'Marketing teams spend 40% of their time creating one-pagers and sales collateral. Traditional design tools require technical expertise, while template-based solutions lack flexibility.'
      },
      styling: {
        font_size: 18,
        padding: 32
      }
    },
    
    // Features Grid
    {
      id: 'features-001',
      type: 'features',
      order: 3,
      content: {
        title: 'Key Features',
        items: [
          'AI-Powered Co-Creation - Work alongside AI to generate wireframes',
          'Brand Kit Integration - Automatically apply your brand identity',
          'Smart Canvas Editor - Intuitive drag-and-drop interface',
          'Export Anywhere - Generate high-quality PDFs instantly'
        ]
      },
      styling: {
        padding: 32
      }
    },
    
    // Heading - How It Works
    {
      id: 'heading-002',
      type: 'heading',
      order: 4,
      content: {
        text: 'How It Works',
        level: 2
      },
      styling: {
        text_align: 'center',
        padding: 24
      }
    },
    
    // List - Process Steps
    {
      id: 'list-001',
      type: 'list',
      order: 5,
      content: {
        items: [
          'Describe your product, challenge, and target audience',
          'AI generates a wireframe one-pager with structured content',
          'Review and provide feedback to refine messaging',
          'Toggle to styled mode to apply your brand identity',
          'Export as high-quality PDF ready for distribution'
        ]
      },
      styling: {
        padding: 32
      }
    },
    
    // CTA Section - Brand Kit colors will be applied in styled mode
    {
      id: 'cta-001',
      type: 'cta',
      order: 6,
      content: {
        text: 'Ready to Transform Your Marketing Workflow?',
        url: 'https://example.com/signup'
      },
      styling: {
        // Empty styling - let Brand Kit apply colors in styled mode
        padding: 64,
        text_align: 'center'
      }
    },
    
    // Button - Additional CTA
    {
      id: 'button-001',
      type: 'button',
      order: 7,
      content: {
        text: 'Contact Sales',
        url: 'https://example.com/contact'
      },
      styling: {
        padding: 16,
        text_align: 'center'
      }
    },
    
    // Image - Demo Screenshot
    {
      id: 'image-001',
      type: 'image',
      order: 8,
      content: {
        url: 'https://via.placeholder.com/800x400/667eea/ffffff?text=Smart+Canvas+Demo',
        alt: 'Smart Canvas Demo Screenshot',
        caption: 'Real-time preview and editing'
      },
      styling: {
        padding: 24
      }
    }
  ]
}

/**
 * Minimal Mock Data
 * For testing with fewer elements
 */
const MINIMAL_MOCK: FrontendOnePager = {
  id: 'test-onepager-002',
  user_id: 'test-user-001',
  brand_kit_id: 'test-brandkit-001',
  title: 'Minimal Test One-Pager',
  version: 1,
  status: 'draft',
  style_overrides: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  elements: [
    {
      id: 'hero-002',
      type: 'hero',
      order: 0,
      content: {
        headline: 'Simple Hero Section',
        subheadline: 'Testing with minimal content',
        cta_text: 'Learn More',
        cta_url: '#'
      },
      styling: {}
    },
    {
      id: 'heading-003',
      type: 'heading',
      order: 1,
      content: {
        text: 'Test Heading',
        level: 2
      },
      styling: {}
    },
    {
      id: 'text-002',
      type: 'text',
      order: 2,
      content: {
        text: 'This is a simple text paragraph for testing the canvas with minimal data.'
      },
      styling: {}
    }
  ]
}

export function CanvasTestPage() {
  const navigate = useNavigate()
  const { currentOnePager, setOnePager } = useOnePagerStore()
  
  // Fetch user's active Brand Kit
  const { data: activeBrandKit, isLoading: isBrandKitLoading } = useBrandKits()

  const loadFullMock = () => {
    setOnePager(MOCK_ONEPAGER)
  }

  const loadMinimalMock = () => {
    setOnePager(MINIMAL_MOCK)
  }

  // Show loading state while fetching Brand Kit
  if (isBrandKitLoading) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text fontSize="lg" color="gray.600">Loading your brand settings...</Text>
        </VStack>
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box
        bg={brandConfig.gradients.primary}
        color="white"
        py={8}
        boxShadow="md"
      >
        <Container maxW="container.xl">
          <VStack gap={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Heading size="xl">🎨 Smart Canvas</Heading>
              <Button
                variant="outline"
                colorScheme="whiteAlpha"
                onClick={() => navigate('/dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </HStack>
            
            <Text fontSize="lg" opacity={0.95}>
              Interactive canvas for creating and editing marketing one-pagers. 
              Try our sample content to explore the canvas capabilities.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Sample Content Loader */}
      {!currentOnePager && (
        <Container maxW="container.xl" py={12}>
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            p={8}
            textAlign="center"
          >
            <VStack gap={6}>
              <Text fontSize="48px">📄</Text>
              <Heading size="lg" color="brand.text">
                Load Sample Content
              </Heading>
              <Text fontSize="md" color="brand.textLight" maxW="xl">
                Explore the Smart Canvas with pre-built sample content. 
                Choose a full marketing one-pager or a minimal example.
              </Text>
              
              <HStack gap={4} pt={4}>
                <Button
                  size="lg"
                  background={brandConfig.gradients.primary}
                  color="white"
                  onClick={loadFullMock}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: brandConfig.shadows.button,
                  }}
                  transition="all 0.2s"
                >
                  Load Complete Example
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                  onClick={loadMinimalMock}
                >
                  Load Simple Example
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Container>
      )}

      {/* Canvas Section */}
      {currentOnePager && (
        <>
          <Container maxW="container.xl" py={8}>
            <VStack gap={6} align="stretch">
              {/* Canvas Title Bar */}
              <Box
                bg="white"
                borderRadius="lg"
                p={4}
                boxShadow="sm"
              >
                <HStack justify="space-between" align="center">
                  <VStack align="start" gap={1}>
                    <Heading size="md" color="brand.text">
                      {currentOnePager.title}
                    </Heading>
                    <HStack gap={2} fontSize="sm" color="brand.textLight">
                      <Text>{currentOnePager.elements.length} sections • {currentOnePager.status}</Text>
                      {activeBrandKit?.[0] && (
                        <>
                          <Text>•</Text>
                          <HStack gap={1}>
                            <Text fontWeight="semibold">Brand Kit:</Text>
                            <Text>{activeBrandKit[0].company_name}</Text>
                            <Box w="12px" h="12px" bg={activeBrandKit[0].primary_color} borderRadius="sm" border="1px solid" borderColor="gray.300" />
                          </HStack>
                        </>
                      )}
                    </HStack>
                  </VStack>
                  
                  <HStack gap={3}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={loadFullMock}
                    >
                      Switch to Full Example
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={loadMinimalMock}
                    >
                      Switch to Simple Example
                    </Button>
                  </HStack>
                </HStack>
              </Box>

              {/* Canvas */}
              <Box 
                bg="white" 
                borderRadius="lg" 
                boxShadow="xl" 
                overflow="hidden"
                minH="600px"
              >
                <SmartCanvas brandKit={activeBrandKit?.[0]} />
              </Box>
            </VStack>
          </Container>

          {/* Help Section */}
          <Container maxW="container.xl" pb={8}>
            <Box 
              bg="white"
              borderRadius="lg" 
              boxShadow="md"
              p={6}
              borderLeft="4px solid"
              borderColor="brand.primary"
            >
              <Heading size="sm" mb={4} color="brand.text">
                Canvas Features
              </Heading>
              <VStack gap={3} align="stretch" fontSize="sm" color="brand.textLight">
                <HStack>
                  <Text fontWeight="semibold" minW="120px">View Modes:</Text>
                  <Text>Toggle between Wireframe and Styled modes using the toolbar switch</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold" minW="120px">Zoom:</Text>
                  <Text>Use toolbar +/- buttons to adjust canvas zoom (50%-200%)</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold" minW="120px">Selection:</Text>
                  <Text>Click any section to select and view its properties</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold" minW="120px">Navigation:</Text>
                  <Text>Use Tab to navigate sections, Enter to select</Text>
                </HStack>
              </VStack>
            </Box>
          </Container>
        </>
      )}
    </Box>
  )
}
