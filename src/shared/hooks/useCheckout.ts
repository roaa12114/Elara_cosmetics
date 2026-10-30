import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/lib/api-client";
import type { CheckoutData } from "@shared/types";

export function useCheckout() {
  return useMutation({
    mutationFn: ({
      orderId,
      promoCode,
    }: {
      orderId: string;
      promoCode?: string;
    }) =>
      promoCode
        ? api.post<CheckoutData>("/checkout/with-promo", { orderId, promoCode })
        : api.post<CheckoutData>("/checkout", { orderId }),
  });
}
