import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';

export interface AdminBanner {
  _id: string;
  title: string;
  image: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedAdminBannersData {
  banners: AdminBanner[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetAdminBannersParams {
  page?: number;
  limit?: number;
}

export function useAdminBanners(params: GetAdminBannersParams = {}) {
  return useQuery({
    queryKey: ['admin-banners', params],
    queryFn: () =>
      api.get<PaginatedAdminBannersData>('/admin/banners', params as Record<string, unknown>),
    staleTime: 30_000,
  });
}