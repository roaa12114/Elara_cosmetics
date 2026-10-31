import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';

export interface AdminUserAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'seller' | 'admin';
  isActive: boolean;
  isEmailConfirmed?: boolean;
  address?: AdminUserAddress;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedAdminUsersData {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  role?: 'customer' | 'seller' | 'admin';
  search?: string;
  isActive?: boolean;
}

export function useAdminUsers(params: GetAdminUsersParams = {}) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () =>
      api.get<PaginatedAdminUsersData>('/admin/users', params as Record<string, unknown>),
    staleTime: 30_000,
  });
}