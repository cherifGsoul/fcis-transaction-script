import * as Question from "./question";
import * as AnswerOption from "./answer-option";

export enum Event {
  QuestionPromptWasUpdated = "QUESTION_PROMPT_WAS_UPDATED",
  AnswerOptionsWereAdded = "ANSWER_OPTIONS_WERE_ADDED",
  AnswerOptionsWereRemoved = "ANSWER_OPTIONS_WERE_REMOVED",
  AnswerOptionsWereUpdated = "ANSWER_OPTIONS_WERE_UPDATED",
}

export type QuestionPromptWasUpdatedEvent = {
  name: Event.QuestionPromptWasUpdated;
  question: Question.t;
  addedAnswerOptions: undefined;
  removedAnswerOptions: undefined;
  updatedAnswerOptions: undefined;
};

export type AnswerOptionsWereAddedEvent = {
  name: Event.AnswerOptionsWereAdded;
  question: Question.t;
  addedAnswerOptions: AnswerOption.t[];
  removedAnswerOptions: undefined;
  updatedAnswerOptions: undefined;
};

export type AnswerOptionsWereRemovedEvent = {
  name: Event.AnswerOptionsWereRemoved;
  question: Question.t;
  addedAnswerOptions: undefined;
  removedAnswerOptions: AnswerOption.t[];
  updatedAnswerOptions: undefined;
};

export type AnswerOptionsWereUpdatedEvent = {
  name: Event.AnswerOptionsWereUpdated;
  question: Question.t;
  addedAnswerOptions: undefined;
  removedAnswerOptions: undefined;
  updatedAnswerOptions: AnswerOption.t[];
};

export type t =
  | QuestionPromptWasUpdatedEvent
  | AnswerOptionsWereAddedEvent
  | AnswerOptionsWereRemovedEvent
  | AnswerOptionsWereUpdatedEvent;

type Spec = {
  isSatisfiedBy: (
    updatedQuestion: Question.t,
    newQuestion: Question.t,
    addedAnswerOptions: AnswerOption.t[],
    removedAnswerOptions: AnswerOption.t[],
    updatedAnswerOptions: AnswerOption.t[]
  ) => boolean;
  event: (
    newQuestion: Question.t,
    addedAnswerOptions: AnswerOption.t[],
    removedAnswerOptions: AnswerOption.t[],
    updatedAnswerOptions: AnswerOption.t[]
  ) => t;
};

const specs: Spec[] = [
  {
    isSatisfiedBy: (updatedQuestion, newQuestion) =>
      updatedQuestion.id === newQuestion.id &&
      updatedQuestion.prompt !== newQuestion.prompt,
    event: (newQuestion) => ({
      name: Event.QuestionPromptWasUpdated,
      question: newQuestion,
      addedAnswerOptions: undefined,
      removedAnswerOptions: undefined,
      updatedAnswerOptions: undefined,
    }),
  },
  {
    isSatisfiedBy: (updatedQuestion, newQuestion, addedAnswerOptions) =>
      updatedQuestion.id === newQuestion.id && addedAnswerOptions.length > 0,
    event: (newQuestion, addedAnswerOptions) => ({
      name: Event.AnswerOptionsWereAdded,
      question: newQuestion,
      addedAnswerOptions,
      removedAnswerOptions: undefined,
      updatedAnswerOptions: undefined,
    }),
  },
  {
    isSatisfiedBy: (updatedQuestion, newQuestion, ___, removedAnswerOptions) =>
      updatedQuestion.id === newQuestion.id && removedAnswerOptions.length > 0,
    event: (newQuestion, _, removedAnswerOptions) => ({
      name: Event.AnswerOptionsWereRemoved,
      question: newQuestion,
      removedAnswerOptions,
      addedAnswerOptions: undefined,
      updatedAnswerOptions: undefined,
    }),
  },
  {
    isSatisfiedBy: (
      updatedQuestion,
      newQuestion,
      ___,
      ____,
      updatedAnswerOptions
    ) =>
      updatedQuestion.id === newQuestion.id && updatedAnswerOptions.length > 0,
    event: (newQuestion, _, __, updatedAnswerOptions) => ({
      name: Event.AnswerOptionsWereUpdated,
      question: newQuestion,
      removedAnswerOptions: undefined,
      addedAnswerOptions: undefined,
      updatedAnswerOptions,
    }),
  },
];

export const execute = (
  updatedQuestion: Question.t,
  newQuestion: Question.t
): t[] => {
  const oldKeys = new Set(updatedQuestion.answerOptions.map((a) => a.id));
  const newKeys = new Set(newQuestion.answerOptions.map((a) => a.id));
  const addedAnswerOptions = newQuestion.answerOptions.filter(
    (a) => !oldKeys.has(a.id)
  );
  const removedAnswerOptions = updatedQuestion.answerOptions.filter(
    (a) => !newKeys.has(a.id)
  );

  const updatedAnswerOptions = newQuestion.answerOptions.filter((newAO) => {
    const oldAO = updatedQuestion.answerOptions.find(
      (ao) => ao.id === newAO.id
    );
    return (
      oldAO &&
      (oldAO.answer !== newAO.answer || oldAO.isCorrect !== newAO.isCorrect)
    );
  });

  return specs.reduce((events, spec) => {
    if (
      spec.isSatisfiedBy(
        updatedQuestion,
        newQuestion,
        addedAnswerOptions,
        removedAnswerOptions,
        updatedAnswerOptions
      )
    ) {
      events.push(
        spec.event(
          newQuestion,
          addedAnswerOptions,
          removedAnswerOptions,
          updatedAnswerOptions
        )
      );
    }
    return events;
  }, [] as t[]);
};
