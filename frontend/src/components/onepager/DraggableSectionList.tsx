/**
 * Draggable Section List
 *
 * Implements drag-and-drop reordering using @dnd-kit
 * Allows users to rearrange sections visually
 */

import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, VStack, HStack, IconButton, Text } from '@chakra-ui/react';
import { SectionRenderer } from './SectionRenderer';
import type { ContentSection } from '../../types/onepager';

interface Props {
  sections: ContentSection[];
  onReorder: (newSections: ContentSection[]) => void;
  onDelete?: (sectionId: string) => void;
}

/**
 * Sortable wrapper for individual section
 */
function SortableSection({
  section,
  onDelete,
}: {
  section: ContentSection;
  onDelete?: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg="white"
      p={6}
      borderRadius="12px"
      border="2px solid"
      borderColor={isDragging ? '#864CBD' : '#e2e8f0'}
      boxShadow={isDragging ? '0 8px 24px rgba(134, 76, 189, 0.3)' : 'sm'}
      position="relative"
      _hover={{
        borderColor: '#864CBD',
        '& .section-controls': {
          opacity: 1,
        },
      }}
      transition="all 0.2s ease"
    >
      {/* Drag Handle and Controls */}
      <HStack
        className="section-controls"
        position="absolute"
        top={2}
        right={2}
        gap={1}
        opacity={0}
        transition="opacity 0.2s"
      >
        <Box
          {...attributes}
          {...listeners}
          cursor="grab"
          _active={{ cursor: 'grabbing' }}
          p={2}
          borderRadius="8px"
          bg="gray.100"
          _hover={{ bg: 'gray.200' }}
        >
          <Text fontSize="16px">☰</Text>
        </Box>
        {onDelete && (
          <IconButton
            aria-label="Delete section"
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={() => onDelete(section.id)}
            icon={<Text fontSize="16px">🗑️</Text>}
          />
        )}
      </HStack>

      {/* Section Badge */}
      <Box
        position="absolute"
        top={2}
        left={2}
        px={3}
        py={1}
        bg="rgba(134, 76, 189, 0.1)"
        borderRadius="full"
        fontSize="xs"
        fontWeight={600}
        color="#864CBD"
        textTransform="uppercase"
      >
        {section.type}
      </Box>

      {/* Section Content */}
      <Box mt={8}>
        <SectionRenderer section={section} />
      </Box>
    </Box>
  );
}

/**
 * Main draggable list component
 */
export function DraggableSectionList({ sections, onReorder, onDelete }: Props) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const newSections = [...sections];
      const [moved] = newSections.splice(oldIndex, 1);
      newSections.splice(newIndex, 0, moved);

      // Update order values to match new positions
      newSections.forEach((section, idx) => {
        section.order = idx;
      });

      onReorder(newSections);
    }
  };

  if (!sections || sections.length === 0) {
    return (
      <Box
        p={12}
        textAlign="center"
        border="2px dashed #e2e8f0"
        borderRadius="16px"
        bg="gray.50"
      >
        <Text fontSize="48px" mb={2}>
          📝
        </Text>
        <Text fontSize="lg" color="gray.600" fontWeight={600}>
          No sections yet
        </Text>
        <Text fontSize="sm" color="gray.500" mt={2}>
          AI will generate content sections when you create a one-pager
        </Text>
      </Box>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <VStack gap={4} align="stretch">
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onDelete={onDelete}
            />
          ))}
        </VStack>
      </SortableContext>
    </DndContext>
  );
}
