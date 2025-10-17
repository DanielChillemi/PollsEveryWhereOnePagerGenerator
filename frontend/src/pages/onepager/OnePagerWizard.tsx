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
import { useNavigate } from 'react-router-dom';
import { AddContentStep } from './steps/AddContentStep';
import { RefineStep } from './steps/RefineStep';
import { PDFExportStep } from './steps/PDFExportStep';
import { StepProgress } from '../../components/onepager/StepProgress';
import { Sidebar } from '../../components/layouts/Sidebar';
import { useCreateOnePager } from '../../hooks/useOnePager';
import type { OnePagerCreateData } from '../../types/onepager';

type WizardStep = 'add-content' | 'refine' | 'export';

interface WizardData extends OnePagerCreateData {
  currentStep: WizardStep;
}

const STORAGE_KEY = 'onepager_wizard_draft';

export function OnePagerWizard() {
  const navigate = useNavigate();
  const createMutation = useCreateOnePager();

  const [currentStep, setCurrentStep] = useState<WizardStep>('add-content');
  const [generatedOnePagerId, setGeneratedOnePagerId] = useState<string | null>(null);
  
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

  // Auto-save to localStorage
  useEffect(() => {
    const draft: WizardData = { ...formData, currentStep };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [formData, currentStep]);

  // Restore from localStorage on mount
  useEffect(() => {
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
  }, []);

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
      <Box ml="280px" mr="320px" flex={1} minH="100vh">
        <Container maxW="900px" px={{ base: 4, md: 8 }} py={8}>
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
                {currentStep === 'add-content' && '✨ Generate with AI →'}
                {currentStep === 'refine' && 'Continue to Export →'}
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
