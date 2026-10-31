import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      api.delete(`/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}