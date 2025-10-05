/**
 * Section Wrapper Component
 *
 * Wrapper for canvas sections with wireframe/styled modes
 */

import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { RenderMode } from '../../types/onePager'

interface SectionWrapperProps {
  children: ReactNode
  mode: RenderMode
  backgroundColor?: string
  textColor?: string
  padding?: string
  alignment?: 'left' | 'center' | 'right'
}

export const SectionWrapper = ({
  children,
  mode,
  backgroundColor,
  textColor,
  padding = '64px 24px',
  alignment = 'left',
}: SectionWrapperProps) => {
  if (mode === 'wireframe') {
    return (
      <Box
        border="2px dashed"
        borderColor="gray.400"
        p={6}
        bg="gray.50"
        position="relative"
        textAlign={alignment}
      >
        {children}
      </Box>
    )
  }

  return (
    <Box
      bg={backgroundColor || 'white'}
      color={textColor || 'brand.text'}
      p={padding}
      textAlign={alignment}
    >
      {children}
    </Box>
  )
}
