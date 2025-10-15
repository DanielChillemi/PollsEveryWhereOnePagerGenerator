/**
 * OnePager Detail Page - Smart Canvas
 *
 * Main editing interface with:
 * - Left sidebar (Brand Kit info, AI iteration panel)
 * - Center canvas (draggable section list)
 * - Top bar (back button, export PDF)
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
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
import { useParams, useNavigate } from 'react-router-dom';
import { useOnePager, useIterateOnePager, useUpdateOnePager, useUpdateOnePagerContent, useRestoreOnePagerVersion } from '../hooks/useOnePager';
import { useBrandKits } from '../hooks/useBrandKit';
import { DraggableSectionList } from '../components/onepager/DraggableSectionList';
import { PDFExportModal } from '../components/onepager/PDFExportModal';
import { SaveStatusIndicator } from '../components/common/SaveStatusIndicator';
import { VersionHistorySidebar } from '../components/onepager/VersionHistorySidebar';
import { toaster } from '../components/ui/toaster';
import type { SaveStatus } from '../hooks/useAutoSave';
import '../styles/wireframe-mode.css';

type ViewMode = 'wireframe' | 'styled';

export function OnePagerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('styled');
  const [lastSavedAt, setLastSavedAt] = useState<Date>(new Date());

  const { data: onepager, isLoading, error } = useOnePager(id!);
  const { data: brandKits } = useBrandKits();
  const iterateMutation = useIterateOnePager();
  const updateMutation = useUpdateOnePager();
  const contentUpdateMutation = useUpdateOnePagerContent();
  const restoreVersionMutation = useRestoreOnePagerVersion();

  const [feedback, setFeedback] = useState('');

  // Calculate save status based on mutation state
  const saveStatus: SaveStatus = contentUpdateMutation.isPending
    ? 'saving'
    : contentUpdateMutation.isError
    ? 'error'
    : 'saved';

  // Update last saved timestamp when save completes
  useEffect(() => {
    if (contentUpdateMutation.isSuccess) {
      setLastSavedAt(new Date());
    }
  }, [contentUpdateMutation.isSuccess]);

  // Warn user when trying to close browser/tab during save
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (contentUpdateMutation.isPending) {
        e.preventDefault();
        e.returnValue = 'Your changes are still being saved. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [contentUpdateMutation.isPending]);

  const handleIterate = async () => {
    if (!feedback.trim() || !id) return;

    try {
      await iterateMutation.mutateAsync({
        id,
        data: {
          feedback,
          iteration_type: 'content',
        },
      });
      setFeedback('');

      // Show success notification
      toaster.create({
        title: 'AI Refinement Complete!',
        description: 'Your one-pager has been updated. The page will refresh to show changes.',
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
    // Update sections directly without AI processing
    contentUpdateMutation.mutate({
      id: id!,
      data: {
        sections: newSections,
      },
    });
    console.log('Sections reordered:', newSections);
  };

  const handleSectionEdit = (sectionId: string, newContent: any) => {
    if (!onepager) return;

    // Find and update the section
    const updatedSections = onepager.content.sections.map((section) =>
      section.id === sectionId
        ? { ...section, content: newContent }
        : section
    );

    // Send direct update to backend without AI processing
    contentUpdateMutation.mutate({
      id: id!,
      data: {
        sections: updatedSections,
      },
    });

    console.log('Section edited:', sectionId, newContent);
  };

  const handleSectionDelete = (sectionId: string) => {
    if (!onepager) return;

    // Remove section from array
    const updatedSections = onepager.content.sections.filter(
      (section) => section.id !== sectionId
    );

    // Send direct update to backend without AI processing
    contentUpdateMutation.mutate({
      id: id!,
      data: {
        sections: updatedSections,
      },
    });

    console.log('Section deleted:', sectionId);

    toaster.create({
      title: 'Section Deleted',
      description: 'The section has been removed.',
      type: 'success',
      duration: 2000,
    });
  };

  const handleLinkBrandKit = async () => {
    // Get the first available brand kit
    if (brandKits && Array.isArray(brandKits) && brandKits.length > 0) {
      const brandKitId = brandKits[0].id;

      try {
        await updateMutation.mutateAsync({
          id: id!,
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
      // Navigate to brand kit creation
      navigate('/brand-kit/create');
    }
  };

  const handleRestoreVersion = async (version: number) => {
    if (!id) return;

    try {
      await restoreVersionMutation.mutateAsync({
        id,
        version,
      });

      toaster.create({
        title: 'Version Restored!',
        description: `Successfully restored to version ${version}`,
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Restore failed:', error);
      toaster.create({
        title: 'Restore Failed',
        description: 'Could not restore to this version. Please try again.',
        type: 'error',
        duration: 3000,
      });
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <Box minH="100vh" bg="#F9FAFB" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="xl" color="#864CBD" borderWidth="4px" />
          <Text color="gray.600">Loading one-pager...</Text>
        </VStack>
      </Box>
    );
  }

  // Error State
  if (error || !onepager) {
    return (
      <Box minH="100vh" bg="#F9FAFB" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Text fontSize="48px">❌</Text>
          <Heading size="lg" color="#2d3748">
            OnePager Not Found
          </Heading>
          <Text color="gray.600">The requested one-pager could not be loaded.</Text>
          <Button onClick={() => navigate('/onepager/list')} colorScheme="purple">
            Back to List
          </Button>
        </VStack>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'wireframe':
        return 'gray';
      case 'draft':
        return 'blue';
      case 'published':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box minH="100vh" bg="#F9FAFB">
      {/* Top Bar */}
      <Box bg="white" borderBottom="1px solid #e2e8f0" py={4} px={4} position="sticky" top={0} zIndex={10}>
        <Container maxW="1600px">
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <HStack gap={4} flex="1" minW="250px">
              <Button
                onClick={() => navigate('/onepager/list')}
                variant="ghost"
              >
                <Text mr={1}>←</Text>
                Back
              </Button>
              <VStack align="start" gap={0} flex="1">
                <HStack gap={2}>
                  <Heading size="lg" lineClamp={1}>
                    {onepager.title}
                  </Heading>
                  <Badge colorScheme={getStatusColor(onepager.status)} textTransform="capitalize">
                    {onepager.status}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Updated {new Date(onepager.updated_at).toLocaleString()}
                </Text>
              </VStack>
            </HStack>

            <HStack gap={2}>
              {/* Save Status Indicator */}
              <SaveStatusIndicator status={saveStatus} lastSavedAt={lastSavedAt} />

              {/* View Mode Toggle */}
              <ButtonGroup size="md" attached variant="outline">
                <Button
                  onClick={() => setViewMode('wireframe')}
                  bg={viewMode === 'wireframe' ? 'gray.100' : 'white'}
                  borderColor={viewMode === 'wireframe' ? 'gray.400' : 'gray.200'}
                  fontWeight={viewMode === 'wireframe' ? 600 : 400}
                  _hover={{ bg: 'gray.50' }}
                >
                  🔲 Wireframe
                </Button>
                <Button
                  onClick={() => setViewMode('styled')}
                  bg={viewMode === 'styled' ? 'purple.50' : 'white'}
                  borderColor={viewMode === 'styled' ? 'purple.400' : 'gray.200'}
                  color={viewMode === 'styled' ? 'purple.700' : 'gray.700'}
                  fontWeight={viewMode === 'styled' ? 600 : 400}
                  _hover={{ bg: 'purple.50' }}
                >
                  🎨 Styled
                </Button>
              </ButtonGroup>

              <Button
                colorScheme="purple"
                variant="outline"
                onClick={() => navigate(`/onepager/list`)}
              >
                Save & Exit
              </Button>
              <Button
                colorScheme="purple"
                onClick={() => setIsExportOpen(true)}
              >
                <Text mr={1}>📄</Text>
                Export PDF
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Layout */}
      <Container maxW="1600px" px={{ base: 4, md: 8 }} py={8}>
        <HStack align="start" gap={8} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          {/* Left Sidebar */}
          <Box
            w={{ base: '100%', lg: '320px' }}
            flexShrink={0}
            position={{ base: 'static', lg: 'sticky' }}
            top="100px"
            alignSelf="start"
            maxH="calc(100vh - 120px)"
            overflowY="auto"
          >
            <VStack gap={6} align="stretch">
              {/* Brand Kit Info */}
              <Box
                bg="white"
                p={6}
                borderRadius="12px"
                boxShadow="sm"
                border="1px solid #e2e8f0"
              >
                <Heading size="sm" mb={4} color="#2d3748">
                  🎨 Brand Kit
                </Heading>
                {onepager.brand_kit_id ? (
                  <VStack align="start" gap={2}>
                    <Text fontSize="sm" color="gray.700" fontWeight={600}>
                      ✅ Brand Kit Applied
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      Your colors and fonts are active
                    </Text>
                  </VStack>
                ) : (
                  <VStack align="start" gap={2}>
                    <Text fontSize="sm" color="gray.600">
                      No brand kit linked
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="purple"
                      onClick={handleLinkBrandKit}
                    >
                      Link Brand Kit
                    </Button>
                  </VStack>
                )}
              </Box>

              {/* Generation Metadata */}
              <Box
                bg="white"
                p={6}
                borderRadius="12px"
                boxShadow="sm"
                border="1px solid #e2e8f0"
              >
                <Heading size="sm" mb={4} color="#2d3748">
                  🤖 AI Generation
                </Heading>
                <VStack align="stretch" gap={2} fontSize="sm">
                  <HStack justify="space-between">
                    <Text color="gray.600">Iterations:</Text>
                    <Text fontWeight={600}>{onepager.generation_metadata.iterations}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">Model:</Text>
                    <Text fontWeight={600} fontSize="xs">
                      {onepager.generation_metadata.ai_model}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">Sections:</Text>
                    <Text fontWeight={600}>{onepager.content.sections.length}</Text>
                  </HStack>
                </VStack>
              </Box>

              {/* AI Iteration Panel */}
              <Box
                bg="white"
                p={6}
                borderRadius="12px"
                boxShadow="sm"
                border="1px solid #e2e8f0"
              >
                <Heading size="sm" mb={4} color="#2d3748">
                  ✨ AI Refinement
                </Heading>
                <VStack gap={3} align="stretch">
                  <Text fontSize="sm" color="gray.600">
                    Describe changes you want AI to make:
                  </Text>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="e.g., Make headline more attention-grabbing, add pricing section, emphasize benefits..."
                    minH="80px"
                    maxH="120px"
                    fontSize="sm"
                    borderColor="#e2e8f0"
                    resize="vertical"
                    _focus={{
                      borderColor: '#864CBD',
                      boxShadow: '0 0 0 1px #864CBD',
                    }}
                  />
                  <Text fontSize="xs" color="gray.500">
                    {feedback.length}/1000 characters
                  </Text>
                  <Button
                    colorScheme="purple"
                    w="full"
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
                  >
                    <Text mr={1}>🔄</Text>
                    {iterateMutation.isPending ? 'Refining...' : 'Iterate with AI'}
                  </Button>
                  {iterateMutation.isPending && (
                    <Text fontSize="xs" color="gray.600" textAlign="center">
                      This may take 5-10 seconds...
                    </Text>
                  )}
                </VStack>
              </Box>

              {/* PDF Export Panel */}
              <Box
                bg="white"
                p={6}
                borderRadius="12px"
                boxShadow="sm"
                border="1px solid #e2e8f0"
              >
                <Heading size="sm" mb={4} color="#2d3748">
                  📄 Export PDF
                </Heading>
                <VStack gap={3} align="stretch">
                  <Text fontSize="sm" color="gray.600">
                    Download your one-pager as a professional PDF in your preferred format.
                  </Text>
                  <Button
                    colorScheme="purple"
                    w="full"
                    onClick={() => setIsExportOpen(true)}
                    size="lg"
                    color="white"
                    bg="purple.600"
                    _hover={{ bg: 'purple.700' }}
                  >
                    <Text mr={2}>📥</Text>
                    Export PDF
                  </Button>
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    Available formats: Letter, A4, Tabloid
                  </Text>
                </VStack>
              </Box>

              {/* Version History Panel */}
              <VersionHistorySidebar
                versions={(onepager.version_history || []) as any}
                currentVersion={onepager.version_history?.length || 0}
                onRestore={handleRestoreVersion}
                isRestoring={restoreVersionMutation.isPending}
              />
            </VStack>
          </Box>

          {/* Canvas Area */}
          <Box flex="1" minW="0">
            <VStack gap={6} align="stretch">
              {/* View Mode Indicator */}
              <Box textAlign="center">
                <Badge
                  className={viewMode === 'wireframe' ? 'wireframe-badge' : 'styled-badge'}
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight={700}
                >
                  {viewMode === 'wireframe' ? '🔲 WIREFRAME MODE' : '🎨 STYLED MODE'}
                </Badge>
              </Box>

              {/* Canvas Content with Mode Class */}
              <Box className={viewMode === 'wireframe' ? 'wireframe-mode' : 'styled-mode'}>
                {/* Headline Section */}
                <Box
                  className="section-container"
                  bg="white"
                  p={8}
                  borderRadius="16px"
                  boxShadow="sm"
                  border="1px solid #e2e8f0"
                  mb={4}
                  position="relative"
                >
                  <Text className="section-type-label">HEADLINE</Text>
                  <VStack align="start" gap={4}>
                    <Heading
                      fontSize={{ base: '32px', md: '42px' }}
                      fontWeight={700}
                      color="#2d3748"
                      lineHeight="1.2"
                    >
                      {onepager.content.headline}
                    </Heading>
                    {onepager.content.subheadline && (
                      <Text
                        fontSize={{ base: '18px', md: '22px' }}
                        color="#4a5568"
                        lineHeight="1.5"
                      >
                        {onepager.content.subheadline}
                      </Text>
                    )}
                  </VStack>
                </Box>

                {/* Sections */}
                <Box>
                  <HStack justify="space-between" mb={4}>
                    <Heading size="md" color="#2d3748">
                      Content Sections
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      Drag to reorder • Hover to edit/delete
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
        </HStack>
      </Container>

      {/* PDF Export Modal */}
      {onepager && (
        <PDFExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          onepagerId={onepager.id}
          title={onepager.title}
        />
      )}
    </Box>
  );
}

export default OnePagerDetailPage;
