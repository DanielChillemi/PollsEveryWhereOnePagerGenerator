/**
 * StepProgress Component
 * 
 * Displays wizard step progress in sidebar with:
 * - Step numbers and labels
 * - Active/completed/upcoming states
 * - Click navigation
 */

import { Box, VStack, HStack, Text } from '@chakra-ui/react';

interface Step {
  id: string;
  label: string;
  number: number;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

export function StepProgress({ steps, currentStep, onStepClick }: StepProgressProps) {
  return (
    <VStack align="stretch" gap={0} px={6}>
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        const isUpcoming = step.number > currentStep;
        const isClickable = isActive || isCompleted || step.number === currentStep + 1;

        return (
          <Box key={step.id}>
            <HStack
              gap={4}
              py={4}
              px={4}
              borderRadius="12px"
              bg={isActive ? 'rgba(134, 76, 189, 0.08)' : 'transparent'}
              cursor={isClickable && onStepClick ? 'pointer' : 'default'}
              opacity={isUpcoming ? 0.5 : 1}
              transition="all 0.2s"
              _hover={isClickable && onStepClick ? {
                bg: isActive ? 'rgba(134, 76, 189, 0.12)' : 'gray.50',
              } : {}}
              onClick={() => {
                if (isClickable && onStepClick) {
                  onStepClick(step.number);
                }
              }}
            >
              {/* Step Number Circle */}
              <Box
                w="32px"
                h="32px"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={isCompleted ? '#10B981' : isActive ? '#864CBD' : 'gray.200'}
                color="white"
                fontSize="14px"
                fontWeight="700"
                flexShrink={0}
                transition="all 0.2s"
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.3337 4L6.00033 11.3333L2.66699 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </Box>

              {/* Step Label */}
              <VStack align="start" gap={0} flex={1}>
                <Text
                  fontSize="14px"
                  fontWeight={isActive ? '600' : '500'}
                  color={isActive ? '#864CBD' : isCompleted ? 'gray.700' : 'gray.600'}
                  lineHeight="1.2"
                >
                  {step.label}
                </Text>
                {isActive && (
                  <Text fontSize="11px" color="gray.500" mt={0.5}>
                    Current step
                  </Text>
                )}
              </VStack>
            </HStack>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <Box
                h="24px"
                w="2px"
                bg={step.number < currentStep ? '#10B981' : 'gray.200'}
                ml="19px"
                transition="background 0.3s"
              />
            )}
          </Box>
        );
      })}
    </VStack>
  );
}
