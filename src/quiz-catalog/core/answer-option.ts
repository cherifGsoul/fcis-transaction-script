export type t = {
  id: string;
  answer: string;
  isCorrect: boolean;
}

export const make = (id: string, answer: string, isCorrect: boolean) => ({
  id,
  answer,
  isCorrect,
});