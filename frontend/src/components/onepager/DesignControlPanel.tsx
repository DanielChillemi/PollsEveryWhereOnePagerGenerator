/**
 * DesignControlPanel Component
 *
 * Main control panel for editing layout parameters and requesting AI suggestions.
 * Provides tabbed interface for typography, spacing, and section layout controls.
 */

import { useState, useEffect, useMemo, memo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Badge,
  Tabs,
} from '@chakra-ui/react';
import { LayoutParamsEditor } from './LayoutParamsEditor';
import { SectionLayoutEditor } from './SectionLayoutEditor';
import { DesignRationaleDisplay } from './DesignRationaleDisplay';
import { getDefaultLayoutParams } from '../../types/onepager';
import type { LayoutParams } from '../../types/onepager';

interface DesignControlPanelProps {
  /** Current layout parameters from server */
  currentLayoutParams?: LayoutParams | null;

  /** Current design rationale from AI */
  designRationale?: string | null;

  /** Callback to request AI suggestion */
  onRequestSuggestion?: () => void;

  /** Whether AI suggestion is loading */
  isSuggestionLoading?: boolean;

  /** Suggested layout parameters from AI (not yet applied) */
  suggestedLayoutParams?: LayoutParams | null;

  /** Suggested design rationale from AI (not yet applied) */
  suggestedRationale?: string | null;

  /** Callback to apply current working parameters */
  onApplyChanges?: (layoutParams: LayoutParams) => void;

  /** Whether apply is in progress */
  isApplying?: boolean;

  /** Whether controls are disabled */
  disabled?: boolean;
}

/**
 * DesignControlPanel Component
 *
 * Provides comprehensive layout parameter editing:
 * - Tab 1: Typography & Spacing controls
 * - Tab 2: Section Layout controls
 * - Action buttons: Ask AI, Apply, Reset
 * - Unsaved changes indicator
 * - AI rationale display
 */
