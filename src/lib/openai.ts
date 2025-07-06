import OpenAI from 'openai';

// Initialize OpenAI client with better error handling
let openai: OpenAI | null = null;

try {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️ OPENAI_API_KEY not found in environment variables');
  } else {
    console.log('✅ Initializing OpenAI client...');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('✅ OpenAI client initialized successfully');
  }
} catch (error) {
  console.error('❌ Failed to initialize OpenAI client:', error);
}

export interface GeneratedQuestion {
  question: string;
  answer: string;
  category: string;
}

export async function generateDailyQuestions(): Promise<GeneratedQuestion[]> {
  // Check if OpenAI client is available
  if (!openai) {
    throw new Error('OpenAI client not initialized - check API key');
  }

  console.log('🤖 Starting OpenAI question generation...');

  try {
    const prompt = `Generate 5 challenging yet fair trivia questions for a daily quiz. Create questions that make people think, not just recall basic facts.

REQUIREMENTS:
1. DIFFICULTY: Medium-Hard (5/10 difficulty) - should challenge educated adults
2. CATEGORIES: Choose from these diverse categories:
   - Science & Technology (space, physics, biology, computing, innovations)
   - History & Politics (lesser-known events, historical figures, political systems)
   - Arts & Culture (literature, music, art movements, cultural phenomena)
   - Geography & Nature (unusual places, geological features, ecosystems)
   - Sports & Entertainment (records, behind-the-scenes facts, industry knowledge)
   - Current Events & Society (recent developments, social movements, economics)

3. QUESTION TYPES - Mix these styles:
   - Cause & Effect: "What phenomenon causes..." 
   - Lesser-known Facts: "Which country was the first to..."
   - Technical Details: "In computing, what does..."
   - Historical Context: "What event led to..."
   - Scientific Principles: "What happens when..."

4. AVOID these overused topics:
   - Capital cities of major countries (Tokyo, Paris, London, etc.)
   - Basic historical dates (1776, 1492, etc.)
   - Common scientific facts (speed of light, etc.)
   - Basic pop culture (Disney characters, etc.)

5. ANSWERS:
   - Provide clear, concise answers
   - Answers should be specific but not overly detailed
   - Accept reasonable variations in spelling/phrasing

EXAMPLES of the quality I want:
- "What programming concept allows a function to call itself?" → "Recursion"
- "Which treaty ended the Thirty Years' War in 1648?" → "Peace of Westphalia"
- "What element gives Neptune its distinctive blue color?" → "Methane"
- "In economics, what term describes the point where supply equals demand?" → "Equilibrium"

Format as valid JSON array:
[
  {
    "question": "Your challenging question here",
    "answer": "Correct answer",
    "category": "Specific category"
  }
]

Generate unique, thought-provoking questions that will genuinely challenge and educate players.`;

    console.log('📡 Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a trivia question generator. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8, // Add some creativity
      max_tokens: 2000
    });

    console.log('✅ Received response from OpenAI');

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    console.log('📝 Parsing OpenAI response...');

    // Clean the response - remove markdown code blocks if present
    let cleanedContent = content.trim();

    // Remove ```json and ``` markers if they exist
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    console.log(
      '🧹 Cleaned content:',
      cleanedContent.substring(0, 200) + '...'
    );

    // Parse the JSON response
    const questions = JSON.parse(cleanedContent);

    // Validate each question
    const validatedQuestions: GeneratedQuestion[] = questions.map(
      (q: any, index: number) => {
        if (!q.question || !q.answer || !q.category) {
          throw new Error(`Invalid question format at index ${index}`);
        }

        if (
          typeof q.question !== 'string' ||
          typeof q.answer !== 'string' ||
          typeof q.category !== 'string'
        ) {
          throw new Error(
            `Question ${index} must have string values for question, answer, and category`
          );
        }

        return {
          question: q.question,
          answer: q.answer,
          category: q.category
        };
      }
    );

    if (validatedQuestions.length !== 5) {
      throw new Error('Must generate exactly 5 questions');
    }

    console.log('✅ Successfully generated and validated 5 questions');
    return validatedQuestions;
  } catch (error) {
    console.error('❌ Error in generateDailyQuestions:', error);
    throw new Error(
      `Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
