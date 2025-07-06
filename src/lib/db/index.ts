import { createClient } from '@supabase/supabase-js';
import { Database } from './schema';
import { questionsQueries } from './queries';

// Create a single supabase client for interacting with your database
const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Export the enhanced db object with queries
export const db = {
  client: supabaseClient,
  questions: questionsQueries
};

// Helper types for better type inference
export type Tables = Database['public']['Tables'];
export type Questions = Tables['questions']['Row'];
export type QuestionInsert = Tables['questions']['Insert'];
export type QuestionUpdate = Tables['questions']['Update'];
