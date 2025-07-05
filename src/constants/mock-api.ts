////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering
import { Question } from '@/types/question';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock trivia questions
export const triviaQuestions = [
  {
    id: '1',
    question: 'What is the capital of France?',
    correct_answer: 'Paris',
    category: 'Geography',
    date: new Date()
  },
  {
    id: '2',
    question: 'Which planet is known as the Red Planet?',
    correct_answer: 'Mars',
    category: 'Science',
    date: new Date()
  },
  {
    id: '3',
    question: 'Who painted the Mona Lisa?',
    correct_answer: 'Leonardo da Vinci',
    category: 'Art',
    date: new Date()
  },
  {
    id: '4',
    question: 'What is the capital of Japan?',
    correct_answer: 'Tokyo',
    category: 'Geography',
    date: new Date()
  },
  {
    id: '5',
    question: 'What is the capital of Japan?',
    correct_answer: 'Tokyo',
    category: 'Geography',
    date: new Date()
  }
];

// Mock question data store
export const fakeQuestions = {
  records: [] as Question[], // Holds the list of question objects

  // Initialize with sample data
  initialize() {
    const sampleQuestions: Question[] = [];
    function generateRandomQuestionData(id: number): Question {
      const categories = ['Geography', 'Science', 'Art', 'History'];

      return {
        id,
        question: faker.lorem.sentence(),
        answer: faker.lorem.sentence(),
        category: faker.helpers.arrayElement(categories),
        date: faker.date.recent()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleQuestions.push(generateRandomQuestionData(i));
    }

    this.records = sampleQuestions;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let questions = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      questions = questions.filter((question) =>
        categories.includes(question.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      questions = matchSorter(questions, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return questions;
  },

  // Get paginated results with optional category filtering and search
  async getQuestions({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allQuestions = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalQuestions = allQuestions.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedQuestions = allQuestions.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_questions: totalQuestions,
      offset,
      limit,
      questions: paginatedQuestions
    };
  },

  // Get a specific product by its ID
  async getQuestionById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const question = this.records.find((question) => question.id === id);

    if (!question) {
      return {
        success: false,
        message: `Question with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Question with ID ${id} found`,
      question
    };
  }
};

// Initialize sample products
fakeQuestions.initialize();
