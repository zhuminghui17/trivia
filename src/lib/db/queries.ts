import { db } from './index';
import type { AttemptInsert, QuestionInsert, QuestionUpdate } from './index';

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

export const attemptsQueries = {
  // Get all attempts
  async getAttempts() {
    const { data, error } = await db.client.from('attempts').select('*');

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Create a new attempt
  async createAttempt(attempt: AttemptInsert) {
    const { data, error } = await db.client
      .from('attempts')
      .insert(attempt)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Get attempts by user ID
  async getAttemptsByUserId(userId: string) {
    const { data, error } = await db.client
      .from('attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Get attempts by question ID
  async getAttemptsByQuestionId(questionId: string) {
    const { data, error } = await db.client
      .from('attempts')
      .select('*')
      .eq('question_id', questionId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Get attempt by ID
  async getAttemptById(id: string) {
    const { data, error } = await db.client
      .from('attempts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Get user's attempts for a specific question
  async getUserAttemptForQuestion(userId: string, questionId: string) {
    const { data, error } = await db.client
      .from('attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }
};
