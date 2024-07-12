import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { handleGetQuestion, handleQuestionCommand } from '../..';
import type {
  CreateQuestionCommand,
  UpdateQuestionCommand,
} from '../..';
import { Commands } from '../..';
import { z } from 'zod';
import { AnswerOptionData } from '../../question/core';

const questions = new Hono();

const answerOptionSchema = z.object({
  answer: z.string().min(10).max(200),
  correct: z.boolean().default(false),
  id: z.string().uuid().optional(),
});

const questionSchema = z.object({
  prompt: z.string().min(5).max(200),
  answerOptions: z.array(answerOptionSchema),
});

type QuestionForm = z.infer<typeof questionSchema>;

questions.get('/:id', async (c) => {
  const id = await c.req.param('id');
  const question = await handleGetQuestion(id);
  return c.json(question, 200);
});

questions.post(
  '/',
  validator('json', (value, c) => {
    const parsed = questionSchema.safeParse(value);
    console.log(parsed);
    if (!parsed.success) {
      console.log(parsed.error);
    }
    console.log(parsed.data);
    return parsed.data;
  }),
  async (c) => {
    const payload = await c.req.valid('json');
    const answerOptions = payload?.answerOptions as AnswerOptionData[];
    const command: CreateQuestionCommand = {
      name: Commands.CREATE_QUESTION,
      data: {
        id: crypto.randomUUID(),
        prompt: payload?.prompt as string,
        answerOptions: answerOptions.map((ao) => ({
          id: crypto.randomUUID(),
          answer: ao.answer,
          correct: ao.correct,
        })),
      },
    };
    handleQuestionCommand(command);
    return c.json(command.data, 201);
  }
);

questions.put(
  '/:id',
  validator('json', (value, c) => {
    const parsed = questionSchema.safeParse(value);
    if (!parsed.success) {
    }
    return parsed.data;
  }),
  async (c) => {
    const payload = await c.req.valid('json');
    const id = c.req.param('id');
    const answerOptions = payload?.answerOptions as AnswerOptionData[];
    const command: UpdateQuestionCommand = {
      name: Commands.UPDATE_QUESTION,
      data: {
        id,
        prompt: payload?.prompt as string,
        answerOptions: answerOptions.map((ao) => ({
          id: ao.id ? ao.id : crypto.randomUUID(),
          answer: ao.answer,
          correct: ao.correct,
        })),
      },
    };
    handleQuestionCommand(command);
    return c.json(command.data, 201);
  }
);

questions.delete('/', async () => {});

export default questions;
