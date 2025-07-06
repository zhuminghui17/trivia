'use client';

import { Button } from '@/components/ui/button';
import { generateAndSaveDailyQuestions } from '@/lib/actions/questions';
import { IconSparkles, IconLoader2 } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface GenerateQuestionsButtonProps {
  onSuccess?: () => void;
}

export default function GenerateQuestionsButton({
  onSuccess
}: GenerateQuestionsButtonProps = {}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);

    try {
      const result = await generateAndSaveDailyQuestions();

      if (result.success) {
        toast.success(result.message);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to generate questions. Please try again.');
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateQuestions}
      disabled={isGenerating}
      variant='default'
      className='text-xs md:text-sm'
    >
      {isGenerating ? (
        <>
          <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
          Generating...
        </>
      ) : (
        <>
          <IconSparkles className='mr-2 h-4 w-4' />
          Generate Today's Questions
        </>
      )}
    </Button>
  );
}
