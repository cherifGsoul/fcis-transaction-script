import * as AnswerOption from "./answer-option";
import * as Question from "./question";

export type GetQuestion = (id: string) => Promise<Question.t>;

export type SaveQuestion = (question: Question.t) => Promise<void>;

export type UpdateQuestionPrompt = (question: Question.t) => Promise<void>;

export type AddAnswerOption = (
  existingQuestion: Question.t,
  ao: AnswerOption.t
) => Promise<void>;

export type RemoveAnswerOption = (
  persistedQuestion: Question.t,
  ao: AnswerOption.t
) => Promise<void>;

export type UpdateAnswerOption = (
  persistedQuestion: Question.t,
  ao: AnswerOption.t
) => Promise<void>;
