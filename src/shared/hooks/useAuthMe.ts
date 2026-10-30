import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/lib/api-client";
import type { MeData } from "@shared/types";

export function useAuthMe() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("elara_access_token")
      : null;
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<MeData>("/auth/me"),
    enabled: !!token,
    staleTime: 60_000,
  });
}
