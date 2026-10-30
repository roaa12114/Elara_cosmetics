import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/lib/api-client";
import type { WishlistData } from "@shared/types";

export function useWishlist(params?: { page?: number; limit?: number }) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("elara_access_token")
      : null;
  return useQuery({
    queryKey: ["wishlist", params?.page ?? 1, params?.limit ?? 20],
    queryFn: () => api.get<WishlistData>("/wishlist", params),
    enabled: !!token,
    staleTime: 60_000,
  });
}
