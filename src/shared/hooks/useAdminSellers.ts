import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';

export interface AdminSellerAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface AdminSeller {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'seller';
  isActive: boolean;
  isEmailConfirmed?: boolean;
  address?: AdminSellerAddress;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedAdminSellersData {
  sellers: AdminSeller[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetAdminSellersParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export function useAdminSellers(params: GetAdminSellersParams = {}) {
  return useQuery({
    queryKey: ['admin-sellers', params],
    queryFn: () =>
      api.get<PaginatedAdminSellersData>('/admin/sellers', params as Record<string, unknown>),
    staleTime: 30_000,
  });
}