import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'pending';

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      api.patch(`/orders/admin/${orderId}/status`, { status }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
}