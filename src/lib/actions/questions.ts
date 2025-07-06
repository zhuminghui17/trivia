'use server';

import { db } from '@/lib/db';
import type { QuestionInsert } from '@/lib/db';

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
