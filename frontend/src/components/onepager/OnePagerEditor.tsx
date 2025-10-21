/**
 * OnePager Editor Component
 * 
 * Reusable compact editing interface for one-pagers
 * Works in both wizard context and standalone page
 * 
 * Features:
 * - AI Refinement with feedback
 * - Drag & drop section reordering
 * - Section edit/delete
 * - Brand Kit linking
 * - Wireframe/Styled view modes
 * - Auto-save with status indicator
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
  Tabs,
  NativeSelectRoot,
  NativeSelectField,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useOnePager, useIterateOnePager, useUpdateOnePager, useUpdateOnePagerContent, useSuggestLayoutParams, useApplyLayoutParams } from '../../hooks/useOnePager';
import { useBrandKits } from '../../hooks/useBrandKit';
import { DraggableSectionList } from './DraggableSectionList';
import { SaveStatusIndicator } from '../common/SaveStatusIndicator';
import { OnePagerNavigation } from './OnePagerNavigation';
import { DesignControlPanel } from './DesignControlPanel';
import { LayoutParametersInfoPanel } from './LayoutParametersInfoPanel';
import { WireframeMinimalist } from './wireframe/WireframeMinimalist';
import { WireframeBold } from './wireframe/WireframeBold';
import { WireframeBusiness } from './wireframe/WireframeBusiness';
import { WireframeProduct } from './wireframe/WireframeProduct';
import { toaster } from '../ui/toaster';
import type { SaveStatus } from '../../hooks/useAutoSave';
import type { LayoutParams, LayoutSuggestionResponse, PDFTemplate } from '../../types/onepager';
import { applyLayoutParamsAsStyles } from '../../utils/layoutParamsToCSS';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';
import '../../styles/wireframe-mode.css';

type ViewMode = 'edit' | 'wireframe' | 'styled';

interface OnePagerEditorProps {
  /** ID of the one-pager to edit */
  onePagerId: string;

  /** Context mode: 'wizard' for wizard step, 'standalone' for detail page */
  mode?: 'wizard' | 'standalone';

  /** Optional callback when editing completes (wizard only) */
  onComplete?: () => void;

  /** Optional callback for back button (standalone only) */
  onBack?: () => void;

  /** Optional callback for export button (standalone only) */
  onExport?: () => void;

  /** Hide design controls tab (used when design controls are in sidebar) */
  hideDesignControls?: boolean;
}

