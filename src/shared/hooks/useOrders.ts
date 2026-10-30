import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/lib/api-client";
import type { PaginatedOrdersData } from "@shared/types";

export function useOrders(params?: { page?: number; limit?: number }) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("elara_access_token")
      : null;
  return useQuery({
    queryKey: ["orders", params?.page ?? 1, params?.limit ?? 10],
    queryFn: () => api.get<PaginatedOrdersData>("/orders", params),
    enabled: !!token,
    staleTime: 60_000,
  });
}
