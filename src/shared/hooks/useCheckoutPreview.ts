import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/lib/api-client";
import type {
  CheckoutPreviewData,
  CheckoutPreviewRequest,
} from "@shared/types";

export function useCheckoutPreview() {
  return useMutation({
    mutationFn: (body: CheckoutPreviewRequest) =>
      api.post<CheckoutPreviewData>("/checkout/preview", body),
  });
}
