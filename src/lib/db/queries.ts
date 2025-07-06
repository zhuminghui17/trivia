import { db } from './index';
import type { QuestionInsert, QuestionUpdate } from './index';

export const questionsQueries = {
  // Get questions with optional filters
  async getQuestions({
    categories,
    search
  }: {
    categories?: string[];
    search?: string;
  } = {}) {
    let query = db.client.from('questions').select('*');

    // Apply category filter if provided
    if (categories && categories.length > 0) {
      query = query.in('category', categories);
    }

    // Apply search filter if provided
    if (search) {
      query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`);
    }

    const { data: questions, error } = await query.order('date', {
      ascending: false
    });

    if (error) {
      throw error;
    }

    return questions || [];
  },

  // Get a single question by ID
  async getQuestionById(id: string) {
    const { data, error } = await db.client
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Create a new question
  async createQuestion(question: QuestionInsert) {
    const { data, error } = await db.client
      .from('questions')
      .insert(question)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Update an existing question
  async updateQuestion(id: string, updates: QuestionUpdate) {
    const { data, error } = await db.client
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Delete a question
  async deleteQuestion(id: string) {
    const { error } = await db.client.from('questions').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  }
};
