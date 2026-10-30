import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/lib/api-client";
import type { CreateOrderRequest, OrderData } from "@shared/types";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOrderRequest) =>
      api.post<OrderData>("/orders", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
