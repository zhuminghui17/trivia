'use client';

import * as React from 'react';
// import Autoplay from "embla-carousel-autoplay";
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
  correct_answer: string;
  category: string;
}

interface TriviaCarouselProps {
  questions: TriviaQuestion[];
  onQuestionAnswered?: (questionId: string, isCorrect: boolean) => void;
}

export function TriviaCarousel({
  questions,
  onQuestionAnswered
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

  const handleAnswerSubmit = (questionId: string) => (isCorrect: boolean) => {
    onQuestionAnswered?.(questionId, isCorrect);
    // // Move to next question after a delay
    // setTimeout(() => {
    //   api?.scrollNext();
    // }, 10000);
  };

  return (
    <div className='relative mx-auto w-full max-w-[90vw] px-8 xl:max-w-7xl'>
      <Carousel
        setApi={setApi}
        className='w-full'
        opts={{
          loop: true,
          align: 'start',
          dragFree: true
        }}
        // plugins={[
        //   Autoplay({
        //     delay: 10000,
        //     stopOnInteraction: true,
        //   }),
        // ]}
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {questions.map((question, index) => (
            <CarouselItem
              key={question.id}
              className='basis-full pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3'
            >
              <div className='p-1'>
                <TriviaQuestionCard
                  question={question}
                  index={index}
                  total={questions.length}
                  onAnswerSubmit={handleAnswerSubmit(question.id)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='absolute top-1/2 left-[-60px] -translate-y-1/2' />
        <CarouselNext className='absolute top-1/2 right-[-60px] -translate-y-1/2' />
      </Carousel>
    </div>
  );
}
