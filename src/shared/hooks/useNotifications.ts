import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/lib/api-client";
import type { NotificationsData } from "@shared/types";

export function useNotifications() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("elara_access_token")
      : null;
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get<NotificationsData>("/notification"),
    enabled: !!token,
    staleTime: 30_000,
  });
}
