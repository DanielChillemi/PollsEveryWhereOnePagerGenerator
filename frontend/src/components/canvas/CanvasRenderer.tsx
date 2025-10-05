/**
 * Canvas Renderer Component
 *
 * Main component that renders the entire one-pager from JSON state
 */

import { Box, VStack, Heading, Text, Button, HStack } from '@chakra-ui/react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { OnePagerState, RenderMode } from '../../types/onePager'
import { HeroSection } from './sections/HeroSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { StatsSection } from './sections/StatsSection'
import { DraggableSection } from './DraggableSection'

interface CanvasRendererProps {
  state: OnePagerState
  mode: RenderMode
  onModeChange?: (mode: RenderMode) => void
  onSectionReorder?: (sections: any[]) => void
}

export const CanvasRenderer = ({ state, mode, onModeChange, onSectionReorder }: CanvasRendererProps) => {
  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sortedSections.findIndex((s) => s.id === active.id)
      const newIndex = sortedSections.findIndex((s) => s.id === over.id)

      const reorderedSections = arrayMove(sortedSections, oldIndex, newIndex).map(
        (section, index) => ({
          ...section,
          order: index,
        })
      )

      if (onSectionReorder) {
        onSectionReorder(reorderedSections)
      }
    }
  }

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={section.id} section={section} mode={mode} />

      case 'features':
        return <FeaturesSection key={section.id} section={section} mode={mode} />

      case 'stats':
        return <StatsSection key={section.id} section={section} mode={mode} />

      case 'cta':
        // Simplified CTA - can be expanded later
        return (
          <Box key={section.id} bg="brand.primary" color="white" py={16} textAlign="center">
            <VStack gap={4}>
              <Heading size="xl">{section.data.title || 'Ready to get started?'}</Heading>
              {section.data.description && (
                <Text fontSize="lg" maxW="600px">
                  {section.data.description}
                </Text>
              )}
              {section.data.button_text && (
                <Button size="lg" colorScheme="whiteAlpha" mt={4}>
                  {section.data.button_text}
                </Button>
              )}
            </VStack>
          </Box>
        )

      case 'about':
      case 'testimonials':
      case 'contact':
        // Fallback for sections we haven't built yet
        return (
          <Box
            key={section.id}
            border="2px dashed"
            borderColor="gray.400"
            p={8}
            textAlign="center"
            bg="gray.50"
          >
            <Text fontWeight="semibold" color="gray.600">
              {section.type.toUpperCase()} Section
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              (Coming soon)
            </Text>
          </Box>
        )

      default:
        return null
    }
  }

  // Sort sections by order
  const sortedSections = [...state.sections].sort((a, b) => a.order - b.order)

  return (
    <Box>
      {/* Mode Toggle */}
      {onModeChange && (
        <Box
          position="sticky"
          top={0}
          zIndex={10}
          bg="white"
          borderBottom="1px solid"
          borderColor="brand.border"
          p={4}
        >
          <HStack justify="space-between">
            <Heading size="md">{state.title}</Heading>
            <HStack gap={2}>
              <Button
                size="sm"
                variant={mode === 'wireframe' ? 'solid' : 'outline'}
                colorScheme="gray"
                onClick={() => onModeChange('wireframe')}
              >
                Wireframe
              </Button>
              <Button
                size="sm"
                variant={mode === 'styled' ? 'solid' : 'outline'}
                colorScheme="blue"
                onClick={() => onModeChange('styled')}
              >
                Styled
              </Button>
            </HStack>
          </HStack>
        </Box>
      )}

      {/* Render Sections with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedSections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <VStack gap={0} align="stretch">
            {sortedSections.map((section) => (
              <DraggableSection key={section.id} id={section.id}>
                {renderSection(section)}
              </DraggableSection>
            ))}
          </VStack>
        </SortableContext>
      </DndContext>

      {/* Empty State */}
      {sortedSections.length === 0 && (
        <Box textAlign="center" py={20}>
          <Text fontSize="4xl" mb={4}>
            📄
          </Text>
          <Heading size="lg" mb={2}>
            No Sections Yet
          </Heading>
          <Text color="brand.textLight">
            Add sections to start building your one-pager
          </Text>
        </Box>
      )}
    </Box>
  )
}
