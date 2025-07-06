import { useQuery } from '@tanstack/react-query';
import { Questions } from '@/lib/db';

export function useQuestions({
  search,
  categories
}: {
  search?: string;
  categories?: string[];
} = {}) {
  return useQuery<Questions[]>({
    queryKey: ['questions', { search, categories }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categories?.length) params.set('categories', categories.join(','));

      const response = await fetch(`/api/questions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      return response.json();
    }
  });
}
