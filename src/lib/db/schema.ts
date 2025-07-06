export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          question: string;
          answer: string;
          date: string;
          category: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          date: string;
          category: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          date?: string;
          category?: string;
        };
      };
      attempts: {
        Row: {
          id: number;
          user_id: string;
          question_id: string;
          user_answer: string;
          is_correct: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id?: string;
          question_id: string;
          user_answer: string;
          is_correct: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          question_id?: string;
          user_answer?: string;
          is_correct?: boolean;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
