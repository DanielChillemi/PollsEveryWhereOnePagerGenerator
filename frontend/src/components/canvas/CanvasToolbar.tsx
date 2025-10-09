/**
 * CanvasToolbar Component
 * =======================
 * 
 * Toolbar with mode toggle, zoom controls, and canvas information.
 * Sticky at the top of the canvas for easy access.
 */

import React from 'react';
import { Box, HStack, Button, IconButton, Text, Flex } from '@chakra-ui/react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useOnePagerStore } from '@/stores/onePagerStore';

export const CanvasToolbar: React.FC = () => {
  const { mode, zoom, setMode, zoomIn, zoomOut, resetZoom } = useCanvasStore();
  const { currentOnePager } = useOnePagerStore();

  const isWireframe = mode === 'wireframe';

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={10}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={6}
      py={3}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center" gap={4}>
        {/* Left: Title */}
        <Box minW="200px">
          <Text fontSize="lg" fontWeight="semibold" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {currentOnePager?.title || 'Untitled One-Pager'}
          </Text>
          <Text fontSize="xs" color="gray.600">
            Version {currentOnePager?.version || 1} • {mode === 'wireframe' ? 'Wireframe' : 'Styled'} Mode
          </Text>
        </Box>

        {/* Center: Mode Toggle */}
        <HStack gap={2} bg="gray.100" borderRadius="md" p={1}>
          <Button
            size="sm"
            variant={isWireframe ? 'solid' : 'ghost'}
            colorScheme={isWireframe ? 'blue' : undefined}
            onClick={() => setMode('wireframe')}
          >
            🎨 Wireframe
          </Button>
          <Button
            size="sm"
            variant={!isWireframe ? 'solid' : 'ghost'}
            colorScheme={!isWireframe ? 'blue' : undefined}
            onClick={() => setMode('styled')}
          >
            ✨ Styled
          </Button>
        </HStack>

        {/* Right: Zoom Controls */}
        <HStack gap={2}>
          <IconButton
            aria-label="Zoom out"
            size="sm"
            variant="outline"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
          >
            -
          </IconButton>
          <Button size="sm" variant="ghost" onClick={resetZoom} minW="60px">
            {Math.round(zoom * 100)}%
          </Button>
          <IconButton
            aria-label="Zoom in"
            size="sm"
            variant="outline"
            onClick={zoomIn}
            disabled={zoom >= 2.0}
          >
            +
          </IconButton>
        </HStack>
      </Flex>
    </Box>
  );
};
