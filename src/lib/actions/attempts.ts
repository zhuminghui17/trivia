'use server';

import { db } from '@/lib/db';
import type { AttemptInsert, AttemptUpdate } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createAttempt(data: AttemptInsert) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Add user_id to the attempt data
    const attemptData: AttemptInsert = {
      ...data,
      user_id: userId
    };

    const attempt = await db.attempts.createAttempt(attemptData);

    // Revalidate relevant paths
    revalidatePath('/dashboard/trivia');
    revalidatePath('/dashboard/question');

    return attempt;
  } catch (error) {
    console.error('Failed to create attempt:', error);
    throw new Error('Failed to create attempt');
  }
}

export async function getAttempts() {
  try {
    return await db.attempts.getAttempts();
  } catch (error) {
    console.error('Failed to fetch attempts:', error);
    throw new Error('Failed to fetch attempts');
  }
}

export async function getUserAttempts(userId?: string) {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    // Use provided userId or current user's id
    const targetUserId = userId || currentUserId;

    return await db.attempts.getAttemptsByUserId(targetUserId);
  } catch (error) {
    console.error('Failed to fetch user attempts:', error);
    throw new Error('Failed to fetch user attempts');
  }
}

export async function getQuestionAttempts(questionId: string) {
  try {
    return await db.attempts.getAttemptsByQuestionId(questionId);
  } catch (error) {
    console.error('Failed to fetch question attempts:', error);
    throw new Error('Failed to fetch question attempts');
  }
}

export async function getAttemptById(id: string) {
  try {
    return await db.attempts.getAttemptById(id);
  } catch (error) {
    console.error('Failed to fetch attempt:', error);
    throw new Error('Failed to fetch attempt');
  }
}

export async function getUserAttemptForQuestion(
  questionId: string,
  userId?: string
) {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    // Use provided userId or current user's id
    const targetUserId = userId || currentUserId;

    return await db.attempts.getUserAttemptForQuestion(
      targetUserId,
      questionId
    );
  } catch (error) {
    console.error('Failed to fetch user attempt for question:', error);
    throw new Error('Failed to fetch user attempt for question');
  }
}

export async function submitAnswer(
  questionId: string,
  userAnswer: string,
  correctAnswer: string
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Check if the answer is correct (case-insensitive comparison)
    const isCorrect =
      userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

    const attemptData: AttemptInsert = {
      user_id: userId,
      question_id: questionId,
      user_answer: userAnswer,
      is_correct: isCorrect
    };

    const attempt = await db.attempts.createAttempt(attemptData);

    // Revalidate relevant paths
    revalidatePath('/dashboard/trivia');
    revalidatePath('/dashboard/question');

    return {
      attempt,
      isCorrect,
      correctAnswer
    };
  } catch (error) {
    console.error('Failed to submit answer:', error);
    throw new Error('Failed to submit answer');
  }
}

export async function getUserStats(userId?: string) {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    // Use provided userId or current user's id
    const targetUserId = userId || currentUserId;

    const attempts = await db.attempts.getAttemptsByUserId(targetUserId);

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(
      (attempt) => attempt.is_correct
    ).length;
    const incorrectAttempts = totalAttempts - correctAttempts;
    const accuracy =
      totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    // Get unique questions attempted
    const uniqueQuestions = new Set(
      attempts.map((attempt) => attempt.question_id)
    );
    const questionsAttempted = uniqueQuestions.size;

    return {
      totalAttempts,
      correctAttempts,
      incorrectAttempts,
      accuracy: Math.round(accuracy * 100) / 100, // Round to 2 decimal places
      questionsAttempted
    };
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    throw new Error('Failed to fetch user stats');
  }
}
