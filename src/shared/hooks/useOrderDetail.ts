import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/lib/api-client";
import type { OrderData } from "@shared/types";

export function useOrderDetail(id?: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => api.get<OrderData>(`/orders/${id}`),
    enabled: !!id,
    staleTime: 60_000,
  });
}