export const DesignControlPanel = memo(({
  currentLayoutParams,
  designRationale,
  onRequestSuggestion,
  isSuggestionLoading = false,
  suggestedLayoutParams,
  suggestedRationale,
  onApplyChanges,
  isApplying = false,
  disabled = false,
}: DesignControlPanelProps) => {
  // Working state (local edits before apply)
  const [workingParams, setWorkingParams] = useState<LayoutParams>(
    currentLayoutParams || getDefaultLayoutParams()
  );

  // Sync working params when current params change (e.g., after AI iteration)
  useEffect(() => {
    if (currentLayoutParams) {
      setWorkingParams(currentLayoutParams);
    }
  }, [currentLayoutParams]);

  // Apply suggested params to working state
  const handleApplySuggestion = () => {
    if (suggestedLayoutParams) {
      setWorkingParams(suggestedLayoutParams);
    }
  };

  // Reset to current server state
  const handleReset = () => {
    setWorkingParams(currentLayoutParams || getDefaultLayoutParams());
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    // If no current params, compare with default params
    const compareParams = currentLayoutParams || getDefaultLayoutParams();
    return JSON.stringify(workingParams) !== JSON.stringify(compareParams);
  }, [workingParams, currentLayoutParams]);

  // Handle apply button click
  const handleApply = () => {
    if (onApplyChanges && hasUnsavedChanges) {
      onApplyChanges(workingParams);
    }
  };

  return (
    <Box
      w="full"
      h="full"
      bg="white"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Header with Gradient */}
      <Box
        p={4}
        bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
        boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      >
        <HStack justify="space-between" align="center">
          <HStack>
            <Text fontSize="17px" fontWeight="700" color="white" letterSpacing="0.3px">
              🎨 Design Controls
            </Text>
            {hasUnsavedChanges && (
              <Badge colorScheme="orange" bg="orange.400" color="white" size="sm" px={2}>
                Unsaved
              </Badge>
            )}
          </HStack>

          {/* Action Buttons */}
          <HStack gap={2}>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={disabled || !hasUnsavedChanges || isApplying}
              opacity={!hasUnsavedChanges ? 0.6 : 1}
              bg="whiteAlpha.200"
              color="white"
              borderColor="whiteAlpha.400"
              _hover={hasUnsavedChanges ? { bg: 'whiteAlpha.300' } : {}}
              fontSize="13px"
              fontWeight="600"
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={disabled || !hasUnsavedChanges || isApplying}
              loading={isApplying}
              bg={hasUnsavedChanges ? 'white' : 'whiteAlpha.300'}
              color={hasUnsavedChanges ? 'purple.700' : 'whiteAlpha.700'}
              _hover={hasUnsavedChanges ? { bg: 'whiteAlpha.900' } : {}}
              cursor={hasUnsavedChanges ? 'pointer' : 'not-allowed'}
              fontSize="13px"
              fontWeight="700"
              boxShadow={hasUnsavedChanges ? 'md' : 'none'}
            >
              Apply
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Tabs Content */}
      <Box flex="1" overflowY="auto" bg="white">
        <Tabs.Root defaultValue="typography" variant="enclosed">
          <Tabs.List
            px={3}
            pt={3}
            pb={0}
            borderBottom="2px solid"
            borderColor="gray.200"
            gap={1}
            bg="gray.50"
          >
            <Tabs.Trigger
              value="typography"
              px={4}
              py={2}
              fontSize="13px"
              fontWeight="600"
              borderRadius="6px 6px 0 0"
              _selected={{
                bg: 'white',
                borderBottom: '2px solid white',
                color: 'purple.700',
              }}
            >
              Typography & Spacing
            </Tabs.Trigger>
            <Tabs.Trigger
              value="sections"
              px={4}
              py={2}
              fontSize="13px"
              fontWeight="600"
              borderRadius="6px 6px 0 0"
              _selected={{
                bg: 'white',
                borderBottom: '2px solid white',
                color: 'purple.700',
              }}
            >
              Section Layouts
            </Tabs.Trigger>
          </Tabs.List>

          <Box p={5}>
            {/* Typography & Spacing Tab */}
            <Tabs.Content value="typography">
              <VStack align="stretch" gap={4}>
                {/* AI Suggestion Button */}
                <Button
                  w="full"
                  onClick={onRequestSuggestion}
                  disabled={disabled || isSuggestionLoading}
                  loading={isSuggestionLoading}
                  bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
                  color="white"
                  fontWeight="700"
                  fontSize="14px"
                  py={6}
                  borderRadius="lg"
                  boxShadow="0 4px 12px rgba(134, 76, 189, 0.3)"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 16px rgba(134, 76, 189, 0.4)',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s"
                >
                  💡 Ask AI for Suggestion
                </Button>

                {/* Show suggested rationale */}
                {suggestedRationale && (
                  <VStack align="stretch" gap={3}>
                    <DesignRationaleDisplay
                      rationale={suggestedRationale}
                      isSuggestion={true}
                    />
                    <Button
                      size="md"
                      onClick={handleApplySuggestion}
                      disabled={disabled}
                      w="full"
                      bg="linear-gradient(135deg, #38A169 0%, #2F855A 100%)"
                      color="white"
                      fontWeight="700"
                      fontSize="15px"
                      py={6}
                      borderRadius="lg"
                      boxShadow="0 4px 12px rgba(56, 161, 105, 0.3)"
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 16px rgba(56, 161, 105, 0.4)',
                      }}
                      _active={{
                        transform: 'translateY(0)',
                      }}
                      transition="all 0.2s"
                    >
                      ✨ Apply Suggested Layout
                    </Button>
                  </VStack>
                )}

                {/* Show current rationale */}
                {designRationale && !suggestedRationale && (
                  <DesignRationaleDisplay
                    rationale={designRationale}
                    isSuggestion={false}
                  />
                )}

                {/* Typography & Spacing Controls */}
                <LayoutParamsEditor
                  typography={workingParams.typography}
                  spacing={workingParams.spacing}
                  onTypographyChange={(typography) =>
                    setWorkingParams({ ...workingParams, typography })
                  }
                  onSpacingChange={(spacing) =>
                    setWorkingParams({ ...workingParams, spacing })
                  }
                  disabled={disabled}
                />
              </VStack>
            </Tabs.Content>

            {/* Section Layouts Tab */}
            <Tabs.Content value="sections">
              <VStack align="stretch" gap={4}>
                <SectionLayoutEditor
                  sectionLayouts={workingParams.section_layouts}
                  onSectionLayoutChange={(sectionName, layout) =>
                    setWorkingParams({
                      ...workingParams,
                      section_layouts: {
                        ...workingParams.section_layouts,
                        [sectionName]: layout,
                      },
                    })
                  }
                  disabled={disabled}
                />
              </VStack>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </Box>
  );
});

DesignControlPanel.displayName = 'DesignControlPanel';
