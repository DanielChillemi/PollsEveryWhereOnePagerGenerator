/**
 * TanStack Query Hooks for OnePager Operations
 *
 * Provides React hooks for data fetching, mutations, and cache management.
 * Follows the same pattern as useBrandKit.ts
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { onepagerService } from '../services/onepagerService';
import { useAuthStore } from '../stores/authStore';
import type {
  OnePagerCreateData,
  OnePagerIterateData,
  OnePagerUpdateData,
  PDFFormat,
} from '../types/onepager';

/**
 * Fetch all OnePagers (summary view for list page)
 * Supports pagination and status filtering
 */
export const useOnePagers = (skip = 0, limit = 20, status?: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['onepagers', { skip, limit, status }],
    queryFn: () => onepagerService.getAll(accessToken!, skip, limit, status),
    enabled: !!accessToken,
  });
};

/**
 * Fetch single OnePager by ID (full details)
 * Used in detail/edit pages
 */
export const useOnePager = (id: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['onepager', id],
    queryFn: () => onepagerService.getById(id, accessToken!),
    enabled: !!accessToken && !!id,
  });
};

/**
 * Create new OnePager with AI generation
 * Invalidates list cache on success
 */
export const useCreateOnePager = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OnePagerCreateData) =>
      onepagerService.create(data, accessToken!),
    onSuccess: () => {
      // Invalidate list to show new OnePager
      queryClient.invalidateQueries({ queryKey: ['onepagers'] });
    },
  });
};

/**
 * Update OnePager metadata (title, status, style overrides)
 * Invalidates both detail and list caches
 */
export const useUpdateOnePager = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OnePagerUpdateData }) =>
      onepagerService.update(id, data, accessToken!),
    onSuccess: (_, variables) => {
      // Invalidate specific OnePager detail
      queryClient.invalidateQueries({ queryKey: ['onepager', variables.id] });
      // Invalidate list (status or title may have changed)
      queryClient.invalidateQueries({ queryKey: ['onepagers'] });
    },
  });
};

/**
 * AI iterative refinement
 * Sends user feedback to backend for content generation
 * Invalidates detail cache to show updated content
 */
export const useIterateOnePager = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OnePagerIterateData }) =>
      onepagerService.iterate(id, data, accessToken!),
    onSuccess: (_, variables) => {
      // Invalidate specific OnePager to refetch updated content
      queryClient.invalidateQueries({ queryKey: ['onepager', variables.id] });
      // Invalidate list (updated_at timestamp changed)
      queryClient.invalidateQueries({ queryKey: ['onepagers'] });
    },
  });
};

/**
 * Delete OnePager
 * Invalidates list cache on success
 */
export const useDeleteOnePager = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => onepagerService.delete(id, accessToken!),
    onSuccess: () => {
      // Invalidate list to remove deleted item
      queryClient.invalidateQueries({ queryKey: ['onepagers'] });
    },
  });
};

/**
 * Directly update OnePager content without AI processing
 * Used for drag-and-drop, inline editing, and section deletion
 * Invalidates cache to show updated content immediately
 */
export const useUpdateOnePagerContent = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { sections?: any[]; headline?: string; subheadline?: string };
    }) => onepagerService.updateContent(id, data, accessToken!),
    onSuccess: (_, variables) => {
      // Invalidate specific OnePager to refetch updated content
      queryClient.invalidateQueries({ queryKey: ['onepager', variables.id] });
      // Invalidate list (updated_at timestamp changed)
      queryClient.invalidateQueries({ queryKey: ['onepagers'] });
    },
  });
};

/**
 * Export OnePager to PDF
 * Returns Blob for download
 * Does NOT invalidate cache (read-only operation)
 */
export const useExportPDF = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: ({ id, format, template }: { id: string; format: PDFFormat; template: string }) =>
      onepagerService.exportPDF(id, format, template, accessToken!),
  });
};
