/**
 * Recent Projects Section
 * Display user's recent one-pager projects with modern card design
 */

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  IconButton,
  Badge,
  Skeleton,
  Button
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useState } from 'react'
import type { OnePagerStatus } from '../../types/onepager'
import { useDeleteOnePager } from '../../hooks/useOnePager'

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
  </svg>
)

interface ProjectCardProps {
  id: string
  title: string
  updatedAt: string
  status: OnePagerStatus
  thumbnail?: string
  onClick: () => void
  onDelete: (id: string) => void
}

const getStatusColor = (status: OnePagerStatus) => {
  switch (status) {
    case 'published':
      return 'green'
    case 'wireframe':
      return 'blue'
    case 'archived':
      return 'red'
    case 'draft':
    default:
      return 'gray'
  }
}

const ProjectCard = ({ id, title, updatedAt, status, thumbnail, onClick, onDelete }: ProjectCardProps) => {
  const [showMenu, setShowMenu] = useState(false)

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id)
    }
    setShowMenu(false)
  }

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="gray.300"
      overflow="hidden"
      cursor="pointer"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
        borderColor: 'gray.400'
      }}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <Box
        h="140px"
        bg="gray.100"
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {thumbnail ? (
          <Box
            w="full"
            h="full"
            backgroundImage={`url(${thumbnail})`}
            backgroundSize="cover"
            backgroundPosition="center"
          />
        ) : (
          <Box
            w="16"
            h="16"
            bg="gray.200"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xl" color="gray.400">📄</Text>
          </Box>
        )}

        {/* Menu Button */}
        <Box position="absolute" top="2" right="2">
          <IconButton
            variant="ghost"
            size="sm"
            bg="whiteAlpha.900"
            _hover={{ bg: 'white' }}
            onClick={handleMenuClick}
          >
            <MoreIcon />
          </IconButton>
          
          {/* Simple dropdown menu */}
          {showMenu && (
            <Box
              position="absolute"
              top="full"
              right="0"
              mt="1"
              bg="white"
              borderRadius="md"
              boxShadow="lg"
              border="1px"
              borderColor="gray.200"
              minW="120px"
              zIndex="dropdown"
            >
              <Button
                variant="ghost"
                size="sm"
                w="full"
                color="red.600"
                _hover={{ bg: 'red.50' }}
                onClick={handleDelete}
                justifyContent="flex-start"
                px="3"
                py="2"
                fontSize="sm"
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Content */}
      <VStack gap="1.5" p="3" align="start">
        <HStack justify="space-between" w="full" align="start">
          <Text 
            fontSize="md" 
            fontWeight="600" 
            color="gray.800"
            textOverflow="ellipsis" 
            overflow="hidden" 
            whiteSpace="nowrap" 
            flex="1"
          >
            {title}
          </Text>
          <Badge
            colorScheme={getStatusColor(status)}
            fontSize="2xs"
            px="2"
            py="0.5"
          >
            {status}
          </Badge>
        </HStack>
        <Text fontSize="2xs" color="gray.500">
          Updated {format(new Date(updatedAt), 'MMM dd, yyyy')}
        </Text>
      </VStack>
    </Box>
  )
}

const ProjectSkeleton = () => (
  <Box
    bg="white"
    borderRadius="xl"
    border="1px"
    borderColor="gray.200"
    overflow="hidden"
  >
    <Skeleton h="140px" />
    <VStack gap="2" p="4" align="start">
      <Skeleton h="4" w="60%" />
      <Skeleton h="3" w="40%" />
    </VStack>
  </Box>
)

interface RecentProjectsProps {
  projects?: Array<{
    id: string
    title: string
    updated_at: string
    status: OnePagerStatus
    thumbnail?: string
  }>
  isLoading?: boolean
}

export const RecentProjects = ({ projects = [], isLoading = false }: RecentProjectsProps) => {
  const navigate = useNavigate()
  const deleteOnePager = useDeleteOnePager()

  const handleProjectClick = (projectId: string) => {
    navigate(`/onepager/create?id=${projectId}`)
  }

  const handleDelete = (projectId: string) => {
    deleteOnePager.mutate(projectId)
  }

  return (
    <VStack gap="6" align="start" w="full">
      <HStack justify="space-between" w="full">
        <VStack gap="2" align="start">
          <Heading size="md" color="#007ACC">
            Your Recent Projects
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Projects you created or recently opened
          </Text>
        </VStack>
        {projects.length > 0 && (
          <Button
            variant="ghost"
            colorScheme="blue"
            onClick={() => navigate('/onepager/list')}
            fontWeight="600"
          >
            View All →
          </Button>
        )}
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6" w="full">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <ProjectSkeleton key={index} />
          ))
        ) : projects.length > 0 ? (
          // Project cards
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              updatedAt={project.updated_at}
              status={project.status}
              thumbnail={project.thumbnail}
              onClick={() => handleProjectClick(project.id)}
              onDelete={handleDelete}
            />
          ))
        ) : (
          // Empty state
          <Box
            gridColumn="1 / -1"
            textAlign="center"
            py="12"
            px="6"
            bg="gray.50"
            borderRadius="xl"
            border="2px dashed"
            borderColor="gray.300"
          >
            <Text fontSize="6xl" mb="4">📄</Text>
            <Heading size="md" color="gray.600" mb="2">
              No projects yet
            </Heading>
            <Text color="gray.500" mb="6">
              Create your first one-pager to get started
            </Text>
            <Box
              as="button"
              px="6"
              py="3"
              bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
              color="white"
              borderRadius="lg"
              fontWeight="600"
              _hover={{
                transform: 'translateY(-1px)',
                boxShadow: 'lg'
              }}
              transition="all 0.2s"
              onClick={() => navigate('/onepager/create')}
            >
              Create your first project
            </Box>
          </Box>
        )}
      </SimpleGrid>
    </VStack>
  )
}