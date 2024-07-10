import { expect, test, describe } from "bun:test";
import type { CreateQuestionCommand, UpdateQuestionCommand, QuestionAction } from "../../../src/quiz-catalog";
import { Actions, Commands, handle } from "../../../src/quiz-catalog";
import { Question, QuestionId } from "../../../src/quiz-catalog/question/core";

describe('question core', () => {
  describe('insert question', () => {
    test('should decide to insert question and its answer options actions', () => {
      const command: CreateQuestionCommand = {
        name: Commands.CREATE_QUESTION,
        data: {
          id: crypto.randomUUID(),
          prompt: "What is OOP?",
          answerOptions: [
            {
              id: crypto.randomUUID(),
              answer: "object composition",
              correct: true
            },
            {
              id: crypto.randomUUID(),
              answer: "function composition",
              correct: false
            },
          ]
        }
      }
      const expectedActions: QuestionAction[] = [
        {
          name: Actions.INSERT_QUESTION,
          data: {
            id: command.data.id,
            prompt: command.data.prompt,
            answerOptions: command.data.answerOptions
          }
        },
        {
          name: Actions.INSERT_ANSWER_OPTIONS,
          data: {
            questionId: command.data.id,
            answerOptions: command.data.answerOptions
          }
        }
      ]
      const actions = handle(command);
      expect(actions).toStrictEqual(expectedActions);
    });
  });

  describe("update question", () => {
    test("should decide nothing when there's no change", () => {
      const question: Question.t = {
        id: crypto.randomUUID() as QuestionId.t,
        prompt: "What is OOP?",
        answerOptions: [
          {
            id: crypto.randomUUID(),
            answer: "object composition",
            correct: true
          },
          {
            id: crypto.randomUUID(),
            answer: "function composition",
            correct: false
          },
        ]
      }

      const command: UpdateQuestionCommand = {
       name: Commands.UPDATE_QUESTION,
       data: {
        id: question.id,
        prompt: question.prompt,
        answerOptions: question.answerOptions
       }
      }

      const actions = handle(command, question);

      expect(actions.length).toEqual(0);
    });

    test("should decide to update the question when prompt changes", () => {
      const question: Question.t = {
        id: crypto.randomUUID() as QuestionId.t,
        prompt: "What is OOP?",
        answerOptions: [
          {
            id: crypto.randomUUID(),
            answer: "object composition",
            correct: true
          },
          {
            id: crypto.randomUUID(),
            answer: "function composition",
            correct: false
          },
        ]
      }

      const command: UpdateQuestionCommand = {
       name: Commands.UPDATE_QUESTION,
       data: {
        id: question.id,
        prompt: "What is Object-Oriented Programming?",
        answerOptions: question.answerOptions
       }
      }

      const actions = handle(command, question);

      expect(actions.length).toEqual(1);
      expect(actions[0].name).toEqual(Actions.UPDATE_QUESTION);
    });

    test("should decide to update the answer options when change", () => {
      const question: Question.t = {
        id: crypto.randomUUID() as QuestionId.t,
        prompt: "What is OOP?",
        answerOptions: [
          {
            id: crypto.randomUUID(),
            answer: "object composition",
            correct: true
          },
          {
            id: crypto.randomUUID(),
            answer: "function composition",
            correct: true
          },
        ]
      }

      const command: UpdateQuestionCommand = {
       name: Commands.UPDATE_QUESTION,
       data: {
        id: question.id,
        prompt: "What is OOP?",
        answerOptions: [{
          id: question.answerOptions[0].id,
          answer: "objects composition",
          correct: true
        },{
          id: question.answerOptions[1].id,
          answer: question.answerOptions[1].answer,
          correct: false
        }]
       }
      }

      const actions = handle(command, question);

      expect(actions.length).toEqual(1);
      expect(actions[0].name).toEqual(Actions.UPDATE_ANSWER_OPTIONS);
    });

    test("should decide to update the question and answer options", () => {
      const question: Question.t = {
        id: crypto.randomUUID() as QuestionId.t,
        prompt: "What is OOP?",
        answerOptions: [
          {
            id: crypto.randomUUID(),
            answer: "object composition",
            correct: true
          },
          {
            id: crypto.randomUUID(),
            answer: "function composition",
            correct: true
          },
        ]
      }

      const command: UpdateQuestionCommand = {
       name: Commands.UPDATE_QUESTION,
       data: {
        id: question.id,
        prompt: "What is Object-Oriented Programming?",
        answerOptions: [{
          id: question.answerOptions[0].id,
          answer: "objects composition",
          correct: true
        },{
          id: question.answerOptions[1].id,
          answer: question.answerOptions[1].answer,
          correct: false
        }]
       }
      }

      const actions = handle(command, question);

      expect(actions.length).toEqual(2);
      expect(actions[0].name).toEqual(Actions.UPDATE_QUESTION);
      expect(actions[1].name).toEqual(Actions.UPDATE_ANSWER_OPTIONS);
    });

    test("should decide to remove answer options", () => {
      const question: Question.t = {
        id: crypto.randomUUID() as QuestionId.t,
        prompt: "What is OOP?",
        answerOptions: [
          {
            id: crypto.randomUUID(),
            answer: "objects composition",
            correct: true
          },
          {
            id: crypto.randomUUID(),
            answer: "function composition",
            correct: true
          },
        ]
      }

      const command: UpdateQuestionCommand = {
        name: Commands.UPDATE_QUESTION,
        data: {
         id: question.id,
         prompt: "What is OOP?",
         answerOptions: [{
           id: question.answerOptions[0].id,
           answer: "objects composition",
           correct: true
         }]
        }
       }
 
      const actions = handle(command, question);
      expect(actions.length).toEqual(1);
      expect(actions[0].name).toEqual(Actions.REMOVE_ANSWER_OPTIONS);
    })
  });
});