/**
 * OnePager Navigation Bar
 * Matches Brand Kit navigation design with top bar and gradient tab navigation
 */

import {
  Box,
  Container,
  HStack,
  VStack,
  Button,
  Heading,
  Text,
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react';
import { SaveStatusIndicator } from '../common/SaveStatusIndicator';
import type { SaveStatus } from '../../hooks/useAutoSave';
import type { PDFTemplate } from '../../types/onepager';

type ViewMode = 'edit' | 'wireframe' | 'styled';

interface OnePagerNavigationProps {
  title: string;
  sectionsCount: number;
  saveStatus: SaveStatus;
  lastSavedAt: Date;
  viewMode: ViewMode;
  template: PDFTemplate;
  onViewModeChange: (mode: ViewMode) => void;
  onTemplateChange: (template: PDFTemplate) => void;
  onBack: () => void;
  onExport: () => void;
  brandKitLinked: boolean;
  onLinkBrandKit?: () => void;
}

export function OnePagerNavigation({
  title,
  sectionsCount,
  saveStatus,
  lastSavedAt,
  viewMode,
  template,
  onViewModeChange,
  onTemplateChange,
  onBack,
  onExport,
  brandKitLinked,
  onLinkBrandKit,
}: OnePagerNavigationProps) {
  const viewModes: { id: ViewMode; label: string }[] = [
    { id: 'edit', label: 'Edit' },
    { id: 'wireframe', label: 'Wireframe' },
    { id: 'styled', label: 'Styled' },
  ];

  return (
    <Box>
      {/* Top Bar */}
      <Box
        position="sticky"
        top="0"
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        boxShadow="0 1px 3px rgba(0,0,0,0.05)"
        zIndex="sticky"
      >
        <Container maxW="1400px" px={{ base: 4, md: 8 }}>
          <HStack justify="space-between" py={4}>
            {/* Left: Title & Info */}
            <VStack align="start" gap={1}>
              <Heading
                as="h1"
                fontSize="24px"
                fontWeight="700"
                color="#007ACC"
                lineHeight="1.2"
              >
                {title || 'Untitled One-Pager'}
              </Heading>
              <HStack gap={3} fontSize="13px">
                <SaveStatusIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
                {brandKitLinked ? (
                  <Text color="gray.700">
                    🎨 <Text as="span" fontWeight={600}>Brand Kit Linked</Text>
                  </Text>
                ) : (
                  onLinkBrandKit && (
                    <Button
                      size="xs"
                      variant="outline"
                      colorScheme="purple"
                      onClick={onLinkBrandKit}
                      fontSize="xs"
                    >
                      🎨 Link Brand Kit
                    </Button>
                  )
                )}
                <Text color="gray.600">
                  <Text as="span" fontWeight={600}>{sectionsCount}</Text> sections
                </Text>
              </HStack>
            </VStack>

            {/* Right: Template Selector & Action Buttons */}
            <HStack gap={3}>
              <NativeSelectRoot size="sm" width="150px">
                <NativeSelectField
                  value={template}
                  onChange={(e) => onTemplateChange(e.target.value as PDFTemplate)}
                  fontSize="sm"
                >
                  <option value="minimalist">Minimalist</option>
                  <option value="bold">Bold</option>
                  <option value="business">Business</option>
                  <option value="product">Product</option>
                </NativeSelectField>
              </NativeSelectRoot>

              <Button
                onClick={onBack}
                variant="outline"
                size="md"
                borderColor="gray.300"
                color="gray.700"
                _hover={{
                  bg: 'gray.50',
                  borderColor: 'gray.400',
                }}
              >
                Back
              </Button>
              <Button
                onClick={onExport}
                size="md"
                bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
                color="white"
                px={6}
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'lg',
                }}
              >
                Export PDF
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Gradient Tab Navigation */}
      <Box
        bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
        position="relative"
      >
        <Container maxW="1400px" px={{ base: 4, md: 8 }}>
          <HStack
            gap={0}
            overflowX="auto"
            css={{
              '&::-webkit-scrollbar': {
                height: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '2px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {viewModes.map((mode) => (
              <Button
                key={mode.id}
                onClick={() => onViewModeChange(mode.id)}
                variant="ghost"
                borderRadius="0"
                color="white"
                fontWeight={viewMode === mode.id ? 700 : 400}
                px={8}
                py={4}
                fontSize="15px"
                bg={viewMode === mode.id ? 'whiteAlpha.200' : 'transparent'}
                borderBottom={viewMode === mode.id ? '3px solid white' : '3px solid transparent'}
                _hover={{
                  bg: 'whiteAlpha.100',
                }}
              >
                {mode.label}
              </Button>
            ))}
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
