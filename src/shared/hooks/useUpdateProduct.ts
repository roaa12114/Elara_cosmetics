import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';
import type { ProductData, UpdateProductRequest } from '@shared/types';

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, ...body }: UpdateProductRequest & { productId: string }) =>
      api.patch<ProductData>(`/products/${productId}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}