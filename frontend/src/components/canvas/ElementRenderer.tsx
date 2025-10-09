/**
 * ElementRenderer Component
 * ==========================
 * 
 * Renders individual one-pager elements with proper styling based on mode.
 * Handles element selection, hovering, and style resolution.
 */

import React from 'react';
import { Box, Link, Image } from '@chakra-ui/react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { FrontendElement, CanvasMode } from '@/types';
import type { BrandKit } from '@/services/brandKitService';

// Placeholder components (will be replaced with actual implementations)
const HeroElement = ({ content, styles, brandKit, mode }: any) => {
  const isWireframe = mode === 'wireframe';
  
  return (
    <Box {...styles} textAlign="center" py={12}>
      <Box 
        as="h1" 
        fontSize="4xl" 
        fontWeight="bold" 
        mb={4} 
        color={isWireframe ? 'gray.900' : 'white'}
      >
        {content.headline}
      </Box>
      {content.subheadline && (
        <Box 
          as="h2" 
          fontSize="2xl" 
          color={isWireframe ? 'gray.700' : 'whiteAlpha.900'} 
          mb={6}
        >
          {content.subheadline}
        </Box>
      )}
      {content.description && (
        <Box 
          fontSize="lg" 
          color={isWireframe ? 'gray.600' : 'whiteAlpha.800'} 
          mb={6} 
          maxW="3xl" 
          mx="auto"
        >
          {content.description}
        </Box>
      )}
      {content.cta_text && (
        <Link
          href={content.cta_url || '#'}
          display="inline-block"
          px={8}
          py={3}
          bg={isWireframe ? 'white' : 'white'}
          color={isWireframe ? 'gray.700' : (brandKit?.primary_color || 'blue.600')}
          border={isWireframe ? '2px solid' : 'none'}
          borderColor={isWireframe ? 'gray.400' : 'transparent'}
          borderRadius="50px"
          fontWeight="semibold"
          fontSize="lg"
          textDecoration="none"
          _hover={{ 
            transform: 'translateY(-2px)', 
            boxShadow: 'lg', 
            textDecoration: 'none',
            bg: isWireframe ? 'gray.100' : 'white'
          }}
          transition="all 0.2s"
        >
          {content.cta_text}
        </Link>
      )}
    </Box>
  );
};

const HeadingElement = ({ content, styles }: any) => (
  <Box {...styles} py={6}>
    <Box as="h2" fontSize="3xl" fontWeight="semibold">
      {content.text}
    </Box>
  </Box>
);

const TextElement = ({ content, styles }: any) => (
  <Box {...styles} py={4}>
    <Box fontSize="md" lineHeight="1.8">
      {content.text}
    </Box>
  </Box>
);

const FeaturesElement = ({ content, styles }: any) => (
  <Box {...styles} py={8}>
    <Box as="ul" listStyleType="disc" pl={8}>
      {content.items?.map((item: string, idx: number) => (
        <Box as="li" key={idx} fontSize="md" mb={2}>
          {item}
        </Box>
      ))}
    </Box>
  </Box>
);

const ListElement = ({ content, styles }: any) => (
  <Box {...styles} py={4}>
    <Box as="ul" listStyleType="disc" pl={6}>
      {content.items?.map((item: string, idx: number) => (
        <Box as="li" key={idx} fontSize="sm" mb={1}>
          {item}
        </Box>
      ))}
    </Box>
  </Box>
);

const CTAElement = ({ content, styles, brandKit, mode }: any) => {
  const isWireframe = mode === 'wireframe';
  
  return (
    <Box {...styles} py={8} textAlign="center">
      <Link
        href={content.url || '#'}
        display="inline-block"
        px={8}
        py={4}
        bg={isWireframe ? 'gray.200' : (brandKit?.primary_color || 'blue.500')}
        color={isWireframe ? 'gray.700' : 'white'}
        borderRadius="md"
        fontWeight="semibold"
        fontSize="lg"
        border={isWireframe ? '2px dashed' : 'none'}
        borderColor={isWireframe ? 'gray.400' : 'transparent'}
        _hover={{ 
          bg: isWireframe ? 'gray.300' : (brandKit?.secondary_color || 'blue.600'), 
          textDecoration: 'none' 
        }}
      >
        {content.text}
      </Link>
    </Box>
  );
};

const ButtonElement = ({ content, styles, brandKit, mode }: any) => {
  const isWireframe = mode === 'wireframe';
  
  return (
    <Box {...styles} py={4}>
      <Link
        href={content.url || '#'}
        display="inline-block"
        px={6}
        py={3}
        bg={isWireframe ? 'white' : (brandKit?.secondary_color || 'gray.500')}
        color={isWireframe ? 'gray.700' : 'white'}
        borderRadius="md"
        fontWeight="medium"
        border={isWireframe ? '2px solid' : 'none'}
        borderColor={isWireframe ? 'gray.400' : 'transparent'}
        _hover={{ 
          bg: isWireframe ? 'gray.100' : (brandKit?.primary_color || 'gray.600'), 
          textDecoration: 'none' 
        }}
      >
        {content.text}
      </Link>
    </Box>
  );
};

