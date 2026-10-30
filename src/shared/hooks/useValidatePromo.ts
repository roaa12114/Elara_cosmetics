import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/lib/api-client";
import type { PromoValidationData, ValidatePromoRequest } from "@shared/types";

export function useValidatePromo() {
  return useMutation({
    mutationFn: (body: ValidatePromoRequest) =>
      api.post<PromoValidationData>("/promos/validate", body),
  });
}
