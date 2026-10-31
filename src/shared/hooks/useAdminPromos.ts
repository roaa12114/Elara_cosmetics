import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';

export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';

export interface AdminPromo {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startsAt: string;
  expiresAt: string;
  usageLimit?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedAdminPromosData {
  promos: AdminPromo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetAdminPromosParams {
  page?: number;
  limit?: number;
}

export function useAdminPromos(params: GetAdminPromosParams = {}) {
  return useQuery({
    queryKey: ['admin-promos', params],
    queryFn: () =>
      api.get<PaginatedAdminPromosData>('/admin/promos', params as Record<string, unknown>),
    staleTime: 30_000,
  });
}