/**
 * Dashboard Statistics Cards
 * Display key metrics in an engaging visual format
 */

import {
  Box,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Skeleton
} from '@chakra-ui/react'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  gradient: string
  isLoading?: boolean
}

const StatCard = ({ label, value, icon, trend, gradient, isLoading }: StatCardProps) => {
  if (isLoading) {
    return (
      <Box
        bg="white"
        borderRadius="2xl"
        p="6"
        border="1px"
        borderColor="gray.200"
        boxShadow="sm"
      >
        <VStack gap="3" align="start">
          <Skeleton h="10" w="10" borderRadius="xl" />
          <Skeleton h="8" w="20" />
          <Skeleton h="4" w="24" />
        </VStack>
      </Box>
    )
  }

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      p="6"
      border="1px"
      borderColor="gray.300"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
      position="relative"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
        borderColor: 'gray.400'
      }}
    >
      {/* Background gradient decoration */}
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        w="100px"
        h="100px"
        borderRadius="full"
        bg={gradient}
        opacity="0.08"
      />

      <VStack gap="3" align="start" position="relative">
        {/* Icon */}
        <Box
          p="3"
          borderRadius="xl"
          bg={gradient}
          color="white"
          fontSize="xl"
          lineHeight="1"
        >
          {icon}
        </Box>

        {/* Value */}
        <Text
          fontSize="3xl"
          fontWeight="700"
          color="gray.800"
          lineHeight="1"
        >
          {value}
        </Text>

        {/* Label and Trend */}
        <HStack justify="space-between" w="full">
          <Text fontSize="sm" color="gray.600" fontWeight="500">
            {label}
          </Text>
          {trend && (
            <HStack gap="1">
              <Text
                fontSize="xs"
                fontWeight="600"
                color={trend.isPositive ? 'green.600' : 'red.600'}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </Text>
            </HStack>
          )}
        </HStack>
      </VStack>
    </Box>
  )
}

// Icons
const FolderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const SparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C12 0 10 8 10 12C10 16 12 24 12 24C12 24 14 16 14 12C14 8 12 0 12 0Z" />
    <path d="M0 12C0 12 8 10 12 10C16 10 24 12 24 12C24 12 16 14 12 14C8 14 0 12 0 12Z" />
  </svg>
)

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

interface DashboardStatsProps {
  totalProjects?: number
  thisWeekProjects?: number
  totalExports?: number
  isLoading?: boolean
}

export const DashboardStats = ({
  totalProjects = 0,
  thisWeekProjects = 0,
  totalExports = 0,
  isLoading = false
}: DashboardStatsProps) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap="6" w="full">
      <StatCard
        label="Total Projects"
        value={totalProjects}
        icon={<FolderIcon />}
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        isLoading={isLoading}
      />
      <StatCard
        label="Created This Week"
        value={thisWeekProjects}
        icon={<SparklesIcon />}
        trend={{ value: "+12%", isPositive: true }}
        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        isLoading={isLoading}
      />
      <StatCard
        label="PDF Exports"
        value={totalExports}
        icon={<DocumentIcon />}
        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        isLoading={isLoading}
      />
    </SimpleGrid>
  )
}
