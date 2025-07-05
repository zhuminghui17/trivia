'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Question } from '@/types/question';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import { CellAction } from './cell-action';
import { CATEGORY_OPTIONS } from './options';

export const columns: ColumnDef<Question>[] = [
  {
    id: 'date',
    accessorKey: 'date',
    header: ({ column }: { column: Column<Question, unknown> }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<Question['date']>();
      return <div>{date ? new Date(date).toLocaleDateString() : ''}</div>;
    }
  },
  {
    id: 'question',
    accessorKey: 'question',
    header: ({ column }: { column: Column<Question, unknown> }) => (
      <DataTableColumnHeader column={column} title='Question' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Question['question']>()}</div>,
    meta: {
      label: 'Question',
      placeholder: 'Search questions...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'answer',
    accessorKey: 'answer',
    header: ({ column }: { column: Column<Question, unknown> }) => (
      <DataTableColumnHeader column={column} title='Answer' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Question['answer']>()}</div>
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: ({ column }: { column: Column<Question, unknown> }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ cell }) => {
      const category = cell.getValue<Question['category']>();
      return (
        <Badge variant='outline' className='capitalize'>
          {category}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'categories',
      variant: 'multiSelect',
      options: CATEGORY_OPTIONS
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='text-right'>
        <CellAction data={row.original} />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false
  }
];
