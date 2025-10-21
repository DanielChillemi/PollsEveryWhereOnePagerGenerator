/**
 * Brand Kit Preview Component
 * Display user's brand kits with quick access
 */

import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  Skeleton,
  SimpleGrid,
  Badge
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useBrandKits } from '../../hooks/useBrandKit'

interface BrandKitCardProps {
  id: string
  name: string
  primaryColor: string
  secondaryColor?: string
  productCount?: number
  onClick: () => void
}

const BrandKitCard = ({ id, name, primaryColor, secondaryColor, productCount, onClick }: BrandKitCardProps) => {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="gray.300"
      p="5"
      cursor="pointer"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
        borderColor: 'gray.400'
      }}
      onClick={onClick}
    >
      <VStack gap="4" align="start">
        {/* Color Palette Preview */}
        <HStack gap="2">
          <Box
            w="12"
            h="12"
            borderRadius="lg"
            bg={primaryColor}
            border="2px"
            borderColor="gray.200"
            boxShadow="sm"
          />
          {secondaryColor && (
            <Box
              w="12"
              h="12"
              borderRadius="lg"
              bg={secondaryColor}
              border="2px"
              borderColor="gray.200"
              boxShadow="sm"
            />
          )}
        </HStack>

        {/* Brand Kit Info */}
        <VStack gap="1" align="start" w="full">
          <HStack justify="space-between" w="full">
            <Text fontSize="md" fontWeight="600" color="gray.800">
              {name}
            </Text>
            {productCount !== undefined && productCount > 0 && (
              <Badge colorScheme="blue" fontSize="xs">
                {productCount} {productCount === 1 ? 'product' : 'products'}
              </Badge>
            )}
          </HStack>
          <Text fontSize="xs" color="gray.500">
            Click to manage
          </Text>
        </VStack>
      </VStack>
    </Box>
  )
}

const BrandKitSkeleton = () => (
  <Box
    bg="white"
    borderRadius="xl"
    border="1px"
    borderColor="gray.200"
    p="5"
  >
    <VStack gap="4" align="start">
      <HStack gap="2">
        <Skeleton w="12" h="12" borderRadius="lg" />
        <Skeleton w="12" h="12" borderRadius="lg" />
      </HStack>
      <VStack gap="2" align="start" w="full">
        <Skeleton h="4" w="32" />
        <Skeleton h="3" w="20" />
      </VStack>
    </VStack>
  </Box>
)

const PaletteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2C5.589 2 2 5.589 2 10c0 4.411 3.589 8 8 8 .552 0 1-.448 1-1 0-.265-.105-.52-.293-.707-.188-.188-.293-.442-.293-.707 0-.552.448-1 1-1h1.172c2.434 0 4.414-1.98 4.414-4.414C17 5.486 13.866 2 10 2zM5 10c-.828 0-1.5-.672-1.5-1.5S4.172 7 5 7s1.5.672 1.5 1.5S5.828 10 5 10zm2.5-3.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm5 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zM15 10c-.828 0-1.5-.672-1.5-1.5S14.172 7 15 7s1.5.672 1.5 1.5S15.828 10 15 10z"/>
  </svg>
)

export const BrandKitPreview = () => {
  const navigate = useNavigate()
  const { data: brandKits, isLoading } = useBrandKits()

  const handleBrandKitClick = (brandKitId: string) => {
    navigate(`/brand-kit?id=${brandKitId}`)
  }

  const handleManageAll = () => {
    navigate('/brand-kit')
  }

  return (
    <VStack gap="6" align="start" w="full">
      {/* Header */}
      <HStack justify="space-between" w="full">
        <VStack gap="2" align="start">
          <HStack gap="2">
            <PaletteIcon />
            <Heading size="md" color="#007ACC">
              Your Brand Kits
            </Heading>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            Manage your brand assets and color palettes
          </Text>
        </VStack>
        <Button
          variant="outline"
          colorScheme="blue"
          onClick={handleManageAll}
          fontWeight="600"
          size="sm"
        >
          Manage All
        </Button>
      </HStack>

      {/* Brand Kits Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="5" w="full">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <BrandKitSkeleton key={index} />
          ))
        ) : brandKits && brandKits.length > 0 ? (
          // Brand kit cards
          brandKits.slice(0, 3).map((brandKit) => (
            <BrandKitCard
              key={brandKit.id}
              id={brandKit.id}
              name={brandKit.name}
              primaryColor={brandKit.color_palette?.primary || '#007ACC'}
              secondaryColor={brandKit.color_palette?.secondary}
              productCount={brandKit.products?.length || 0}
              onClick={() => handleBrandKitClick(brandKit.id)}
            />
          ))
        ) : (
          // Empty state
          <Box
            gridColumn="1 / -1"
            textAlign="center"
            py="8"
            px="6"
            bg="gray.50"
            borderRadius="xl"
            border="2px dashed"
            borderColor="gray.300"
          >
            <Text fontSize="4xl" mb="3">🎨</Text>
            <Heading size="sm" color="gray.600" mb="2">
              No brand kits yet
            </Heading>
            <Text fontSize="sm" color="gray.500" mb="4">
              Create a brand kit to maintain consistency
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => navigate('/brand-kit')}
              fontWeight="600"
              size="sm"
            >
              Create Brand Kit
            </Button>
          </Box>
        )}
      </SimpleGrid>
    </VStack>
  )
}
