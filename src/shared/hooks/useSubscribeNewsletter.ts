import { useMutation } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';

export interface SubscribeNewsletterRequest {
  email: string;
}

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (body: SubscribeNewsletterRequest) =>
      api.post('/newsletters/subscribe', body),
  });
}