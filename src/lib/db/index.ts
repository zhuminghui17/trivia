import { createClient } from '@supabase/supabase-js';
import { Database } from './schema';
import { questionsQueries } from './queries';
import { auth } from '@clerk/nextjs/server';

// Create a basic supabase client for server-side operations
const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    async accessToken() {
      return (await auth()).getToken();
    }
  }
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
export type Profiles = Tables['profiles']['Row'];
export type ProfileInsert = Tables['profiles']['Insert'];
export type ProfileUpdate = Tables['profiles']['Update'];
export type Attempts = Tables['attempts']['Row'];
export type AttemptInsert = Tables['attempts']['Insert'];
export type AttemptUpdate = Tables['attempts']['Update'];
