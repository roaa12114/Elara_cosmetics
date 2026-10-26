import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';
import type { GetProductsParams, PaginatedProductsData } from '@shared/types';

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get<PaginatedProductsData>('/products', params as Record<string, unknown>),
  });
}
