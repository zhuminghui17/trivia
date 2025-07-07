'use client';

import { useState, useEffect, useMemo } from 'react';
import { Heading } from '@/components/ui/heading';
import { TriviaCarousel } from './trivia-carousel';
import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Sparkles } from 'lucide-react';
import { useQuestions } from '@/hooks/use-questions';
import GenerateQuestionsButton from '@/features/question/components/generate-questions-button';
import {
  submitAnswer,
  getUserAttemptForQuestion
} from '@/lib/actions/attempts';
import { toast } from 'sonner';

export function TriviaViewPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submissionResults, setSubmissionResults] = useState<
    Record<string, { isCorrect: boolean; correctAnswer: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAttempts, setIsCheckingAttempts] = useState(false);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Fetch questions from database
  const { data: allQuestions, isLoading, refetch } = useQuestions();

  // Filter questions for today (memoized to prevent infinite re-renders)
  const todayQuestions = useMemo(() => {
    return allQuestions?.filter((q) => q.date === today) || [];
  }, [allQuestions, today]);

  // Check for existing attempts once when questions are loaded
  useEffect(() => {
    const checkExistingAttempts = async () => {
      if (todayQuestions.length === 0) return;

      setIsCheckingAttempts(true);

      try {
        const existingAnswers: Record<string, string> = {};
        const existingResults: Record<
          string,
          { isCorrect: boolean; correctAnswer: string }
        > = {};
        let hasAttempts = false;

        // Check each question for existing attempts
        for (const question of todayQuestions) {
          const attempts = await getUserAttemptForQuestion(question.id);
          if (attempts && attempts.length > 0) {
            // Get the most recent attempt
            const latestAttempt = attempts[0];
            existingAnswers[question.id] = latestAttempt.user_answer;
            existingResults[question.id] = {
              isCorrect: latestAttempt.is_correct,
              correctAnswer: question.answer
            };
            hasAttempts = true;
          }
        }

        if (hasAttempts) {
          setAnswers(existingAnswers);
          setSubmissionResults(existingResults);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Failed to check existing attempts:', error);
        // Continue with fresh session if check fails
      } finally {
        setIsCheckingAttempts(false);
      }
    };

    checkExistingAttempts();
  }, [todayQuestions]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      const results: Record<
        string,
        { isCorrect: boolean; correctAnswer: string }
      > = {};

      // Submit each answer to the database
      for (const [questionId, answer] of Object.entries(answers)) {
        const question = todayQuestions.find((q) => q.id === questionId);
        if (question) {
          const result = await submitAnswer(
            questionId,
            answer,
            question.answer
          );
          results[questionId] = {
            isCorrect: result.isCorrect,
            correctAnswer: result.correctAnswer
          };
        }
      }

      setSubmissionResults(results);
      setShowResults(true);

      // Show success message with stats
      const correctCount = Object.values(results).filter(
        (r) => r.isCorrect
      ).length;
      const totalCount = Object.values(results).length;

      toast.success(
        `Answers submitted! You got ${correctCount}/${totalCount} correct.`
      );
    } catch (error) {
      console.error('Failed to submit answers:', error);
      toast.error('Failed to submit answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setAnswers({});
    setShowResults(false);
    setSubmissionResults({});
  };

  const allQuestionsAnswered = todayQuestions.every((q) =>
    answers[q.id]?.trim()
  );

  if (isLoading || isCheckingAttempts) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <Heading title={`Trivia`} description="Today's trivia" />
          </div>
          <Separator />
          <div className='flex flex-col items-center justify-center gap-4'>
            <p>
              {isLoading ? 'Loading questions...' : 'Checking your progress...'}
            </p>
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
          <Heading
            title={`Trivia`}
            description={
              showResults ? "Your results for today's trivia" : "Today's trivia"
            }
          />
        </div>
        <Separator />
        <div className='flex flex-col items-center justify-center gap-4'>
          <TriviaCarousel
            questions={todayQuestions}
            answers={answers}
            showResults={showResults}
            submissionResults={submissionResults}
            onAnswerChange={handleAnswerChange}
          />
          <div className='flex w-full max-w-[90vw] justify-center px-8 xl:max-w-7xl'>
            {!showResults ? (
              <Button
                className='min-w-[200px]'
                size='lg'
                onClick={handleSubmitAll}
                disabled={!allQuestionsAnswered || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit All Answers'}
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
