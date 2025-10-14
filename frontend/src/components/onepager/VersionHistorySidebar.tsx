/**
 * Version History Sidebar
 *
 * Displays version history with restore functionality.
 * Shows timeline of all saved versions with timestamps.
 */

import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Heading,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';

interface VersionSnapshot {
  version: number;
  created_at: string;
  change_description?: string;
  content: {
    headline: string;
    sections: any[];
  };
}

interface Props {
  versions: VersionSnapshot[];
  currentVersion?: number;
  onRestore: (version: number) => void;
  isRestoring: boolean;
}

export function VersionHistorySidebar({ versions, currentVersion, onRestore, isRestoring }: Props) {
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null);

  if (!versions || versions.length === 0) {
    return (
      <Box
        bg="white"
        p={6}
        borderRadius="12px"
        boxShadow="sm"
        border="1px solid #e2e8f0"
      >
        <Heading size="sm" mb={4} color="#2d3748">
          📜 Version History
        </Heading>
        <VStack gap={3} align="center" py={8}>
          <Text fontSize="48px">📝</Text>
          <Text fontSize="sm" color="gray.600" textAlign="center">
            No version history yet
          </Text>
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Versions are created when you iterate with AI
          </Text>
        </VStack>
      </Box>
    );
  }

  // Sort versions by version number (newest first)
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="12px"
      boxShadow="sm"
      border="1px solid #e2e8f0"
      maxH="600px"
      overflowY="auto"
    >
      <Heading size="sm" mb={4} color="#2d3748">
        📜 Version History
      </Heading>

      <VStack gap={3} align="stretch">
        {sortedVersions.map((snapshot, index) => {
          const isCurrentVersion = currentVersion === snapshot.version;
          const isExpanded = expandedVersion === snapshot.version;
          const formattedTime = formatDistanceToNow(new Date(snapshot.created_at), {
            addSuffix: true,
          });

          return (
            <Box
              key={snapshot.version}
              p={4}
              borderRadius="8px"
              border="2px solid"
              borderColor={isCurrentVersion ? '#864CBD' : '#e2e8f0'}
              bg={isCurrentVersion ? 'rgba(134, 76, 189, 0.05)' : 'white'}
              position="relative"
              transition="all 0.2s"
              _hover={{
                borderColor: isCurrentVersion ? '#864CBD' : '#cbd5e0',
                boxShadow: 'sm',
              }}
            >
              {/* Version Badge */}
              <HStack justify="space-between" mb={2}>
                <HStack gap={2}>
                  <Badge
                    colorScheme={isCurrentVersion ? 'purple' : 'gray'}
                    fontSize="xs"
                    fontWeight={600}
                  >
                    Version {snapshot.version}
                  </Badge>
                  {index === 0 && (
                    <Badge colorScheme="green" fontSize="xs">
                      Latest
                    </Badge>
                  )}
                  {isCurrentVersion && (
                    <Badge colorScheme="blue" fontSize="xs">
                      Current
                    </Badge>
                  )}
                </HStack>
                <IconButton
                  aria-label="Expand version details"
                  size="xs"
                  variant="ghost"
                  onClick={() => setExpandedVersion(isExpanded ? null : snapshot.version)}
                >
                  <Text fontSize="sm">{isExpanded ? '▼' : '▶'}</Text>
                </IconButton>
              </HStack>

              {/* Timestamp */}
              <Text fontSize="xs" color="gray.600" mb={2}>
                {formattedTime}
              </Text>

              {/* Change Description */}
              {snapshot.change_description && (
                <Text fontSize="sm" color="gray.700" mb={3} noOfLines={isExpanded ? undefined : 2}>
                  {snapshot.change_description}
                </Text>
              )}

              {/* Expanded Details */}
              {isExpanded && (
                <Box
                  mt={3}
                  pt={3}
                  borderTop="1px solid #e2e8f0"
                  fontSize="xs"
                  color="gray.600"
                >
                  <Text mb={1}>
                    <strong>Headline:</strong> {snapshot.content.headline || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Sections:</strong> {snapshot.content.sections?.length || 0}
                  </Text>
                </Box>
              )}

              {/* Restore Button */}
              {!isCurrentVersion && (
                <Button
                  size="sm"
                  colorScheme="purple"
                  variant="outline"
                  w="full"
                  mt={3}
                  onClick={() => onRestore(snapshot.version)}
                  isLoading={isRestoring}
                  leftIcon={<Text fontSize="sm">⏮️</Text>}
                >
                  Restore This Version
                </Button>
              )}

              {isCurrentVersion && (
                <Box
                  mt={3}
                  p={2}
                  bg="rgba(134, 76, 189, 0.1)"
                  borderRadius="6px"
                  textAlign="center"
                >
                  <Text fontSize="xs" color="purple.700" fontWeight={600}>
                    ✓ You are viewing this version
                  </Text>
                </Box>
              )}
            </Box>
          );
        })}
      </VStack>

      {isRestoring && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255, 255, 255, 0.9)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="12px"
        >
          <VStack gap={2}>
            <Spinner size="lg" color="#864CBD" thickness="4px" />
            <Text color="gray.700" fontWeight={600}>
              Restoring version...
            </Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
