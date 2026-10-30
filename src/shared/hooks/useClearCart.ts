import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/lib/api-client";
import type { CartData } from "@shared/types";

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete<CartData>("/cart"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
