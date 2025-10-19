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
    if (!currentLayoutParams) return false;
    return JSON.stringify(workingParams) !== JSON.stringify(currentLayoutParams);
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
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <HStack justify="space-between" align="center">
          <HStack>
            <Text fontSize="16px" fontWeight="600" color="#2d3748">
              Design Controls
            </Text>
            {hasUnsavedChanges && (
              <Badge colorScheme="orange" variant="subtle" size="sm">
                Unsaved
              </Badge>
            )}
          </HStack>

          {/* Action Buttons */}
          <HStack gap={2}>
            <Button
              size="sm"
              variant="outline"
              colorScheme="gray"
              onClick={handleReset}
              disabled={disabled || !hasUnsavedChanges || isApplying}
              opacity={!hasUnsavedChanges ? 0.5 : 1}
            >
              Reset
            </Button>
            <Button
              size="sm"
              colorScheme="purple"
              onClick={handleApply}
              disabled={disabled || !hasUnsavedChanges || isApplying}
              loading={isApplying}
              bg={hasUnsavedChanges ? 'purple.600' : 'gray.300'}
              color={hasUnsavedChanges ? 'white' : 'gray.500'}
              _hover={hasUnsavedChanges ? { bg: 'purple.700' } : {}}
              cursor={hasUnsavedChanges ? 'pointer' : 'not-allowed'}
            >
              Apply
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Tabs Content */}
      <Box flex="1" overflowY="auto">
        <Tabs.Root defaultValue="typography" variant="enclosed">
          <Tabs.List px={4} pt={3} borderBottom="1px solid" borderColor="gray.200">
            <Tabs.Trigger value="typography">
              Typography & Spacing
            </Tabs.Trigger>
            <Tabs.Trigger value="sections">
              Section Layouts
            </Tabs.Trigger>
          </Tabs.List>

          <Box p={4}>
            {/* Typography & Spacing Tab */}
            <Tabs.Content value="typography">
              <VStack align="stretch" gap={4}>
                {/* AI Suggestion Button */}
                <Button
                  w="full"
                  variant="outline"
                  colorScheme="purple"
                  onClick={onRequestSuggestion}
                  disabled={disabled || isSuggestionLoading}
                  loading={isSuggestionLoading}
                >
                  💡 Ask AI for Suggestion
                </Button>

                {/* Show suggested rationale */}
                {suggestedRationale && (
                  <VStack align="stretch" gap={2}>
                    <DesignRationaleDisplay
                      rationale={suggestedRationale}
                      isSuggestion={true}
                    />
                    <Button
                      size="sm"
                      colorScheme="purple"
                      variant="solid"
                      onClick={handleApplySuggestion}
                      disabled={disabled}
                    >
                      Apply Suggested Layout
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
