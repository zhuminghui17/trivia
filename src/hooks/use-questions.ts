import { useQuery } from '@tanstack/react-query';
import { Questions, Attempts } from '@/lib/db';
import { getUserAttemptForQuestion } from '@/lib/actions/attempts';

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

export function useUserAttempts(questionIds: string[]) {
  return useQuery<Record<string, Attempts[]>>({
    queryKey: ['userAttempts', questionIds],
    queryFn: async () => {
      const attempts: Record<string, Attempts[]> = {};

      // Fetch attempts for each question
      for (const questionId of questionIds) {
        try {
          const questionAttempts = await getUserAttemptForQuestion(questionId);
          attempts[questionId] = questionAttempts;
        } catch (error) {
          console.error(
            `Failed to fetch attempts for question ${questionId}:`,
            error
          );
          attempts[questionId] = [];
        }
      }

      return attempts;
    },
    enabled: questionIds.length > 0, // Only run if we have questions
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1
  });
}
