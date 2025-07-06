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
      questions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          content: string;
          category: string;
          difficulty: 'easy' | 'medium' | 'hard';
          options: Json[];
          correct_answer: string;
          explanation: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          content: string;
          category: string;
          difficulty: 'easy' | 'medium' | 'hard';
          options: Json[];
          correct_answer: string;
          explanation?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          content?: string;
          category?: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          options?: Json[];
          correct_answer?: string;
          explanation?: string | null;
          created_by?: string | null;
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
