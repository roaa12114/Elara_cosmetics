import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/lib/api-client';
import type { Category } from '@shared/types';

export interface CreateCategoryRequest {
  name: string;
  description: string;
  image: string;
}

export interface CreateCategoryData {
  category: Category;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategoryRequest) =>
      api.post<CreateCategoryData>('/categories', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}