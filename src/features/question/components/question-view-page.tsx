import { fakeQuestions } from '@/constants/mock-api';
import { Question } from '@/types/question';
import { notFound } from 'next/navigation';
import QuestionForm from './question-form';

type TQuestionViewPageProps = {
  questionId: string;
};

export default async function QuestionViewPage({
  questionId
}: TQuestionViewPageProps) {
  let question = null;
  let pageTitle = 'Create New Question';

  if (questionId !== 'new') {
    const data = await fakeQuestions.getQuestionById(Number(questionId));
    question = data.question as Question;
    if (!question) {
      notFound();
    }
    pageTitle = `Edit Question`;
  }

  return <QuestionForm initialData={question} pageTitle={pageTitle} />;
}
