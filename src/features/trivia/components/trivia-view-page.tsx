'use client';

import { Heading } from '@/components/ui/heading';
import { TriviaCarousel } from './trivia-carousel';
import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';

// Sample questions - in a real app, these would come from your database
const sampleQuestions = [
  {
    id: '1',
    question: 'What is the capital of France?',
    correct_answer: 'Paris',
    category: 'Geography',
    date: new Date()
  },
  {
    id: '2',
    question: 'Which planet is known as the Red Planet?',
    correct_answer: 'Mars',
    category: 'Science',
    date: new Date()
  },
  {
    id: '3',
    question: 'Who painted the Mona Lisa?',
    correct_answer: 'Leonardo da Vinci',
    category: 'Art',
    date: new Date()
  },
  {
    id: '4',
    question: 'What is the capital of Japan?',
    correct_answer: 'Tokyo',
    category: 'Geography',
    date: new Date()
  },
  {
    id: '5',
    question: 'What is the capital of Japan?',
    correct_answer: 'Tokyo',
    category: 'Geography',
    date: new Date()
  }
];

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
            questions={sampleQuestions}
            onQuestionAnswered={handleQuestionAnswered}
          />
        </div>
      </div>
    </PageContainer>
  );
}
