/**
 * OnePager List Page
 *
 * Modern list view with:
 * - Sidebar navigation
 * - Search and filter options
 * - Card-based layout
 * - Create button
 */

import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Badge,
  Spinner,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useOnePagers, useDeleteOnePager } from '../hooks/useOnePager';
import { Sidebar } from '../components/layouts/Sidebar';

type SortOption = 'newest' | 'oldest' | 'updated' | 'favorites';

export function OnePagerListPage() {
  const navigate = useNavigate();
  const { data: onepagers, isLoading, error } = useOnePagers();
  const deleteMutation = useDeleteOnePager();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete OnePager:', error);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'wireframe':
        return 'gray';
      case 'draft':
        return 'blue';
      case 'published':
        return 'green';
      case 'archived':
        return 'orange';
      default:
        return 'gray';
    }
  };

  // Filter and sort onepagers
  const filteredAndSortedOnePagers = (() => {
    if (!onepagers) return [];

    // First, filter by search query
    let filtered = onepagers.filter((onepager) =>
      onepager.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      filtered = filtered.filter((onepager) => favorites.has(onepager.id));
    }

    // Then sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'favorites':
          // Favorites first, then by newest
          const aIsFav = favorites.has(a.id) ? 1 : 0;
          const bIsFav = favorites.has(b.id) ? 1 : 0;
          if (aIsFav !== bIsFav) return bIsFav - aIsFav;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  })();

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <Box ml="280px">
        <Container maxW="1200px" px={{ base: 4, md: 8 }} py={8}>
          <VStack gap={6} align="stretch">
            {/* Header Section */}
            <VStack align="start" gap={1}>
              <Heading
                fontSize="32px"
                fontWeight="700"
                color="#007ACC"
                letterSpacing="-0.01em"
              >
                Your One Pagers
              </Heading>
              <Text fontSize="16px" color="gray.600">
                Projects you created
              </Text>
            </VStack>

            {/* Search and Filter Bar */}
            <HStack gap={3} flexWrap="wrap">
              {/* Search */}
              <InputGroup maxW="400px" flex="1">
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="lg"
                  px={4}
                  borderRadius="8px"
                  border="1px solid"
                  borderColor="gray.200"
                  bg="white"
                  _focus={{
                    borderColor: '#007ACC',
                    boxShadow: '0 0 0 1px #007ACC',
                  }}
                />
              </InputGroup>

              {/* Date Sort Button */}
              <Button
                size="md"
                px={4}
                h="42px"
                borderRadius="8px"
                border="1px solid"
                borderColor={sortBy !== 'newest' ? '#007ACC' : '#E2E8F0'}
                color={sortBy !== 'newest' ? '#007ACC' : '#4A5568'}
                bg={sortBy !== 'newest' ? '#EBF8FF' : 'white'}
                fontWeight="600"
                fontSize="14px"
                transition="all 0.2s ease"
                onClick={() => {
                  // Cycle through date sorting options
                  if (sortBy === 'newest') setSortBy('oldest');
                  else if (sortBy === 'oldest') setSortBy('updated');
                  else setSortBy('newest');
                }}
                _hover={{
                  bg: sortBy !== 'newest' ? '#BEE3F8' : '#F7FAFC',
                  borderColor: '#007ACC',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(0, 122, 204, 0.15)',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                title="Click to cycle through sorting options"
              >
                {sortBy === 'newest' && '↓ Newest'}
                {sortBy === 'oldest' && '↑ Oldest'}
                {sortBy === 'updated' && '↻ Recently Updated'}
              </Button>

              {/* Favorites Button */}
              <Button
                size="md"
                px={4}
                h="42px"
                borderRadius="8px"
                border="1px solid"
                borderColor={showFavoritesOnly ? '#007ACC' : '#E2E8F0'}
                color={showFavoritesOnly ? '#007ACC' : '#4A5568'}
                bg={showFavoritesOnly ? '#EBF8FF' : 'white'}
                fontWeight="600"
                fontSize="14px"
                transition="all 0.2s ease"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                _hover={{
                  bg: showFavoritesOnly ? '#BEE3F8' : '#F7FAFC',
                  borderColor: '#007ACC',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(0, 122, 204, 0.15)',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                title={showFavoritesOnly ? 'Show all one-pagers' : 'Show favorites only'}
              >
                {showFavoritesOnly ? `★ Favorites (${favorites.size})` : '☆ Favorites'}
              </Button>
            </HStack>

            {/* Active Filters Indicator */}
            {(showFavoritesOnly || sortBy !== 'newest' || searchQuery) && (
              <HStack gap={2} flexWrap="wrap">
                {searchQuery && (
                  <Badge
                    colorScheme="blue"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    fontSize="13px"
                    fontWeight="500"
                  >
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {sortBy !== 'newest' && (
                  <Badge
                    colorScheme="purple"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    fontSize="13px"
                    fontWeight="500"
                  >
                    Sort: {sortBy === 'oldest' ? 'Oldest First' : 'Recently Updated'}
                  </Badge>
                )}
                {showFavoritesOnly && (
                  <Badge
                    colorScheme="yellow"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    fontSize="13px"
                    fontWeight="500"
                  >
                    ★ Favorites Only
                  </Badge>
                )}
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.600"
                  onClick={() => {
                    setSearchQuery('');
                    setSortBy('newest');
                    setShowFavoritesOnly(false);
                  }}
                  _hover={{
                    bg: 'gray.100',
                  }}
                >
                  Clear all filters
                </Button>
              </HStack>
            )}

            {/* Loading State */}
            {isLoading && (
              <Box textAlign="center" py={16}>
                <Spinner size="xl" color="#007ACC" borderWidth="3px" />
                <Text mt={4} color="gray.600" fontSize="16px">
                  Loading your one-pagers...
                </Text>
              </Box>
            )}

            {/* Error State */}
            {error && (
              <Box
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="12px"
                p={6}
                textAlign="center"
              >
                <Text color="red.700" fontWeight={600} fontSize="16px">
                  Failed to load one-pagers. Please try again.
                </Text>
              </Box>
            )}

            {/* Empty State - Only show when truly empty (no filters active) */}
            {!isLoading && !error && filteredAndSortedOnePagers.length === 0 && !searchQuery && !showFavoritesOnly && (
              <Box
                bg="white"
                borderRadius="16px"
                p={16}
                textAlign="center"
                border="2px dashed"
                borderColor="gray.200"
              >
                <Text fontSize="64px" mb={4}>
                  📄
                </Text>
                <Heading size="lg" color="gray.900" mb={2} fontWeight="600">
                  No One-Pagers Yet
                </Heading>
                <Text fontSize="16px" color="gray.600" mb={6}>
                  Create your first AI-powered marketing one-pager
                </Text>
                <Button
                  onClick={() => navigate('/onepager/create')}
                  size="lg"
                  px={8}
                  bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
                  color="white"
                  borderRadius="8px"
                  fontWeight="600"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                >
                  Get Started
                </Button>
              </Box>
            )}

            {/* No Search/Filter Results */}
            {!isLoading && !error && filteredAndSortedOnePagers.length === 0 && (searchQuery || showFavoritesOnly) && (
              <Box
                bg="white"
                borderRadius="16px"
                p={12}
                textAlign="center"
                border="1px solid"
                borderColor="gray.200"
              >
                <Text fontSize="48px" mb={3}>
                  {showFavoritesOnly ? '⭐' : '🔍'}
                </Text>
                <Heading size="md" color="gray.900" mb={2} fontWeight="600">
                  {showFavoritesOnly && !searchQuery ? 'No favorites yet' : 'No results found'}
                </Heading>
                <Text fontSize="16px" color="gray.600" mb={4}>
                  {showFavoritesOnly && !searchQuery 
                    ? 'Click the star on any one-pager to add it to favorites' 
                    : 'Try adjusting your search terms or filters'}
                </Text>
                {(searchQuery || showFavoritesOnly) && (
                  <Button
                    size="md"
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => {
                      setSearchQuery('');
                      setShowFavoritesOnly(false);
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </Box>
            )}

            {/* OnePager Cards Grid */}
            {!isLoading && filteredAndSortedOnePagers.length > 0 && (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {filteredAndSortedOnePagers.map((onepager) => (
                  <Box
                    key={onepager.id}
                    bg="white"
                    borderRadius="16px"
                    overflow="hidden"
                    boxShadow="0 1px 3px rgba(0, 0, 0, 0.06)"
                    border="1px solid"
                    borderColor="gray.200"
                    position="relative"
                    _hover={{
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      borderColor: 'gray.300',
                    }}
                    transition="all 0.2s ease"
                    cursor="pointer"
                    onClick={() => navigate(`/onepager/create?id=${onepager.id}`)}
                  >
                    {/* Menu Button - Top Right */}
                    <Box
                      position="absolute"
                      top="8px"
                      right="8px"
                      zIndex={10}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HStack gap={2}>
                        {/* Favorite Star */}
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(onepager.id);
                          }}
                          cursor="pointer"
                          fontSize="16px"
                          color={favorites.has(onepager.id) ? '#FFD700' : 'gray.400'}
                          transition="all 0.2s ease"
                          w="28px"
                          h="28px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bg="white"
                          borderRadius="6px"
                          boxShadow="0 1px 3px rgba(0,0,0,0.1)"
                          _hover={{
                            transform: 'scale(1.1)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          }}
                        >
                          {favorites.has(onepager.id) ? '★' : '☆'}
                        </Box>
                      </HStack>
                    </Box>

                    {/* Preview/Thumbnail Area */}
                    <Box
                      bg="gray.50"
                      h="120px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      position="relative"
                    >
                      {/* Icon/Logo Placeholder */}
                      <Box
                        w="56px"
                        h="56px"
                        bg="white"
                        borderRadius="12px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="1px solid"
                        borderColor="gray.200"
                        boxShadow="0 2px 8px rgba(0,0,0,0.08)"
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CBD5E0" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="12" y1="18" x2="12" y2="12"/>
                          <line x1="9" y1="15" x2="15" y2="15"/>
                        </svg>
                      </Box>
                    </Box>

                    {/* Card Content */}
                    <VStack align="stretch" gap={0} p={4}>
                      {/* Title */}
                      <Heading
                        fontSize="15px"
                        fontWeight="600"
                        color="gray.900"
                        lineClamp={2}
                        mb={2}
                        letterSpacing="-0.01em"
                      >
                        {onepager.title}
                      </Heading>

                      {/* Metadata Row */}
                      <HStack gap={2} mb={2} flexWrap="wrap">
                        {/* Status Badge */}
                        <Badge
                          colorScheme={getStatusColor(onepager.status)}
                          fontSize="10px"
                          px={2}
                          py={0.5}
                          borderRadius="4px"
                          textTransform="capitalize"
                          fontWeight="500"
                        >
                          {onepager.status}
                        </Badge>

                        {onepager.has_brand_kit && (
                          <Badge
                            bg="purple.50"
                            color="#864CBD"
                            fontSize="10px"
                            px={2}
                            py={0.5}
                            borderRadius="4px"
                            fontWeight="600"
                          >
                            🎨 Brand Kit
                          </Badge>
                        )}
                      </HStack>

                      {/* Date */}
                      <Text fontSize="12px" color="gray.500" mb={3}>
                        Updated {new Date(onepager.updated_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </Text>

                      {/* Action Buttons */}
                      <HStack gap={2} onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="xs"
                          flex="1"
                          h="32px"
                          onClick={() => navigate(`/onepager/create?id=${onepager.id}`)}
                          variant="ghost"
                          color="gray.700"
                          fontWeight="500"
                          fontSize="13px"
                          _hover={{
                            bg: 'gray.100',
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="xs"
                          h="32px"
                          px={3}
                          onClick={() => handleDelete(onepager.id, onepager.title)}
                          variant="ghost"
                          color="gray.500"
                          fontWeight="500"
                          fontSize="13px"
                          _hover={{
                            bg: 'gray.100',
                            color: 'red.600',
                          }}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

export default OnePagerListPage;
