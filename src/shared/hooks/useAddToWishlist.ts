import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';

// TODO: confirm the request body + response shape with the user (Rule 6).
// Best guess based on the cart items endpoint pattern: { productId: string }.
export interface AddToWishlistRequest {
  productId: string;
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddToWishlistRequest) => api.post('/wishlist', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
