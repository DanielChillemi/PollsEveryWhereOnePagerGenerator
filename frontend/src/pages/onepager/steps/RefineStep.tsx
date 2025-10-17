/**
 * Refine Step (Step 2)
 * 
 * Full Smart Canvas editing interface embedded in wizard
 * Mirrors OnePagerDetailPage functionality within wizard context
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  Textarea,
  Spinner,
  Badge,
  ButtonGroup,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useOnePager, useIterateOnePager, useUpdateOnePager, useUpdateOnePagerContent } from '../../../hooks/useOnePager';
import { useBrandKits } from '../../../hooks/useBrandKit';
import { DraggableSectionList } from '../../../components/onepager/DraggableSectionList';
import { SaveStatusIndicator } from '../../../components/common/SaveStatusIndicator';
import { toaster } from '../../../components/ui/toaster';
import type { SaveStatus } from '../../../hooks/useAutoSave';
import '../../../styles/wireframe-mode.css';

type ViewMode = 'wireframe' | 'styled';

interface RefineStepProps {
  onePagerId: string | null;
  onComplete: () => void;
}

export function RefineStep({ onePagerId, onComplete: _onComplete }: RefineStepProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('styled');
  const [lastSavedAt, setLastSavedAt] = useState<Date>(new Date());
  const [feedback, setFeedback] = useState('');

  const { data: onepager, isLoading, error } = useOnePager(onePagerId!);
  const { data: brandKits } = useBrandKits();
  const iterateMutation = useIterateOnePager();
  const updateMutation = useUpdateOnePager();
  const contentUpdateMutation = useUpdateOnePagerContent();

  // Calculate save status
  const saveStatus: SaveStatus = contentUpdateMutation.isPending
    ? 'saving'
    : contentUpdateMutation.isError
    ? 'error'
    : 'saved';

  // Update last saved timestamp
  useEffect(() => {
    if (contentUpdateMutation.isSuccess) {
      setLastSavedAt(new Date());
    }
  }, [contentUpdateMutation.isSuccess]);

  // Loading State
  if (isLoading || !onepager) {
    return (
      <VStack align="center" py={12} gap={4}>
        <Spinner size="xl" color="#864CBD" />
        <Text fontSize="16px" color="gray.600">
          Loading your AI-generated one-pager...
        </Text>
      </VStack>
    );
  }

  // Error State
  if (error) {
    return (
      <VStack align="center" py={12} gap={4}>
        <Text fontSize="48px">❌</Text>
        <Heading size="lg" color="#2d3748">
          Failed to Load
        </Heading>
        <Text color="gray.600">Could not load your one-pager.</Text>
      </VStack>
    );
  }

  const handleIterate = async () => {
    if (!feedback.trim() || !onePagerId) return;

    try {
      await iterateMutation.mutateAsync({
        id: onePagerId,
        data: {
          feedback,
          iteration_type: 'content',
        },
      });
      setFeedback('');

      toaster.create({
        title: 'AI Refinement Complete!',
        description: 'Your one-pager has been updated.',
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Iteration failed:', error);
      toaster.create({
        title: 'Refinement Failed',
        description: 'Could not refine the one-pager. Please try again.',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const handleSectionReorder = (newSections: any[]) => {
    contentUpdateMutation.mutate({
      id: onePagerId!,
      data: {
        sections: newSections,
      },
    });
  };

  const handleSectionEdit = (sectionId: string, newContent: any) => {
    if (!onepager) return;

    const updatedSections = onepager.content.sections.map((section) =>
      section.id === sectionId
        ? { ...section, content: newContent }
        : section
    );

    contentUpdateMutation.mutate({
      id: onePagerId!,
      data: {
        sections: updatedSections,
      },
    });
  };

  const handleSectionDelete = (sectionId: string) => {
    if (!onepager) return;

    const updatedSections = onepager.content.sections.filter(
      (section) => section.id !== sectionId
    );

    contentUpdateMutation.mutate({
      id: onePagerId!,
      data: {
        sections: updatedSections,
      },
    });

    toaster.create({
      title: 'Section Deleted',
      description: 'The section has been removed.',
      type: 'success',
      duration: 2000,
    });
  };

  const handleLinkBrandKit = async () => {
    if (brandKits && Array.isArray(brandKits) && brandKits.length > 0) {
      const brandKitId = brandKits[0].id;

      try {
        await updateMutation.mutateAsync({
          id: onePagerId!,
          data: { brand_kit_id: brandKitId },
        });

        toaster.create({
          title: 'Brand Kit Linked!',
          description: `Linked to ${brandKits[0].company_name}`,
          type: 'success',
          duration: 3000,
        });
      } catch (error) {
        console.error('Failed to link brand kit:', error);
        toaster.create({
          title: 'Link Failed',
          description: 'Could not link brand kit. Please try again.',
          type: 'error',
          duration: 3000,
        });
      }
    } else {
      toaster.create({
        title: 'No Brand Kit Found',
        description: 'Please create a brand kit first',
        type: 'warning',
        duration: 3000,
      });
      navigate('/brand-kit/create');
    }
  };

  return (
    <Box w="100%" minH="calc(100vh - 200px)">
      {/* Compact Top Bar */}
      <HStack 
        justify="space-between" 
        mb={2} 
        py={2} 
        px={3} 
        bg="white" 
        borderRadius="6px" 
        border="1px solid #e2e8f0"
        flexWrap="wrap"
        gap={2}
      >
        {/* Left: Status Info */}
        <HStack gap={3} fontSize="xs">
          {onepager.brand_kit_id ? (
            <Text color="gray.700">
              🎨 <Text as="span" fontWeight={600}>Brand Kit</Text>
            </Text>
          ) : (
            <Button
              size="xs"
              variant="outline"
              colorScheme="purple"
              onClick={handleLinkBrandKit}
              fontSize="xs"
            >
              🎨 Link Brand Kit
            </Button>
          )}
          
          <Text color="gray.600">
            <Text as="span" fontWeight={600}>{onepager.content.sections.length}</Text> sections
          </Text>
        </HStack>

        {/* Right: Controls */}
        <HStack gap={2}>
          <SaveStatusIndicator status={saveStatus} lastSavedAt={lastSavedAt} />

          <ButtonGroup size="xs" attached variant="outline">
            <Button
              onClick={() => setViewMode('wireframe')}
              bg={viewMode === 'wireframe' ? 'gray.100' : 'white'}
              borderColor={viewMode === 'wireframe' ? 'gray.400' : 'gray.200'}
              fontWeight={viewMode === 'wireframe' ? 600 : 400}
              fontSize="xs"
              px={2}
            >
              Wireframe
            </Button>
            <Button
              onClick={() => setViewMode('styled')}
              bg={viewMode === 'styled' ? 'purple.50' : 'white'}
              borderColor={viewMode === 'styled' ? 'purple.400' : 'gray.200'}
              color={viewMode === 'styled' ? 'purple.700' : 'gray.700'}
              fontWeight={viewMode === 'styled' ? 600 : 400}
              fontSize="xs"
              px={2}
            >
              Styled
            </Button>
          </ButtonGroup>
        </HStack>
      </HStack>

      {/* Compact AI Refinement Panel */}
      <Box
        bg="white"
        p={3}
        borderRadius="8px"
        boxShadow="sm"
        border="1px solid #e2e8f0"
        mb={3}
      >
        <HStack justify="space-between" align="center" mb={2}>
          <Text fontSize="sm" fontWeight={600} color="#2d3748">
            ✨ Refine with AI
          </Text>
          <Text fontSize="xs" color="gray.500">
            {feedback.length}/1000
          </Text>
        </HStack>
        
        <VStack gap={2} align="stretch">
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g., Make headline more compelling, add pricing section..."
            minH="60px"
            maxH="80px"
            fontSize="xs"
            borderColor="#e2e8f0"
            resize="vertical"
            px={3}
            py={2}
            _focus={{
              borderColor: '#864CBD',
              boxShadow: '0 0 0 1px #864CBD',
            }}
          />
          
          <HStack justify="flex-end">
            <Button
              colorScheme="purple"
              size="xs"
              onClick={handleIterate}
              loading={iterateMutation.isPending}
              disabled={!feedback.trim() || feedback.length < 5}
              color="white"
              bg="purple.600"
              _hover={{ bg: 'purple.700' }}
              _disabled={{
                bg: 'gray.300',
                color: 'gray.500',
                cursor: 'not-allowed'
              }}
              fontSize="xs"
            >
              {iterateMutation.isPending ? 'Refining...' : '🔄 Refine'}
            </Button>
          </HStack>
          
          {iterateMutation.isPending && (
            <Text fontSize="xs" color="gray.600" textAlign="center">
              AI is processing... (5-10 seconds)
            </Text>
          )}
        </VStack>
      </Box>

      {/* Compact Canvas Content */}
      <VStack gap={3} align="stretch">
        {/* Compact View Mode Badge */}
        <Box textAlign="center">
          <Badge
            className={viewMode === 'wireframe' ? 'wireframe-badge' : 'styled-badge'}
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight={600}
          >
            {viewMode === 'wireframe' ? 'WIREFRAME' : 'STYLED'}
          </Badge>
        </Box>

        {/* Canvas Content with Mode Class */}
        <Box className={viewMode === 'wireframe' ? 'wireframe-mode' : 'styled-mode'}>
          {/* Compact Headline Section */}
          <Box
            className="section-container"
            bg="white"
            p={4}
            borderRadius="8px"
            boxShadow="sm"
            border="1px solid #e2e8f0"
            mb={3}
            position="relative"
          >
            <Text className="section-type-label" fontSize="xs">HEADLINE</Text>
            <VStack align="start" gap={2}>
              <Heading
                fontSize={{ base: '18px', md: '20px' }}
                fontWeight={700}
                color="#2d3748"
                lineHeight="1.3"
              >
                {onepager.content.headline}
              </Heading>
              {onepager.content.subheadline && (
                <Text
                  fontSize={{ base: '13px', md: '14px' }}
                  color="#4a5568"
                  lineHeight="1.4"
                >
                  {onepager.content.subheadline}
                </Text>
              )}
            </VStack>
          </Box>

          {/* Compact Sections Header */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight={600} color="#2d3748">
                Content Sections
              </Text>
              <Text fontSize="xs" color="gray.500">
                Drag to reorder • Hover to edit
              </Text>
            </HStack>
            <DraggableSectionList
              sections={onepager.content.sections}
              onReorder={handleSectionReorder}
              onEdit={handleSectionEdit}
              onDelete={handleSectionDelete}
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
