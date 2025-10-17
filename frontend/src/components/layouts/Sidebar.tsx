/**
 * Sidebar Navigation Component
 * Modern sidebar with Onepaige branding and main navigation
 */

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, useLogout } from '../../hooks/useAuth'

// Custom icons as React components
const CreateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
  </svg>
)

const BrandKitIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
  </svg>
)

const OnePagerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v8H6V6z" clipRule="evenodd" />
  </svg>
)

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onClick: () => void
  isCreateButton?: boolean
}

const SidebarItem = ({ icon, label, isActive, onClick, isCreateButton }: SidebarItemProps) => {
  if (isCreateButton) {
    return (
      <Button
        w="full"
        h="12"
        bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
        color="white"
        borderRadius="xl"
        _hover={{
          transform: 'translateY(-1px)',
          boxShadow: 'lg'
        }}
        transition="all 0.2s"
        onClick={onClick}
        fontWeight="600"
      >
        <HStack gap="2">
          {icon}
          <Text>{label}</Text>
        </HStack>
      </Button>
    )
  }

  return (
    <HStack
      w="full"
      px="4"
      py="3"
      borderRadius="lg"
      cursor="pointer"
      bg={isActive ? 'blue.50' : 'transparent'}
      color={isActive ? 'blue.600' : 'gray.600'}
      _hover={{ bg: 'gray.100' }}
      transition="all 0.2s"
      onClick={onClick}
    >
      {icon}
      <Text fontWeight={isActive ? '600' : '500'}>{label}</Text>
    </HStack>
  )
}

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const logout = useLogout()

  const navigationItems = [
    {
      icon: <BrandKitIcon />,
      label: 'Brand Kit',
      path: '/brand-kit',
      onClick: () => navigate('/brand-kit/list')
    },
    {
      icon: <OnePagerIcon />,
      label: 'One Pagers',
      path: '/onepager',
      onClick: () => navigate('/onepager/list')
    }
  ]

  return (
    <Box
      position="fixed"
      left="0"
      top="0"
      h="100vh"
      w="280px"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      zIndex="sticky"
    >
      <VStack gap="0" align="stretch" h="full">
        {/* Logo */}
        <Box p="6" borderBottom="1px" borderColor="gray.200">
          <Image
            src="/onepaige-color.svg"
            alt="Onepaige"
            h="13"
            w="auto"
            cursor="pointer"
            onClick={() => navigate('/')}
          />
        </Box>

        {/* Navigation */}
        <VStack gap="1" align="stretch" p="4" flex="1">
          {/* Create Button */}
          <Box mb="4">
            <SidebarItem
              icon={<CreateIcon />}
              label="Create"
              onClick={() => navigate('/dashboard')}
              isCreateButton
            />
          </Box>

          {/* Navigation Items */}
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname.startsWith(item.path)}
              onClick={item.onClick}
            />
          ))}
        </VStack>

        {/* User Profile */}
        <Box p="4" borderTop="1px" borderColor="gray.200">
          <HStack gap="3" w="full" p="3" borderRadius="lg">
            <Box
              w="8"
              h="8"
              bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontWeight="bold" fontSize="sm">
                {user?.full_name?.charAt(0) || 'U'}
              </Text>
            </Box>
            <Box flex="1">
              <Text fontSize="sm" fontWeight="600" color="gray.800">
                {user?.full_name || 'User'}
              </Text>
              <Text fontSize="xs" color="gray.500" truncate>
                {user?.email}
              </Text>
            </Box>
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            w="full"
            mt="2"
            color="red.500"
            onClick={logout}
          >
            Sign Out
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}