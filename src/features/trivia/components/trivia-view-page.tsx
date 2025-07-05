'use client';

import { Heading } from '@/components/ui/heading';
import { TriviaCarousel } from './trivia-carousel';
import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { triviaQuestions } from '@/constants/mock-api';

export function TriviaViewPage() {
  const handleQuestionAnswered = (questionId: string, isCorrect: boolean) => {
    console.log(
      `Question ${questionId} answered ${isCorrect ? 'correctly' : 'incorrectly'}`
    );
    // Here you could update the user's score, save progress, etc.
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title={`Trivia`} description="Today's trivia" />
        </div>
        <Separator />
        <div className='flex flex-col items-center justify-center gap-4'>
          <TriviaCarousel
            questions={triviaQuestions}
            onQuestionAnswered={handleQuestionAnswered}
          />
        </div>
      </div>
    </PageContainer>
  );
}
