/**
 * Refine Step (Step 2)
 * 
 * Wizard wrapper for OnePagerEditor component
 * Uses compact editing interface in wizard context
 */

import { Text } from '@chakra-ui/react';
import { OnePagerEditor } from '../../../components/onepager/OnePagerEditor';

interface RefineStepProps {
  onePagerId: string | null;
  onComplete: () => void;
}

export function RefineStep({ onePagerId, onComplete }: RefineStepProps) {
  // Guard: No one-pager ID provided
  if (!onePagerId) {
    return (
      <Text color="red.500" fontSize="sm">
        Error: No one-pager ID provided. Please start from Step 1.
      </Text>
    );
  }

  return (
    <OnePagerEditor 
      onePagerId={onePagerId}
      mode="wizard"
      onComplete={onComplete}
    />
  );
}
