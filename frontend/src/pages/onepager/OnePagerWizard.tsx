/**
 * OnePager Creation Wizard
 * 
 * Multi-step wizard interface for creating one-pagers:
 * Step 1: Add Content - Basic info and questionnaire
 * Step 2: Refine - Review and edit AI generation
 * Step 3: PDF Export - Export options
 * 
 * Features:
 * - Left sidebar with step navigation
 * - Auto-save to localStorage
 * - Product auto-population
 * - Progress indicator
 */

import { useState, useEffect } from 'react';
import { Box, Container, VStack, HStack, Text, Button } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AddContentStep } from './steps/AddContentStep';
import { RefineStep } from './steps/RefineStep';
import { PDFExportStep } from './steps/PDFExportStep';
import { StepProgress } from '../../components/onepager/StepProgress';
import { Sidebar } from '../../components/layouts/Sidebar';
import { VersionHistorySidebar } from '../../components/onepager/VersionHistorySidebar';
import { useCreateOnePager, useOnePager, useRestoreOnePagerVersion } from '../../hooks/useOnePager';
import { toaster } from '../../components/ui/toaster';
import type { OnePagerCreateData } from '../../types/onepager';

type WizardStep = 'add-content' | 'refine' | 'export';

interface WizardData extends OnePagerCreateData {
  currentStep: WizardStep;
}

const STORAGE_KEY = 'onepager_wizard_draft';

