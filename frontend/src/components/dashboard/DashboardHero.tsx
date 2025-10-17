/**
 * Dashboard Hero Section
 * Engaging hero section with call-to-action for creating one-pagers
 */

import {
  Box,
  Heading,
  Text,
  Button,
  VStack
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
  </svg>
)

export const DashboardHero = () => {
  const navigate = useNavigate()
  
  return (
    <Box
      bg="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
      borderRadius="2xl"
      p={{ base: 8, md: 12 }}
      color="white"
      position="relative"
      overflow="hidden"
      minH="280px"
    >
      {/* Background decoration - Extended to right side */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="whiteAlpha.100"
        opacity="0.4"
      />
      <Box
        position="absolute"
        top="50%"
        right="-80px"
        w="250px"
        h="250px"
        borderRadius="full"
        bg="whiteAlpha.100"
        opacity="0.3"
      />
      <Box
        position="absolute"
        bottom="-60px"
        right="20%"
        w="180px"
        h="180px"
        borderRadius="full"
        bg="whiteAlpha.100"
        opacity="0.25"
      />
      <Box
        position="absolute"
        bottom="-30px"
        left="-30px"
        w="120px"
        h="120px"
        borderRadius="full"
        bg="whiteAlpha.100"
        opacity="0.3"
      />

      <VStack gap="6" align="start" position="relative" zIndex="1">
        <VStack gap="4" align="start">
          <Text
            fontSize="sm"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="wider"
            opacity="0.9"
            color="white"
          >
            AI-Powered Marketing
          </Text>
          <Heading size="2xl" lineHeight="1.2" color="white">
            Let's get started
          </Heading>
          <Text fontSize="lg" opacity="0.9" maxW="md" color="white">
            Create your next one pager with AI assistance. Professional layouts, 
            brand consistency, and instant PDF export.
          </Text>
        </VStack>

        <Button
          size="lg"
          bg="white"
          color="blue.600"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'xl'
          }}
          transition="all 0.2s"
          onClick={() => navigate('/onepager/create')}
          fontWeight="600"
          px="8"
        >
          <Box as="span" mr="2">
            <PlusIcon />
          </Box>
          Create new
        </Button>
      </VStack>
    </Box>
  )
}