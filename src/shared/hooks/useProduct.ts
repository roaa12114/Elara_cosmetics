import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';
import type { ProductData } from '@shared/types';

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get<ProductData>(`/products/${id}`),
    enabled: !!id,
  });
}