/**
 * Represents a trivia question in the system
 */
export interface Question {
  /** Unique identifier for the question */
  id: number;

  /** The actual question text */
  question: string;

  /** The correct answer to the question */
  answer: string;

  /** The category this question belongs to */
  category: string;

  /** The date associated with this question (if any) */
  date?: Date;
}
