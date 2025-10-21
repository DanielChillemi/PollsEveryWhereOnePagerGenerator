/**
 * Modern Dashboard Layout Component
 * Main layout with sidebar and content area
 */

import { Box, Container, VStack } from '@chakra-ui/react'
import { Sidebar } from '../components/layouts/Sidebar'
import { DashboardHero } from '../components/dashboard/DashboardHero'
import { RecentProjects } from '../components/dashboard/RecentProjects'

export function DashboardPage() {
  // Mock data for projects (you can replace with actual API data)
  const mockProjects = [
    {
      id: '1',
      title: 'Product Launch One-Pager',
      updated_at: '2025-10-14T10:30:00Z',
      status: 'draft' as const,
      thumbnail: undefined
    },
    {
      id: '2',
      title: 'Q4 Marketing Campaign',
      updated_at: '2025-10-12T15:45:00Z',
      status: 'published' as const,
      thumbnail: undefined
    },
    {
      id: '3',
      title: 'Event Promotion',
      updated_at: '2025-10-10T09:15:00Z',
      status: 'draft' as const,
      thumbnail: undefined
    }
  ]

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content */}
      <Box ml="280px">
        <Container maxW="1200px" px={{ base: 4, md: 8 }} py={8}>
          <VStack gap="8" align="stretch">
            {/* Hero Section */}
            <DashboardHero />
            
            {/* Recent Projects */}
            <RecentProjects projects={mockProjects} isLoading={false} />
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default DashboardPage