const ImageElement = ({ content, styles, mode }: any) => (
  <Box {...styles} py={4}>
    {mode === 'styled' ? (
      <Image src={content.url} alt={content.alt || 'Image'} maxW="100%" borderRadius="md" />
    ) : (
      <Box
        w="100%"
        h="200px"
        bg="gray.200"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="sm"
        color="gray.500"
      >
        📷 Image Placeholder
      </Box>
    )}
  </Box>
);

interface ElementRendererProps {
  element: FrontendElement;
  mode: CanvasMode;
  brandKit?: BrandKit | null;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  mode,
  brandKit,
}) => {
  const { selectedElementId, hoveredElementId, selectElement, setHoveredElement } =
    useCanvasStore();

  const isSelected = selectedElementId === element.id;
  const isHovered = hoveredElementId === element.id;

  // Resolve styles based on mode and element styling
  const resolvedStyles = resolveElementStyles(element, mode, brandKit);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleMouseEnter = () => {
    setHoveredElement(element.id);
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  // Render appropriate element component
  const renderElement = () => {
    const props = { content: element.content, styles: resolvedStyles, mode, brandKit };

    switch (element.type) {
      case 'hero':
        return <HeroElement {...props} />;
      case 'heading':
        return <HeadingElement {...props} />;
      case 'text':
        return <TextElement {...props} />;
      case 'features':
        return <FeaturesElement {...props} />;
      case 'list':
        return <ListElement {...props} />;
      case 'cta':
        return <CTAElement {...props} />;
      case 'button':
        return <ButtonElement {...props} />;
      case 'image':
        return <ImageElement {...props} />;
      default:
        return (
          <Box {...resolvedStyles} py={4}>
            <Box fontSize="sm" color="gray.500">
              Unknown element type: {element.type}
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box
      w="full"
      position="relative"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      outline={isSelected ? '3px solid' : isHovered ? '1px dashed' : 'none'}
      outlineColor={isSelected ? 'blue.500' : 'gray.400'}
      outlineOffset="-3px"
      cursor="pointer"
      transition="outline 0.2s ease-in-out"
    >
      {renderElement()}

      {/* Selection Badge */}
      {isSelected && (
        <Box
          position="absolute"
          top={2}
          right={2}
          px={2}
          py={1}
          bg="blue.500"
          color="white"
          fontSize="xs"
          fontWeight="medium"
          borderRadius="sm"
          pointerEvents="none"
        >
          {element.type}
        </Box>
      )}
    </Box>
  );
};

/**
 * Resolve element styles based on mode and overrides
 * Priority: element.styling > Brand Kit > defaults
 */
function resolveElementStyles(
  element: FrontendElement,
  mode: CanvasMode,
  brandKit?: BrandKit | null
): Record<string, any> {
  if (mode === 'wireframe') {
    // Wireframe mode: simple grayscale (no brand colors)
    return {
      backgroundColor: element.styling?.background_color || '#f7fafc',
      color: element.styling?.text_color || '#1a202c',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: element.styling?.padding ? `${element.styling.padding}px` : '40px',
    };
  }

  // Styled mode: Apply Brand Kit colors and fonts
  const getBrandColor = (fallback: string): string => {
    // Hero and CTA use primary brand color
    if (element.type === 'hero' || element.type === 'cta') {
      const color = element.styling?.background_color || brandKit?.primary_color || fallback;
      console.log(`[ElementRenderer] ${element.type} - Brand Kit:`, brandKit?.company_name, 'Primary Color:', brandKit?.primary_color, 'Final Color:', color);
      return color;
    }
    return element.styling?.background_color || fallback;
  };

  const getTextColor = (): string => {
    return element.styling?.text_color || brandKit?.text_color || '#1a202c';
  };

  const getFont = (): string => {
    // Headings use brand heading font
    if (element.type === 'heading' || element.type === 'hero') {
      return brandKit?.primary_font ? `${brandKit.primary_font}, sans-serif` : 'Inter, system-ui, sans-serif';
    }
    // Body text uses brand font
    return brandKit?.primary_font ? `${brandKit.primary_font}, sans-serif` : 'Inter, system-ui, sans-serif';
  };

  return {
    backgroundColor: getBrandColor('#ffffff'),
    color: getTextColor(),
    fontFamily: getFont(),
    padding: element.styling?.padding ? `${element.styling.padding}px` : '40px',
    borderRadius: element.styling?.border_radius
      ? `${element.styling.border_radius}px`
      : '0',
  };
}
