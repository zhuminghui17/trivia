import { Question } from '@/types/question';
import { fakeQuestions } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { QuestionTable } from './question-tables';
import { columns } from './question-tables/columns';
import { getQuestions } from '@/lib/actions/questions';

type QuestionListingPage = {};

export default async function QuestionListingPage({}: QuestionListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const filters = {
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const data = await getQuestions(
    search || undefined,
    categories ? [categories] : undefined
  );
  const totalQuestions = data.length;
  const questions: Question[] = data;

  return (
    <QuestionTable
      data={questions}
      totalItems={totalQuestions}
      columns={columns}
    />
  );
}
