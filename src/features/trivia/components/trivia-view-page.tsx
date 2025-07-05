'use client';

import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { TriviaCarousel } from './trivia-carousel';
import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { triviaQuestions } from '@/constants/mock-api';
import { Button } from '@/components/ui/button';

export function TriviaViewPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitAll = () => {
    setShowResults(true);
    // Calculate results
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = triviaQuestions.find((q) => q.id === questionId);
      const isCorrect =
        question?.correct_answer.toLowerCase().trim() ===
        answer.toLowerCase().trim();
      console.log(
        `Question ${questionId} answered ${isCorrect ? 'correctly' : 'incorrectly'}`
      );
    });
  };

  const handleTryAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  const allQuestionsAnswered = triviaQuestions.every((q) =>
    answers[q.id]?.trim()
  );

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
            answers={answers}
            showResults={showResults}
            onAnswerChange={handleAnswerChange}
          />
          <div className='flex w-full max-w-[90vw] justify-center px-8 xl:max-w-7xl'>
            {!showResults ? (
              <Button
                className='min-w-[200px]'
                size='lg'
                onClick={handleSubmitAll}
                disabled={!allQuestionsAnswered}
              >
                Submit All Answers
              </Button>
            ) : (
              <Button
                className='min-w-[200px]'
                variant='outline'
                size='lg'
                onClick={handleTryAgain}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
