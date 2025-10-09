/**
 * SmartCanvas Component
 * =====================
 * 
 * The main canvas container that renders one-pager elements in either
 * wireframe or styled mode. Handles zoom, selection, and layout.
 */

import React from 'react';
import { Box, Container, VStack, Alert, Spinner, Center } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { useOnePagerStore } from '@/stores/onePagerStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { ElementRenderer } from './ElementRenderer';
import { CanvasToolbar } from './CanvasToolbar';
import type { BrandKit } from '@/services/brandKitService';

interface SmartCanvasProps {
  brandKit?: BrandKit | null;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Alert.Root status="error">
      <VStack gap={4} py={8} w="full" align="center">
        <Alert.Indicator boxSize="40px" />
        <Box fontSize="lg" fontWeight="bold">
          Canvas Rendering Error
        </Box>
        <Box fontSize="sm" color="gray.600">
          {error.message}
        </Box>
        <Box
          as="button"
          px={4}
          py={2}
          bg="red.500"
          color="white"
          borderRadius="md"
          fontSize="sm"
          fontWeight="medium"
          onClick={resetErrorBoundary}
          _hover={{ bg: 'red.600' }}
        >
          Try Again
        </Box>
      </VStack>
    </Alert.Root>
  );
}

export const SmartCanvas: React.FC<SmartCanvasProps> = ({ brandKit }) => {
  const { currentOnePager, isLoading, error } = useOnePagerStore();
  const { mode, zoom } = useCanvasStore();

  // Loading state
  if (isLoading) {
    return (
      <Box w="full" minH="100vh" bg="gray.50">
        <CanvasToolbar />
        <Center h="400px">
          <VStack gap={4}>
            <Spinner size="xl" color="blue.500" borderWidth="4px" />
            <Box fontSize="lg" color="gray.600">
              Loading canvas...
            </Box>
          </VStack>
        </Center>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box w="full" minH="100vh" bg="gray.50">
        <CanvasToolbar />
        <Container maxW="container.md" py={8}>
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        </Container>
      </Box>
    );
  }

  // No data state
  if (!currentOnePager) {
    return (
      <Box w="full" minH="100vh" bg="gray.50">
        <CanvasToolbar />
        <Container maxW="container.md" py={8}>
          <Alert.Root status="info">
            <Alert.Indicator />
            <Alert.Title>No one-pager loaded. Create or select a one-pager to begin editing.</Alert.Title>
          </Alert.Root>
        </Container>
      </Box>
    );
  }

  // Sort elements by order
  const sortedElements = [...currentOnePager.elements].sort((a, b) => a.order - b.order);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Box w="full" minH="100vh" bg="gray.50">
        {/* Toolbar */}
        <CanvasToolbar />

        {/* Main Canvas with Zoom */}
        <Box
          py={8}
          px={4}
          overflow="auto"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          <Container
            maxW="1080px"
            mx="auto"
            px={0}
          >
            {/* Canvas Background */}
            <VStack
              gap={0}
              bg={mode === 'wireframe' ? 'white' : '#ffffff'}
              boxShadow="2xl"
              borderRadius="lg"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
            >
              {sortedElements.length === 0 ? (
                <Center py={20}>
                  <VStack gap={4}>
                    <Box fontSize="6xl" opacity={0.3}>
                      📄
                    </Box>
                    <Box fontSize="lg" color="gray.500">
                      No content yet
                    </Box>
                    <Box fontSize="sm" color="gray.400">
                      Elements will appear here when added
                    </Box>
                  </VStack>
                </Center>
              ) : (
                sortedElements.map((element) => (
                  <ElementRenderer
                    key={element.id}
                    element={element}
                    mode={mode}
                    brandKit={brandKit}
                  />
                ))
              )}
            </VStack>

            {/* Canvas Footer Info */}
            <Box
              mt={4}
              py={2}
              px={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              fontSize="xs"
              color="gray.500"
              textAlign="center"
            >
              {currentOnePager.title} • Version {currentOnePager.version} • {sortedElements.length} elements • 
              {mode === 'wireframe' ? ' Wireframe' : ' Styled'} mode
            </Box>
          </Container>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};
