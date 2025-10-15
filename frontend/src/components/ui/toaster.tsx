/**
 * Toaster utility for Chakra UI v3
 * Based on the Chakra UI v3 Toaster component pattern
 */

import { createToaster } from '@chakra-ui/react';

// Create toaster instance
export const toaster = createToaster({
  placement: 'bottom-right' as any, // Chakra UI v3 type workaround
  pauseOnPageIdle: true,
});

// Export Toaster component wrapper
export function Toaster() {
  return (toaster as any).Toaster; // Chakra UI v3 type workaround
}
