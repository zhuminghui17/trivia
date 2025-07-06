'use server';

import { db } from '@/lib/db';
import type { QuestionInsert } from '@/lib/db';
import { generateDailyQuestions } from '@/lib/openai';
import { revalidatePath } from 'next/cache';

export async function createQuestion(data: QuestionInsert) {
  try {
    return await db.questions.createQuestion(data);
  } catch (error) {
    console.error('Failed to create question:', error);
    throw new Error('Failed to create question');
  }
}

export async function getQuestions(search?: string, categories?: string[]) {
  try {
    return await db.questions.getQuestions({ search, categories });
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    throw new Error('Failed to fetch questions');
  }
}

export async function generateAndSaveDailyQuestions() {
  try {
    console.log('🚀 Starting daily question generation process...');

    // Generate questions using OpenAI
    const generatedQuestions = await generateDailyQuestions();

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Check if questions already exist for today
    const existingQuestions = await db.questions.getQuestions({});
    const todayQuestions = existingQuestions.filter((q) => q.date === today);

    if (todayQuestions.length > 0) {
      console.log(
        `⚠️ Questions already exist for today (${todayQuestions.length} questions)`
      );
      return {
        success: false,
        message: `Questions already exist for today (${todayQuestions.length} questions). Delete them first if you want to regenerate.`,
        questionsGenerated: 0
      };
    }

    // Save questions to database
    const savedQuestions = [];
    for (const question of generatedQuestions) {
      const questionData: QuestionInsert = {
        question: question.question,
        answer: question.answer,
        category: question.category,
        date: today
      };

      const saved = await db.questions.createQuestion(questionData);
      savedQuestions.push(saved);
    }

    // Revalidate the questions page to show new data
    revalidatePath('/dashboard/question');
    revalidatePath('/dashboard/trivia');

    console.log(
      `✅ Successfully generated and saved ${savedQuestions.length} questions for ${today}`
    );

    return {
      success: true,
      message: `Successfully generated ${savedQuestions.length} questions for today!`,
      questionsGenerated: savedQuestions.length,
      questions: savedQuestions
    };
  } catch (error) {
    console.error('❌ Failed to generate daily questions:', error);
    return {
      success: false,
      message: `Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}`,
      questionsGenerated: 0
    };
  }
}