export function OnePagerEditor({
  onePagerId,
  mode = 'standalone',
  onComplete: _onComplete,
  onBack,
  onExport,
  hideDesignControls = false
}: OnePagerEditorProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [lastSavedAt, setLastSavedAt] = useState<Date>(new Date());
  const [feedback, setFeedback] = useState('');
  const [suggestedLayout, setSuggestedLayout] = useState<LayoutSuggestionResponse | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const { data: onepager, isLoading, error, refetch } = useOnePager(onePagerId);
  const { data: brandKits } = useBrandKits();
  const iterateMutation = useIterateOnePager();
  const updateMutation = useUpdateOnePager();
  const contentUpdateMutation = useUpdateOnePagerContent();
  const suggestLayoutMutation = useSuggestLayoutParams();
  const applyLayoutMutation = useApplyLayoutParams();

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

  // Load HTML preview when in Styled mode
  useEffect(() => {
    const loadHtmlPreview = async () => {
      if (viewMode !== 'styled' || !onepager || !accessToken) {
        return;
      }

      setIsLoadingPreview(true);
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const template = onepager.pdf_template || 'minimalist';

        const response = await axios.get(
          `${baseURL}/api/v1/onepagers/${onePagerId}/preview/html?template=${template}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        setPreviewHtml(response.data);
      } catch (error) {
        console.error('Failed to load HTML preview:', error);
        toaster.create({
          title: 'Preview Failed',
          description: 'Could not load PDF preview. Please try again.',
          type: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoadingPreview(false);
      }
    };

    loadHtmlPreview();
  }, [viewMode, onePagerId, onepager?.pdf_template, onepager?.updated_at, accessToken]);

  // Log when onepager data changes (for debugging)
  useEffect(() => {
    if (onepager) {
      console.log('📊 OnePager data updated:', {
        id: onepager.id,
        title: onepager.title,
        sections: onepager.content?.sections?.length || 0,
        updated_at: onepager.updated_at
      });
    }
  }, [onepager]);

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
        {mode === 'standalone' && (
          <Button
            colorScheme="purple"
            onClick={() => navigate('/onepagers')}
            mt={4}
          >
            ← Back to One-Pagers
          </Button>
        )}
      </VStack>
    );
  }

  const handleIterate = async () => {
    if (!feedback.trim() || !onePagerId) return;

    console.log('🔄 Starting AI refinement...', { onePagerId, feedback });

    try {
      const result = await iterateMutation.mutateAsync({
        id: onePagerId,
        data: {
          feedback,
          iteration_type: 'content',
        },
      });
      
      console.log('✅ AI refinement successful!', result);
      
      // Force immediate refetch of the onepager data
      console.log('🔄 Forcing data refetch...');
      await queryClient.invalidateQueries({ queryKey: ['onepager', onePagerId] });
      const refetchResult = await refetch();
      console.log('✅ Data refetched successfully!', {
        data: refetchResult.data,
        sections: refetchResult.data?.content?.sections?.length,
        headline: refetchResult.data?.content?.headline
      });
      
      setFeedback('');

      toaster.create({
        title: 'AI Refinement Complete!',
        description: 'Your one-pager has been updated.',
        type: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('❌ Iteration failed:', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      const errorMessage = error?.response?.data?.detail || error?.message || 'Could not refine the one-pager. Please try again.';
      
      toaster.create({
        title: 'Refinement Failed',
        description: errorMessage,
        type: 'error',
        duration: 5000,
      });
    }
  };

  const handleSectionReorder = (newSections: any[]) => {
    contentUpdateMutation.mutate({
      id: onePagerId,
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
      id: onePagerId,
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
      id: onePagerId,
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
          id: onePagerId,
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

  const handleRequestLayoutSuggestion = async () => {
    try {
      const suggestion = await suggestLayoutMutation.mutateAsync({
        id: onePagerId,
      });

      setSuggestedLayout(suggestion);

      toaster.create({
        title: 'AI Suggestion Ready!',
        description: 'Review the suggested layout parameters below.',
        type: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Failed to get layout suggestion:', error);
      toaster.create({
        title: 'Suggestion Failed',
        description: error?.response?.data?.detail || 'Could not generate layout suggestions. Please try again.',
        type: 'error',
        duration: 5000,
      });
    }
  };

  const handleApplyLayoutChanges = async (layoutParams: LayoutParams) => {
    try {
      await applyLayoutMutation.mutateAsync({
        id: onePagerId,
        layoutParams,
      });

      // Clear suggestion after applying
      setSuggestedLayout(null);

      toaster.create({
        title: 'Layout Updated!',
        description: 'Design parameters have been applied.',
        type: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Failed to apply layout changes:', error);
      toaster.create({
        title: 'Apply Failed',
        description: error?.response?.data?.detail || 'Could not apply layout changes. Please try again.',
        type: 'error',
        duration: 5000,
      });
    }
  };

  const handleTemplateChange = async (template: PDFTemplate) => {
    try {
      await updateMutation.mutateAsync({
        id: onePagerId,
        data: { pdf_template: template },
      });

      toaster.create({
        title: 'Template Updated!',
        description: `Switched to ${template} template`,
        type: 'success',
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Failed to update template:', error);
      toaster.create({
        title: 'Template Update Failed',
        description: error?.response?.data?.detail || 'Could not update template. Please try again.',
        type: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box w="100%" minH={mode === 'wizard' ? 'calc(100vh - 200px)' : 'auto'}>
      {/* Navigation Bar - Only in standalone mode */}
      {mode === 'standalone' && onBack && onExport && (
        <OnePagerNavigation
          title={onepager.title}
          sectionsCount={onepager.content.sections.length}
          saveStatus={saveStatus}
          lastSavedAt={lastSavedAt}
          viewMode={viewMode}
          template={onepager.pdf_template || 'minimalist'}
          onViewModeChange={setViewMode}
          onTemplateChange={handleTemplateChange}
          onBack={onBack}
          onExport={onExport}
          brandKitLinked={!!onepager.brand_kit_id}
          onLinkBrandKit={handleLinkBrandKit}
        />
      )}

      {/* Compact Top Bar - Only in wizard mode */}
      {mode === 'wizard' && (
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

            {/* Template Selector - Show in both modes */}
            <NativeSelectRoot size="xs" width="140px">
              <NativeSelectField
                value={onepager.pdf_template || 'minimalist'}
                onChange={(e) => handleTemplateChange(e.target.value as PDFTemplate)}
                fontSize="xs"
              >
                <option value="minimalist">Minimalist</option>
                <option value="bold">Bold</option>
                <option value="business">Business</option>
                <option value="product">Product</option>
              </NativeSelectField>
            </NativeSelectRoot>

            <ButtonGroup size="xs" attached variant="outline">
              <Button
                onClick={() => setViewMode('edit')}
                bg={viewMode === 'edit' ? 'blue.50' : 'white'}
                borderColor={viewMode === 'edit' ? 'blue.400' : 'gray.200'}
                color={viewMode === 'edit' ? 'blue.700' : 'gray.700'}
                fontWeight={viewMode === 'edit' ? 600 : 400}
                fontSize="xs"
                px={2}
              >
                Edit
              </Button>
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
      )}

      {/* Content Container - wider in standalone mode */}
      <Container
        maxW={mode === 'standalone' ? '1400px' : '100%'}
        px={mode === 'standalone' ? { base: 4, md: 8 } : 0}
        py={mode === 'standalone' ? 6 : 0}
      >
        {/* Refinement & Design Panel */}
        <Box
          bg="white"
          borderRadius="8px"
          boxShadow="sm"
          border="1px solid #e2e8f0"
          mb={3}
        >
        {hideDesignControls ? (
          // Show only Content Refinement without tabs
          <Box p={3}>
            <VStack gap={2} align="stretch">
              <HStack justify="space-between" align="center">
                <Text fontSize="sm" fontWeight={600} color="#2d3748">
                  ✨ Refine with AI
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {feedback.length}/1000
                </Text>
              </HStack>

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
                    cursor: 'not-allowed',
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
        ) : (
          // Show tabs with both Content Refinement and Design Controls
          <Tabs.Root defaultValue="content" variant="enclosed">
            <Tabs.List borderBottom="1px solid" borderColor="gray.200">
              <Tabs.Trigger value="content" px={4} py={2} fontSize="sm">
                ✨ Content Refinement
              </Tabs.Trigger>
              <Tabs.Trigger value="design" px={4} py={2} fontSize="sm">
                🎨 Design Controls
              </Tabs.Trigger>
            </Tabs.List>

            <Box p={3}>
              {/* Content Refinement Tab */}
              <Tabs.Content value="content">
                <VStack gap={2} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Text fontSize="sm" fontWeight={600} color="#2d3748">
                      Refine with AI
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {feedback.length}/1000
                    </Text>
                  </HStack>

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
                        cursor: 'not-allowed',
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
              </Tabs.Content>

              {/* Design Controls Tab */}
              <Tabs.Content value="design">
                <DesignControlPanel
                  currentLayoutParams={onepager.layout_params}
                  designRationale={onepager.design_rationale}
                  onRequestSuggestion={handleRequestLayoutSuggestion}
                  isSuggestionLoading={suggestLayoutMutation.isPending}
                  suggestedLayoutParams={suggestedLayout?.suggested_layout_params}
                  suggestedRationale={suggestedLayout?.design_rationale}
                  onApplyChanges={handleApplyLayoutChanges}
                  isApplying={applyLayoutMutation.isPending}
                />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        )}
      </Box>

      {/* Compact Canvas Content */}
      <VStack gap={3} align="stretch">
        {/* Compact View Mode Badge */}
        <Box textAlign="center">
          <Badge
            className={
              viewMode === 'edit' ? 'edit-badge' :
              viewMode === 'wireframe' ? 'wireframe-badge' :
              'styled-badge'
            }
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight={600}
            colorPalette={
              viewMode === 'edit' ? 'blue' :
              viewMode === 'wireframe' ? 'gray' :
              'purple'
            }
          >
            {viewMode === 'edit' ? 'EDIT' : viewMode === 'wireframe' ? 'WIREFRAME' : 'STYLED'}
          </Badge>
        </Box>

        {/* Layout Parameters Info - Show in wireframe mode */}
        {viewMode === 'wireframe' && onepager.layout_params && (
          <Box textAlign="center">
            <LayoutParametersInfoPanel
              layoutParams={onepager.layout_params}
              compact={true}
            />
          </Box>
        )}

        {/* Canvas Content with Mode Class */}
        {viewMode === 'edit' ? (
          <Box>
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
                key={`sections-${onepager.id}-${onepager.updated_at}`}
                sections={onepager.content.sections}
                onReorder={handleSectionReorder}
                onEdit={handleSectionEdit}
                onDelete={handleSectionDelete}
              />
            </Box>
          </Box>
        ) : viewMode === 'wireframe' ? (
          <Box style={applyLayoutParamsAsStyles(onepager.layout_params)}>
            {/* Render template-specific wireframe component */}
            {onepager.pdf_template === 'minimalist' && <WireframeMinimalist onepager={onepager} />}
            {onepager.pdf_template === 'bold' && <WireframeBold onepager={onepager} />}
            {onepager.pdf_template === 'business' && <WireframeBusiness onepager={onepager} />}
            {onepager.pdf_template === 'product' && <WireframeProduct onepager={onepager} />}
            {!onepager.pdf_template && <WireframeMinimalist onepager={onepager} />}
          </Box>
        ) : (
          <Box className="styled-mode" position="relative">
            {isLoadingPreview ? (
              <Center py={20}>
                <VStack gap={3}>
                  <Spinner size="lg" color="purple.500" />
                  <Text fontSize="sm" color="gray.600">
                    Loading PDF preview...
                  </Text>
                </VStack>
              </Center>
            ) : previewHtml ? (
              <Box
                borderRadius="8px"
                boxShadow="lg"
                border="1px solid #e2e8f0"
                overflow="auto"
                bg="white"
                maxH="calc(100vh - 300px)"
              >
                <iframe
                  srcDoc={previewHtml}
                  style={{
                    width: '100%',
                    height: '2000px',
                    border: 'none',
                    display: 'block',
                  }}
                  title="PDF Preview"
                />
              </Box>
            ) : (
              <Center py={20}>
                <VStack gap={3}>
                  <Text fontSize="md" fontWeight={600} color="gray.700">
                    Unable to load preview
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Please try switching to Wireframe mode
                  </Text>
                </VStack>
              </Center>
            )}
          </Box>
        )}
      </VStack>
      </Container>
    </Box>
  );
}
