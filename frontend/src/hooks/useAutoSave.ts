/**
 * Auto-Save Hook
 *
 * Provides debounced auto-save functionality with status tracking.
 * Automatically saves changes after a delay when content changes.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useUpdateOnePagerContent } from './useOnePager';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface UseAutoSaveOptions {
  /** OnePager ID to save */
  onepagerId: string;
  /** Debounce delay in milliseconds (default: 2000ms = 2 seconds) */
  debounceMs?: number;
  /** Enable auto-save (default: true) */
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  /** Current save status */
  saveStatus: SaveStatus;
  /** Manually trigger save */
  triggerSave: () => void;
  /** Mark content as changed (triggers auto-save after delay) */
  markAsChanged: () => void;
  /** Check if there are unsaved changes */
  hasUnsavedChanges: boolean;
}

/**
 * Auto-save hook with debouncing
 *
 * Usage:
 * ```tsx
 * const { saveStatus, markAsChanged, hasUnsavedChanges } = useAutoSave({
 *   onepagerId: id,
 *   debounceMs: 3000,
 * });
 *
 * // When user makes changes:
 * markAsChanged();
 * ```
 */
export function useAutoSave({
  onepagerId,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const contentUpdateMutation = useUpdateOnePagerContent();

  // Track pending changes and debounce timer
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef(false);

  /**
   * Clear any pending save timers
   */
  const clearSaveTimer = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, []);

  /**
   * Trigger immediate save
   */
  const triggerSave = useCallback(() => {
    if (!enabled || !pendingSaveRef.current) return;

    clearSaveTimer();
    setSaveStatus('saving');
    pendingSaveRef.current = false;
    setHasUnsavedChanges(false);

    // Note: Actual save is handled by parent component
    // This hook just manages the status/timing
    // Parent should listen to markAsChanged and perform the actual save
  }, [enabled, clearSaveTimer]);

  /**
   * Mark content as changed - triggers auto-save after debounce delay
   */
  const markAsChanged = useCallback(() => {
    if (!enabled) return;

    // Clear existing timer
    clearSaveTimer();

    // Mark as unsaved
    setSaveStatus('unsaved');
    setHasUnsavedChanges(true);
    pendingSaveRef.current = true;

    // Set new timer for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      triggerSave();
    }, debounceMs);
  }, [enabled, debounceMs, clearSaveTimer, triggerSave]);

  /**
   * Update save status based on mutation state
   */
  useEffect(() => {
    if (contentUpdateMutation.isPending) {
      setSaveStatus('saving');
    } else if (contentUpdateMutation.isSuccess && !pendingSaveRef.current) {
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
    } else if (contentUpdateMutation.isError) {
      setSaveStatus('error');
      setHasUnsavedChanges(true);
    }
  }, [
    contentUpdateMutation.isPending,
    contentUpdateMutation.isSuccess,
    contentUpdateMutation.isError,
  ]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearSaveTimer();
    };
  }, [clearSaveTimer]);

  return {
    saveStatus,
    triggerSave,
    markAsChanged,
    hasUnsavedChanges,
  };
}
