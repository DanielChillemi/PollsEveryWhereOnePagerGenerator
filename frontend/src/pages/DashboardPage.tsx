/**
 * Modern Dashboard Layout Component
 * Main layout with sidebar and content area
 */

import { Box, Container, VStack } from '@chakra-ui/react'
import { Sidebar } from '../components/layouts/Sidebar'
import { DashboardHero } from '../components/dashboard/DashboardHero'
import { DashboardStats } from '../components/dashboard/DashboardStats'
import { QuickStartTemplates } from '../components/dashboard/QuickStartTemplates'
import { RecentProjects } from '../components/dashboard/RecentProjects'
import { BrandKitPreview } from '../components/dashboard/BrandKitPreview'
import { useOnePagers } from '../hooks/useOnePager'
import { useMemo } from 'react'

export function DashboardPage() {
  // Fetch ALL one-pagers to calculate statistics
  const { data: allOnePagers, isLoading: isLoadingAll } = useOnePagers(0, 100)

  // Fetch recent one-pagers (limit to 3 most recent for display)
  const { data: recentOnePagers, isLoading: isLoadingRecent } = useOnePagers(0, 3)

  // Calculate statistics
  const stats = useMemo(() => {
    if (!allOnePagers) {
      return {
        totalProjects: 0,
        thisWeekProjects: 0,
        totalExports: 0
      }
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const thisWeekProjects = allOnePagers.filter((onepager) => {
      const createdAt = new Date(onepager.created_at)
      return createdAt >= oneWeekAgo
    }).length

    // For now, we'll estimate exports as ~60% of total projects
    // In the future, this could come from actual export tracking in the backend
    const estimatedExports = Math.floor(allOnePagers.length * 0.6)

    return {
      totalProjects: allOnePagers.length,
      thisWeekProjects,
      totalExports: estimatedExports
    }
  }, [allOnePagers])

  // Transform API data to match RecentProjects component interface
  const projects = recentOnePagers?.map((onepager) => ({
    id: onepager.id,
    title: onepager.title,
    updated_at: onepager.updated_at,
    status: onepager.status,
    thumbnail: undefined // Thumbnails can be added later if available
  })) || []

  return (
    <Box minH="100vh" bg="#F7F8FA">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <Box ml="280px">
        <Container maxW="1200px" px={{ base: 4, md: 8 }} py={8}>
          <VStack gap="8" align="stretch">
            {/* Hero Section */}
            <DashboardHero />

            {/* Statistics Cards */}
            <DashboardStats
              totalProjects={stats.totalProjects}
              thisWeekProjects={stats.thisWeekProjects}
              totalExports={stats.totalExports}
              isLoading={isLoadingAll}
            />

            {/* Quick Start Templates */}
            <QuickStartTemplates />

            {/* Recent Projects */}
            <RecentProjects projects={projects} isLoading={isLoadingRecent} />

            {/* Brand Kit Preview */}
            <BrandKitPreview />
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default DashboardPage
