'use client';

import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { TriviaCarousel } from './trivia-carousel';
import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Sparkles } from 'lucide-react';
import { useQuestions } from '@/hooks/use-questions';
import GenerateQuestionsButton from '@/features/question/components/generate-questions-button';

export function TriviaViewPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Fetch questions from database
  const { data: allQuestions, isLoading, refetch } = useQuestions();

  // Filter questions for today
  const todayQuestions = allQuestions?.filter((q) => q.date === today) || [];

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
      const question = todayQuestions.find((q) => q.id === questionId);
      const isCorrect =
        question?.answer.toLowerCase().trim() === answer.toLowerCase().trim();
      console.log(
        `Question ${questionId} answered ${isCorrect ? 'correctly' : 'incorrectly'}`
      );
    });
  };

  const handleTryAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  const allQuestionsAnswered = todayQuestions.every((q) =>
    answers[q.id]?.trim()
  );

  if (isLoading) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <Heading title={`Trivia`} description="Today's trivia" />
          </div>
          <Separator />
          <div className='flex flex-col items-center justify-center gap-4'>
            <p>Loading questions...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (todayQuestions.length === 0) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <Heading title={`Trivia`} description="Today's trivia" />
          </div>
          <Separator />
          <div className='flex flex-col items-center justify-center gap-8'>
            <Card className='w-full max-w-md'>
              <CardHeader className='text-center'>
                <CalendarDays className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                <CardTitle>No Questions Yet</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 text-center'>
                <p className='text-muted-foreground'>
                  Generate today's trivia questions to start your daily
                  challenge!
                </p>
                <GenerateQuestionsButton onSuccess={() => refetch()} />
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title={`Trivia`} description="Today's trivia" />
        </div>
        <Separator />
        <div className='flex flex-col items-center justify-center gap-4'>
          <TriviaCarousel
            questions={todayQuestions}
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
