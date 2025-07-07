'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TriviaQuestionCardProps {
  question: {
    id: string;
    question: string;
    category: string;
    answer: string;
  };
  index: number;
  total: number;
  answer: string;
  showResult: boolean;
  submissionResult?: { isCorrect: boolean; correctAnswer: string };
  onAnswerChange: (answer: string) => void;
}

export function TriviaQuestionCard({
  question,
  index,
  total,
  answer,
  showResult,
  submissionResult,
  onAnswerChange
}: TriviaQuestionCardProps) {
  // Use submission result if available, otherwise fall back to local comparison
  const isCorrect = submissionResult
    ? submissionResult.isCorrect
    : showResult &&
      answer.toLowerCase().trim() === question.answer.toLowerCase().trim();

  return (
    <Card className='flex h-[350px] flex-col shadow-md transition-shadow hover:shadow-lg'>
      <CardHeader className='flex-none space-y-3'>
        <div className='flex items-center justify-between'>
          <Badge variant='outline' className='text-sm font-medium'>
            {question.category}
          </Badge>
          <span className='text-muted-foreground text-sm'>
            {index + 1}/{total}
          </span>
        </div>
        <CardTitle className='text-lg leading-tight'>
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col justify-end'>
        <div className='space-y-3'>
          <Input
            placeholder='Type your answer...'
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            disabled={showResult}
            className='focus:ring-primary focus:ring-2 focus:ring-offset-2'
            onKeyDown={(e) => {
              if (e.key === 'Enter' && answer.trim()) {
                // Move focus to next input if available
                const inputs = document.querySelectorAll('input[type="text"]');
                const currentIndex = Array.from(inputs).indexOf(
                  e.currentTarget
                );
                const nextInput = inputs[currentIndex + 1] as HTMLInputElement;
                if (nextInput) {
                  nextInput.focus();
                }
              }
            }}
          />
          {showResult && (
            <div
              className={`rounded-md p-3 transition-colors ${
                isCorrect
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
              }`}
            >
              {isCorrect ? (
                <p>Correct! 🎉</p>
              ) : (
                <p className='text-sm'>
                  Incorrect. The correct answer is:{' '}
                  <span className='font-semibold'>
                    {submissionResult?.correctAnswer || question.answer}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
