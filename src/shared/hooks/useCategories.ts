import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';
import type { PaginatedCategoriesData } from '@shared/types';

export function useCategories(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => api.get<PaginatedCategoriesData>('/categories', params as Record<string, unknown>),
  });
}
