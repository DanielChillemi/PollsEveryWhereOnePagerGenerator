/**
 * Save Status Indicator
 *
 * Displays the current save status with appropriate icons and colors.
 * Shows: Saved ✓, Saving..., Unsaved changes, or Error
 */

import { HStack, Text, Spinner } from '@chakra-ui/react';
import type { SaveStatus } from '../../hooks/useAutoSave';

interface Props {
  status: SaveStatus;
  lastSavedAt?: Date;
}

export function SaveStatusIndicator({ status, lastSavedAt }: Props) {
  const getStatusDisplay = () => {
    switch (status) {
      case 'saved':
        return {
          icon: '✓',
          text: 'Saved',
          color: '#059669', // green.600
          showSpinner: false,
        };
      case 'saving':
        return {
          icon: null,
          text: 'Saving...',
          color: '#0ea5e9', // blue.500
          showSpinner: true,
        };
      case 'unsaved':
        return {
          icon: '●',
          text: 'Unsaved changes',
          color: '#f59e0b', // amber.500
          showSpinner: false,
        };
      case 'error':
        return {
          icon: '⚠',
          text: 'Save failed',
          color: '#dc2626', // red.600
          showSpinner: false,
        };
      default:
        return {
          icon: '',
          text: '',
          color: '#6b7280', // gray.500
          showSpinner: false,
        };
    }
  };

  const { icon, text, color, showSpinner } = getStatusDisplay();

  const formatLastSaved = () => {
    if (!lastSavedAt || status !== 'saved') return '';

    const now = new Date();
    const diff = now.getTime() - lastSavedAt.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;

    return lastSavedAt.toLocaleTimeString();
  };

  return (
    <HStack gap={2} px={3} py={1.5} bg="white" borderRadius="full" border="1px solid #e2e8f0">
      {showSpinner && <Spinner size="xs" color={color} borderWidth="2px" />}
      {!showSpinner && icon && (
        <Text fontSize="sm" color={color} fontWeight={600}>
          {icon}
        </Text>
      )}
      <Text fontSize="sm" color={color} fontWeight={500}>
        {text}
      </Text>
      {lastSavedAt && status === 'saved' && (
        <Text fontSize="xs" color="gray.500">
          ({formatLastSaved()})
        </Text>
      )}
    </HStack>
  );
}
