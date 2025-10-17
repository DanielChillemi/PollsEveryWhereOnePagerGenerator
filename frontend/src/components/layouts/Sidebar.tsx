/**
 * Sidebar Navigation Component
 * Modern sidebar with Onepaige branding and main navigation
 * Responsive: Collapsible on desktop, drawer on mobile
 */

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  IconButton,
  useDisclosure,
  useBreakpointValue
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

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
)

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onClick: () => void
  isCreateButton?: boolean
  isCollapsed?: boolean
}

const SidebarItem = ({ icon, label, isActive, onClick, isCreateButton, isCollapsed }: SidebarItemProps) => {
  if (isCreateButton) {
    return (
      <Button
        w="full"
        h="12"
        bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
        color="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(33, 150, 243, 0.25)"
        _hover={{
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
        }}
        transition="all 0.2s"
        onClick={onClick}
        fontWeight="600"
        justifyContent="center"
      >
        <HStack gap="2">
          {icon}
          {!isCollapsed && <Text>{label}</Text>}
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
      position="relative"
      bg={isActive ? 'white' : 'transparent'}
      color={isActive ? '#007ACC' : 'gray.600'}
      border="1px solid"
      borderColor={isActive ? 'blue.200' : 'transparent'}
      boxShadow={isActive ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none'}
      _hover={{ 
        bg: isActive ? 'white' : 'gray.50',
        borderColor: isActive ? 'blue.200' : 'gray.200'
      }}
      transition="all 0.2s"
      onClick={onClick}
      justifyContent={isCollapsed ? 'center' : 'flex-start'}
    >
      {isActive && !isCollapsed && (
        <Box
          position="absolute"
          left="0"
          top="50%"
          transform="translateY(-50%)"
          w="3px"
          h="20px"
          bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
          borderRadius="0 2px 2px 0"
        />
      )}
      {icon}
      {!isCollapsed && <Text fontWeight={isActive ? '600' : '500'}>{label}</Text>}
    </HStack>
  )
}

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const logout = useLogout()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { open: isOpen, onOpen, onClose } = useDisclosure()

  const navigationItems = [
    {
      icon: <BrandKitIcon />,
      label: 'Brand Kit',
      path: '/brand-kit',
      onClick: () => {
        navigate('/brand-kit/list')
        if (isMobile) onClose()
      }
    },
    {
      icon: <OnePagerIcon />,
      label: 'One Pagers',
      path: '/onepager',
      onClick: () => {
        navigate('/onepager/list')
        if (isMobile) onClose()
      }
    }
  ]

  // Sidebar content component (reused for desktop and mobile)
  const SidebarContent = ({ isCollapsed: collapsed = false }: { isCollapsed?: boolean }) => (
    <VStack gap="0" align="stretch" h="full">
      {/* Logo */}
      <Box 
        p={collapsed ? "4" : "6"} 
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        display="flex"
        justifyContent={collapsed ? "center" : "flex-start"}
      >
        <Image
          src="/onepaige-color.svg"
          alt="Onepaige"
          h={collapsed ? "8" : "13"}
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
            onClick={() => {
              navigate('/dashboard')
              if (isMobile) onClose()
            }}
            isCreateButton
            isCollapsed={collapsed}
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
            isCollapsed={collapsed}
          />
        ))}
      </VStack>

      {/* User Profile */}
      <Box 
        p="4" 
        bg="white"
        borderTop="1px solid"
        borderColor="gray.200"
        boxShadow="0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        {!collapsed && (
          <>
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
          </>
        )}
        {collapsed && (
          <Box display="flex" justifyContent="center">
            <Box
              w="10"
              h="10"
              bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={logout}
            >
              <Text color="white" fontWeight="bold" fontSize="md">
                {user?.full_name?.charAt(0) || 'U'}
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </VStack>
  )

  // Mobile: Hamburger menu + Drawer
  if (isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <IconButton
          position="fixed"
          top="4"
          left="4"
          zIndex="docked"
          onClick={onOpen}
          variant="solid"
          bg="white"
          boxShadow="md"
          _hover={{ bg: 'gray.50' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile drawer */}
        <Box
          position="fixed"
          top="0"
          left={isOpen ? "0" : "-280px"}
          h="100vh"
          w="280px"
          bg="#FAFBFC"
          borderRight="1px solid"
          borderColor="gray.200"
          boxShadow="0 0 20px rgba(0, 0, 0, 0.04)"
          zIndex="modal"
          transition="left 0.3s ease-in-out"
        >
          <SidebarContent />
          {/* Close button */}
          <IconButton
            position="absolute"
            top="4"
            right="4"
            onClick={onClose}
            variant="ghost"
            size="sm"
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      </>
    )
  }

  // Desktop: Collapsible sidebar
  return (
    <>
      <Box
        position="fixed"
        left="0"
        top="0"
        h="100vh"
        w={isCollapsed ? "80px" : "280px"}
        bg="#FAFBFC"
        borderRight="1px solid"
        borderColor="gray.200"
        boxShadow="0 0 20px rgba(0, 0, 0, 0.04)"
        zIndex="sticky"
        transition="width 0.3s ease-in-out"
      >
        <SidebarContent isCollapsed={isCollapsed} />
        
        {/* Collapse toggle button */}
        <IconButton
          position="absolute"
          top="50%"
          right="-12px"
          transform="translateY(-50%)"
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="solid"
          bg="white"
          size="sm"
          borderRadius="full"
          boxShadow="md"
          _hover={{ bg: 'gray.50' }}
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      
      {/* Spacer to prevent content overlap */}
      <Box 
        w={isCollapsed ? "80px" : "280px"} 
        flexShrink={0}
        transition="width 0.3s ease-in-out"
      />
    </>
  )
}