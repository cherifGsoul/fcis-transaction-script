import * as AnswerOption from "./answer-option";

export type t = {
  id: string;
  prompt: string;
  answerOptions: Array<AnswerOption.t>;
};


export const make = (id: string, prompt: string) => ({
  id,
  prompt,
  answerOptions: [],
});

export const addAnswerOption = (
  question: t,
  answerOption: AnswerOption.t
): t => {
  return {
    ...question,
    answerOptions: [...question.answerOptions, answerOption],
  };
};

export const removeAnswerOption = (
  question: t,
  answerOption: AnswerOption.t
): t => {
  const options = question.answerOptions.filter(
    (a) => a.id !== answerOption.id
  );
  return {
    ...question,
    answerOptions: options,
  };
};