import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';
import type { CartData } from '@shared/types';

export function useCart() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('elara_access_token') : null;
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get<CartData>('/cart'),
    enabled: !!token,
    staleTime: 0,
  });
}