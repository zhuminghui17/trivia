'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { TriviaQuestionCard } from './trivia-question-card';
import type { CarouselApi } from '@/components/ui/carousel';

interface TriviaQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface TriviaCarouselProps {
  questions: TriviaQuestion[];
  answers: Record<string, string>;
  showResults: boolean;
  onAnswerChange: (questionId: string, answer: string) => void;
}

export function TriviaCarousel({
  questions,
  answers,
  showResults,
  onAnswerChange
}: TriviaCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className='relative mx-auto w-full max-w-[90vw] px-8 xl:max-w-7xl'>
      <Carousel
        setApi={setApi}
        className='w-full'
        opts={{
          loop: false,
          align: 'start',
          dragFree: true,
          startIndex: 0
        }}
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {questions.map((question, idx) => (
            <CarouselItem
              key={question.id}
              className='basis-full pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3'
            >
              <div className='p-1'>
                <TriviaQuestionCard
                  question={question}
                  index={idx}
                  total={questions.length}
                  answer={answers[question.id] || ''}
                  showResult={showResults}
                  onAnswerChange={(answer) =>
                    onAnswerChange(question.id, answer)
                  }
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='absolute top-1/2 left-[-50px] -translate-y-1/2' />
        <CarouselNext className='absolute top-1/2 right-[-50px] -translate-y-1/2' />
      </Carousel>
    </div>
  );
}
