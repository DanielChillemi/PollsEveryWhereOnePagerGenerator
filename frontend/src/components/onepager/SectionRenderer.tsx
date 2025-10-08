/**
 * Section Renderer
 *
 * Dynamically renders different section types based on ContentSection.type
 * Handles polymorphic content (string | string[] | object)
 */

import type { ContentSection } from '../../types/onepager';
import { HeadingSection } from './sections/HeadingSection';
import { TextSection } from './sections/TextSection';
import { ListSection } from './sections/ListSection';
import { ButtonSection } from './sections/ButtonSection';
import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { Box, Text } from '@chakra-ui/react';

interface Props {
  section: ContentSection;
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
}

/**
 * Main renderer component
 * Routes to appropriate section component based on type
 */
export function SectionRenderer({ section, isEditing, onUpdate }: Props) {
  // Type-safe rendering based on section.type
  switch (section.type) {
    case 'heading':
      return (
        <HeadingSection
          content={section.content as string}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );

    case 'text':
      return (
        <TextSection
          content={section.content as string}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );

    case 'list':
      return (
        <ListSection
          items={section.content as string[]}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );

    case 'button':
      return (
        <ButtonSection
          text={section.content as string}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );

    case 'hero':
      return (
        <HeroSection
          data={section.content as any}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );

    case 'features':
      return (
        <FeaturesSection
          data={section.content as any}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );

    case 'testimonials':
    case 'cta':
    case 'footer':
    case 'image':
      // Future enhancement: implement these section types
      return (
        <Box
          p={6}
          bg="gray.50"
          borderRadius="12px"
          border="2px dashed #e2e8f0"
          textAlign="center"
        >
          <Text fontSize="sm" color="gray.500">
            {section.type.toUpperCase()} section (coming soon)
          </Text>
          <Text fontSize="xs" color="gray.400" mt={2}>
            {JSON.stringify(section.content)}
          </Text>
        </Box>
      );

    default:
      // Fallback: render as text
      return (
        <TextSection
          content={String(section.content)}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );
  }
}
