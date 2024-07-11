import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const questions = sqliteTable(
  'questions',
  {
    id: text('id').primaryKey(),
    prompt: text('prompt').notNull().unique(),
  },
  (questions) => ({
    promptIdx: index('prompt_idx').on(questions.prompt),
  })
);

export const answerOptions = sqliteTable(
  'answer_options',
  {
    id: text('id').primaryKey(),
    answer: text('answer').notNull().unique(),
    correct: integer('correct', { mode: 'boolean' }).notNull(),
    questionId: text('question_id')
      .references(() => questions.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (answerOptions) => ({
    answerIdx: index('answer_idx').on(answerOptions.answer),
  })
);