export function OnePagerWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const existingOnePagerId = searchParams.get('id');
  
  const createMutation = useCreateOnePager();
  const { data: existingOnePager } = useOnePager(existingOnePagerId || '');
  const restoreVersionMutation = useRestoreOnePagerVersion();

  const [currentStep, setCurrentStep] = useState<WizardStep>(existingOnePagerId ? 'refine' : 'add-content');
  const [generatedOnePagerId, setGeneratedOnePagerId] = useState<string | null>(existingOnePagerId);
  
  const [formData, setFormData] = useState<OnePagerCreateData>({
    title: '',
    problem: '',
    solution: '',
    features: [],
    benefits: [],
    integrations: [],
    social_proof: '',
    cta: { text: '', url: '' },
    brand_kit_id: '',
    target_audience: '',
    input_prompt: '',
    product_id: '',
  });

  // Populate form with existing one-pager data when editing
  useEffect(() => {
    if (existingOnePager && existingOnePagerId) {
      setFormData({
        title: existingOnePager.title || '',
        problem: existingOnePager.content?.problem || '',
        solution: existingOnePager.content?.solution || '',
        features: existingOnePager.content?.features || [],
        benefits: existingOnePager.content?.benefits || [],
        integrations: existingOnePager.content?.integrations || [],
        social_proof: existingOnePager.content?.social_proof || '',
        cta: existingOnePager.content?.cta || { text: '', url: '' },
        brand_kit_id: existingOnePager.brand_kit_id || '',
        target_audience: '', // Not stored, use empty default
        input_prompt: '', // Not stored, use empty default
        product_id: '', // Not stored, use empty default
      });
    }
  }, [existingOnePager, existingOnePagerId]);

  // Auto-save to localStorage (only for new one-pagers, not editing)
  useEffect(() => {
    if (!existingOnePagerId) {
      const draft: WizardData = { ...formData, currentStep };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [formData, currentStep, existingOnePagerId]);

  // Restore from localStorage on mount (only if not editing)
  useEffect(() => {
    if (!existingOnePagerId) {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        try {
          const draft: WizardData = JSON.parse(savedDraft);
          setFormData(draft);
          setCurrentStep(draft.currentStep || 'add-content');
        } catch (error) {
          console.error('Failed to restore draft:', error);
        }
      }
    }
  }, [existingOnePagerId]);

  // Clear draft when navigating away or completing
  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleStepChange = (step: WizardStep) => {
    // Validate current step before allowing navigation
    if (step === 'refine' && !validateAddContentStep()) {
      return;
    }
    setCurrentStep(step);
  };

  const validateAddContentStep = (): boolean => {
    // Basic validation for step 1
    if (!formData.title.trim()) return false;
    if (!formData.problem.trim() || formData.problem.length < 10) return false;
    if (!formData.solution.trim() || formData.solution.length < 10) return false;
    if (!formData.cta.text.trim() || !formData.cta.url.trim()) return false;
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 'add-content') {
      if (!validateAddContentStep()) {
        alert('Please complete all required fields before continuing.');
        return;
      }
      // Generate AI content
      try {
        const result = await createMutation.mutateAsync(formData);
        setGeneratedOnePagerId(result.id);
        setCurrentStep('refine');
      } catch (error: any) {
        alert(error.response?.data?.detail || 'Failed to generate one-pager. Please try again.');
      }
    } else if (currentStep === 'refine') {
      setCurrentStep('export');
    }
  };

  const handleBack = () => {
    if (currentStep === 'refine') {
      setCurrentStep('add-content');
    } else if (currentStep === 'export') {
      setCurrentStep('refine');
    }
  };

  const handleCancel = () => {
    const confirmCancel = confirm('Are you sure you want to cancel? Your progress will be saved as a draft.');
    if (confirmCancel) {
      navigate('/onepager/list');
    }
  };

  const handleRestoreVersion = async (version: number) => {
    const onePagerId = generatedOnePagerId || existingOnePagerId;
    if (!onePagerId) return;

    try {
      await restoreVersionMutation.mutateAsync({
        id: onePagerId,
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

  const renderStep = () => {
    switch (currentStep) {
      case 'add-content':
        return (
          <AddContentStep
            formData={formData}
            setFormData={setFormData}
            isLoading={createMutation.isPending}
          />
        );
      case 'refine':
        return (
          <RefineStep
            onePagerId={generatedOnePagerId}
            onComplete={() => setCurrentStep('export')}
          />
        );
      case 'export':
        return (
          <PDFExportStep
            onePagerId={generatedOnePagerId}
            onComplete={() => {
              clearDraft();
              navigate('/onepager/list');
            }}
          />
        );
      default:
        return null;
    }
  };

  const getStepNumber = (step: WizardStep): number => {
    switch (step) {
      case 'add-content': return 1;
      case 'refine': return 2;
      case 'export': return 3;
      default: return 1;
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex">
      {/* Classic Dashboard Sidebar - LEFT */}
      <Sidebar />

      {/* Main Content Area - CENTER */}
      <Box
        flex={1}
        minH="100vh"
        mr={{ base: 0, xl: "320px" }}
      >
        <Container maxW="1400px" px={{ base: 4, md: 8 }} py={8}>
          {/* Step Content */}
          <Box
            bg="white"
            borderRadius="16px"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.04)"
            border="1px solid"
            borderColor="gray.200"
            p={{ base: 6, md: 10 }}
          >
            {renderStep()}

            {/* Navigation Buttons */}
            <HStack justify="space-between" mt={10} pt={6} borderTop="1px solid" borderColor="gray.100">
              <Button
                onClick={handleBack}
                variant="outline"
                size="lg"
                disabled={currentStep === 'add-content'}
                colorScheme="gray"
              >
                ← Back
              </Button>

              <Button
                onClick={handleNext}
                size="lg"
                bg="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
                color="white"
                px={8}
                disabled={currentStep === 'export'}
                loading={createMutation.isPending}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                {currentStep === 'add-content' && (existingOnePagerId ? 'Next → Refine' : '✨ Generate with AI →')}
                {currentStep === 'refine' && 'Next → Export'}
                {currentStep === 'export' && 'Complete'}
              </Button>
            </HStack>
          </Box>
        </Container>
      </Box>

      {/* Step Progress Sidebar - RIGHT */}
      <Box
        w="320px"
        bg="white"
        borderLeft="1px solid"
        borderColor="gray.200"
        position="fixed"
        right={0}
        h="100vh"
        overflowY="auto"
        display={{ base: 'none', xl: 'block' }}
      >
        <VStack align="stretch" gap={0} py={6}>
          {/* Header */}
          <Box px={6} mb={6}>
            <Text fontSize="20px" fontWeight="700" color="#1568B8" mb={2}>
              Create One-Pager
            </Text>
            <Text fontSize="13px" color="gray.600" lineHeight="1.5">
              Define your product's problem, solution, and key details for AI-powered one-pager generation
            </Text>
          </Box>

          {/* Step Progress */}
          <StepProgress
            steps={[
              { id: 'add-content', label: 'Add Content', number: 1 },
              { id: 'refine', label: 'Refine', number: 2 },
              { id: 'pdf-export', label: 'PDF Export', number: 3 },
            ]}
            currentStep={getStepNumber(currentStep)}
            onStepClick={(stepNum: number) => {
              const steps: WizardStep[] = ['add-content', 'refine', 'export'];
              const targetStep = steps[stepNum - 1];
              if (stepNum <= getStepNumber(currentStep) || stepNum === getStepNumber(currentStep) + 1) {
                handleStepChange(targetStep);
              }
            }}
          />

          {/* Version History - Show only in Refine step */}
          {currentStep === 'refine' && existingOnePager && (
            <Box px={6} mt={6}>
              <VersionHistorySidebar
                versions={(existingOnePager.version_history || []) as any}
                currentVersion={existingOnePager.version_history?.length || 0}
                onRestore={handleRestoreVersion}
                isRestoring={restoreVersionMutation.isPending}
              />
            </Box>
          )}

          {/* Cancel Button */}
          <Box px={6} mt="auto" pt={6}>
            <Button
              onClick={handleCancel}
              variant="outline"
              w="100%"
              size="md"
              colorScheme="gray"
            >
              Cancel
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
