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
          question: string;
          answer: string;
          date: Date;
          category: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          date: Date;
          category: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          date?: Date;
          category?: string;
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
