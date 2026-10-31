import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';
import type { AdminPromo, DiscountType } from '@shared/hooks/useAdminPromos';

export interface CreatePromoRequest {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startsAt: string;
  expiresAt: string;
  usageLimit?: number;
  isActive: boolean;
}

export interface CreatePromoData {
  promo: AdminPromo;
}

export function useCreatePromo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePromoRequest) =>
      api.post<CreatePromoData>('/admin/promos', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promos'] });
    },
  });
}