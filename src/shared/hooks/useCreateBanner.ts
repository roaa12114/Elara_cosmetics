import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';
import type { AdminBanner } from '@shared/hooks/useAdminBanners';

export interface CreateBannerRequest {
  title: string;
  image: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateBannerData {
  banner: AdminBanner;
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBannerRequest) =>
      api.post<CreateBannerData>('/admin/banners', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });
}