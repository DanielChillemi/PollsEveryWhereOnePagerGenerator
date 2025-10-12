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
 * Wraps each section with section-container for wireframe mode styling
 */
export function SectionRenderer({ section, isEditing, onUpdate }: Props) {
  // Render section type label (visible only in wireframe mode)
  const SectionLabel = () => (
    <Text className="section-type-label">{section.type.toUpperCase()}</Text>
  );

  // Type-safe rendering based on section.type
  let sectionContent;

  switch (section.type) {
    case 'heading':
      sectionContent = (
        <HeadingSection
          content={section.content as string}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );
      break;

    case 'text':
      sectionContent = (
        <TextSection
          content={section.content as string}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );
      break;

    case 'list':
      sectionContent = (
        <ListSection
          items={section.content as string[]}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );
      break;

    case 'button':
      // Handle both string and object content formats
      const buttonContent = typeof section.content === 'string'
        ? section.content
        : (section.content as any)?.text || 'Button';

      sectionContent = (
        <ButtonSection
          text={buttonContent}
          url={(section.content as any)?.url}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );
      break;

    case 'hero':
      // Handle both string and object content formats for hero
      const heroData = typeof section.content === 'string'
        ? {
            headline: section.title || 'Headline',
            description: section.content
          }
        : (section.content as any);

      sectionContent = (
        <HeroSection
          data={heroData}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );
      break;

    case 'features':
      sectionContent = (
        <FeaturesSection
          data={section.content as any}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );
      break;

    case 'testimonials':
    case 'cta':
    case 'footer':
    case 'image':
      // Future enhancement: implement these section types
      sectionContent = (
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
      break;

    default:
      // Fallback: render as text
      sectionContent = (
        <TextSection
          content={String(section.content)}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      );
  }

  // Wrap with section container for consistent wireframe styling
  return (
    <Box className="section-container" position="relative">
      <SectionLabel />
      {sectionContent}
    </Box>
  );
}
