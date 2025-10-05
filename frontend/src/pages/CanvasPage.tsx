/**
 * Canvas Page
 *
 * Page for viewing and editing one-pager canvases
 */

import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { CanvasRenderer } from '../components/canvas/CanvasRenderer'
import type { OnePagerState, RenderMode } from '../types/onePager'

// Mock data for demonstration
const mockOnePagerState: OnePagerState = {
  title: 'Product Launch One-Pager',
  description: 'Marketing material for our new product',
  sections: [
    {
      id: '1',
      type: 'hero',
      order: 0,
      data: {
        title: 'Transform Your Workflow with AI',
        subtitle: 'The next generation of productivity tools',
        description:
          'Streamline your processes, boost collaboration, and achieve more with our AI-powered platform.',
        button_text: 'Get Started Free',
        button_url: '#signup',
      },
      styling: {
        backgroundColor: '#f0f4f8',
        alignment: 'center',
      },
    },
    {
      id: '2',
      type: 'features',
      order: 1,
      data: {
        title: 'Why Teams Love Us',
        items: [
          {
            id: 'f1',
            icon: '⚡',
            title: 'Lightning Fast',
            description: 'Process documents in seconds, not hours',
          },
          {
            id: 'f2',
            icon: '🎯',
            title: 'Laser Focused',
            description: 'AI-powered insights that matter',
          },
          {
            id: 'f3',
            icon: '🔒',
            title: 'Secure by Default',
            description: 'Enterprise-grade security built in',
          },
        ],
      },
      styling: {
        backgroundColor: '#ffffff',
      },
    },
    {
      id: '3',
      type: 'stats',
      order: 2,
      data: {
        items: [
          {
            id: 's1',
            value: '10M+',
            label: 'Documents Processed',
          },
          {
            id: 's2',
            value: '50K+',
            label: 'Active Users',
          },
          {
            id: 's3',
            value: '99.9%',
            label: 'Uptime',
          },
          {
            id: 's4',
            value: '4.9/5',
            label: 'Customer Rating',
          },
        ],
      },
      styling: {
        backgroundColor: '#f0f4f8',
      },
    },
    {
      id: '4',
      type: 'cta',
      order: 3,
      data: {
        title: 'Ready to Transform Your Workflow?',
        description: 'Join thousands of teams already using our platform',
        button_text: 'Start Free Trial',
      },
    },
  ],
}

export const CanvasPage = () => {
  const [mode, setMode] = useState<RenderMode>('styled')
  const [onePagerState, setOnePagerState] = useState<OnePagerState>(mockOnePagerState)

  const handleSectionReorder = (reorderedSections: any[]) => {
    setOnePagerState({
      ...onePagerState,
      sections: reorderedSections,
    })
    console.log('Sections reordered:', reorderedSections)
  }

  return (
    <Box minHeight="100vh" bg="brand.backgroundGray">
      <CanvasRenderer
        state={onePagerState}
        mode={mode}
        onModeChange={setMode}
        onSectionReorder={handleSectionReorder}
      />
    </Box>
  )
}
