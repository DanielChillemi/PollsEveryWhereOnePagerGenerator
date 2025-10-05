/**
 * Draggable Section Component
 *
 * Wrapper that makes sections drag and droppable
 */

import { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, HStack, IconButton, Text } from '@chakra-ui/react'

interface DraggableSectionProps {
  id: string
  children: ReactNode
  isDragging?: boolean
}

export const DraggableSection = ({ id, children, isDragging }: DraggableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  return (
    <Box ref={setNodeRef} style={style} position="relative">
      {/* Drag Handle */}
      <Box
        position="absolute"
        top={2}
        right={2}
        zIndex={5}
        bg="white"
        borderRadius="md"
        boxShadow="md"
        border="1px solid"
        borderColor="brand.border"
        opacity={0.9}
        _hover={{ opacity: 1 }}
      >
        <HStack p={2} gap={2}>
          <Text fontSize="xs" fontWeight="semibold" color="brand.text">
            Drag to reorder
          </Text>
          <IconButton
            {...attributes}
            {...listeners}
            size="sm"
            variant="ghost"
            cursor="grab"
            _active={{ cursor: 'grabbing' }}
            aria-label="Drag handle"
          >
            ⠿
          </IconButton>
        </HStack>
      </Box>

      {/* Section Content */}
      {children}
    </Box>
  )
}
