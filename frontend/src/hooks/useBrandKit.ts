import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { brandKitService } from '../services/brandKitService';
import type { BrandKitData } from '../services/brandKitService';
import { useAuthStore } from '../stores/authStore';

/**
 * TanStack Query hooks for Brand Kit operations
 */

/**
 * Hook to fetch all Brand Kits for the current user
 */
export const useBrandKits = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['brandKits'],
    queryFn: () => brandKitService.getAll(accessToken!),
    enabled: !!accessToken,
  });
};

/**
 * Hook to fetch a single Brand Kit by ID
 */
export const useBrandKit = (id: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['brandKit', id],
    queryFn: () => brandKitService.getById(id, accessToken!),
    enabled: !!accessToken && !!id,
  });
};

/**
 * Hook to create a new Brand Kit
 */
export const useCreateBrandKit = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BrandKitData) => brandKitService.create(data, accessToken!),
    onSuccess: () => {
      // Invalidate and refetch Brand Kits list
      queryClient.invalidateQueries({ queryKey: ['brandKits'] });
    },
  });
};

/**
 * Hook to update an existing Brand Kit
 */
export const useUpdateBrandKit = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BrandKitData> }) =>
      brandKitService.update(id, data, accessToken!),
    onSuccess: (_, variables) => {
      // Invalidate specific Brand Kit and list
      queryClient.invalidateQueries({ queryKey: ['brandKit', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['brandKits'] });
    },
  });
};

/**
 * Hook to delete a Brand Kit
 */
export const useDeleteBrandKit = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => brandKitService.delete(id, accessToken!),
    onSuccess: () => {
      // Invalidate Brand Kits list
      queryClient.invalidateQueries({ queryKey: ['brandKits'] });
    },
  });
};
