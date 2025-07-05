import { Question } from '@/constants/data';
import { fakeQuestions } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { QuestionTable } from './question-tables';
import { columns } from './question-tables/columns';

type QuestionListingPage = {};

export default async function QuestionListingPage({}: QuestionListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const data = await fakeQuestions.getQuestions(filters);
  const totalQuestions = data.total_questions;
  const questions: Question[] = data.questions;

  return (
    <QuestionTable
      data={questions}
      totalItems={totalQuestions}
      columns={columns}
    />
  );
}
