import { expect, test, describe } from "bun:test";
import {
  AnswerOption,
  Question,
  UpdateQuestion,
} from "../../../src/quiz-catalog";

describe("question", () => {
  describe("update question", () => {
    test("no change", () => {
      const updatedQuestion = Question.make(
        crypto.randomUUID(),
        "what is OOP?"
      );
      const events = UpdateQuestion.execute(updatedQuestion, updatedQuestion);
      expect(events).toBeEmpty();
    });

    test("update question only", () => {
      const updatedQuestion = Question.make(
        crypto.randomUUID(),
        "what is OOP?"
      );
      const newQuestion = Question.make(
        updatedQuestion.id,
        "what is Object-Oriented Programming?"
      );
      const events = UpdateQuestion.execute(updatedQuestion, newQuestion);
      expect(events.length).toEqual(1);
      const maybeEvent = events.find((e) => {
        return e.name === UpdateQuestion.Event.QuestionPromptWasUpdated;
      });
      expect(maybeEvent).not.toBeUndefined();
      expect(maybeEvent?.addedAnswerOptions).toBeUndefined();
      expect(maybeEvent?.removedAnswerOptions).toBeUndefined();
    });

    test("add answer option only", () => {
      const updatedQuestion = Question.make(
        crypto.randomUUID(),
        "what is OOP?"
      );
      const addedAnswerOption = AnswerOption.make(
        crypto.randomUUID(),
        "object composition",
        true
      );
      let newQuestion = Question.addAnswerOption(
        updatedQuestion,
        addedAnswerOption
      );
      const events = UpdateQuestion.execute(updatedQuestion, newQuestion);
      expect(events.length).toEqual(1);
      const maybeEvent = events.find((e) => {
        return e.name === UpdateQuestion.Event.AnswerOptionsWereAdded;
      });
      expect(maybeEvent).not.toBeUndefined();
      expect(maybeEvent?.question).toStrictEqual(newQuestion);
      expect(maybeEvent?.addedAnswerOptions).toContain(addedAnswerOption);
      expect(maybeEvent?.removedAnswerOptions).toBeUndefined();
    });

    test("remove answer option only", () => {
      let initialQuestion = Question.make(crypto.randomUUID(), "what is OOP?");
      const addedAnswerOption = AnswerOption.make(
        crypto.randomUUID(),
        "object composition",
        true
      );
      let updatedQuestion = Question.addAnswerOption(
        initialQuestion,
        addedAnswerOption
      );
      let updatedNewQuestion = Question.removeAnswerOption(
        updatedQuestion,
        addedAnswerOption
      );
      const events = UpdateQuestion.execute(
        updatedQuestion,
        updatedNewQuestion
      );
      expect(events.length).toEqual(1);
      const maybeEvent = events.find((e) => {
        return e.name === UpdateQuestion.Event.AnswerOptionsWereRemoved;
      });
      expect(maybeEvent).not.toBeUndefined();
      expect(maybeEvent?.question).toStrictEqual(updatedNewQuestion)
      expect(maybeEvent?.question.answerOptions).not.toContain(addedAnswerOption);
      expect(maybeEvent?.addedAnswerOptions).toBeUndefined();
    });

    test("update question and add answer option", () => {
      const updatedQuestion = Question.make(
        crypto.randomUUID(),
        "what is OOP?"
      );
      const newQuestion = Question.make(
        updatedQuestion.id,
        "what is Object-Oriented Programming?"
      );
      const addedAnswerOption = AnswerOption.make(
        crypto.randomUUID(),
        "object composition",
        true
      );
      const updatedNewQuestion = Question.addAnswerOption(
        newQuestion,
        addedAnswerOption
      );
      const events = UpdateQuestion.execute(
        updatedQuestion,
        updatedNewQuestion
      );
      expect(events.length).toEqual(2);
      const maybeEvent1 = events.find((e) => {
        return e.name === UpdateQuestion.Event.QuestionPromptWasUpdated;
      });
      expect(maybeEvent1).not.toBeUndefined();
      expect(maybeEvent1?.question).toStrictEqual(updatedNewQuestion);
      expect(maybeEvent1?.addedAnswerOptions).toBeUndefined()
      expect(maybeEvent1?.removedAnswerOptions).toBeUndefined();


      const maybeEvent2 = events.find((e) => {
        return e.name === UpdateQuestion.Event.AnswerOptionsWereAdded;
      });
      expect(maybeEvent2).not.toBeUndefined();
      expect(maybeEvent2?.question).toStrictEqual(updatedNewQuestion);
      expect(maybeEvent2?.addedAnswerOptions).toContain(addedAnswerOption)
      expect(maybeEvent2?.removedAnswerOptions).toBeUndefined();

    });

    test("update question and remove answer option", () => {
      const updatedQuestion = Question.make(
        crypto.randomUUID(),
        "what is OOP?"
      );
      const addedAnswerOption = AnswerOption.make(
        crypto.randomUUID(),
        "object composition",
        true
      );
      let questionWithAddedOption = Question.addAnswerOption(
        updatedQuestion,
        addedAnswerOption
      );
      const updatedNewQuestion = Question.make(questionWithAddedOption.id, "What is Object-Oriented Programming?")
      const events = UpdateQuestion.execute(
        questionWithAddedOption,
        updatedNewQuestion
      );
      expect(events.length).toEqual(2);
      const maybeEvent1 = events.find((e) => {
        return e.name === UpdateQuestion.Event.QuestionPromptWasUpdated;
      });
      expect(maybeEvent1).not.toBeUndefined();
      expect(maybeEvent1?.question).toStrictEqual(updatedNewQuestion);
      expect(maybeEvent1?.addedAnswerOptions).toBeUndefined()
      expect(maybeEvent1?.removedAnswerOptions).toBeUndefined();


      const maybeEvent2 = events.find((e) => {
        return e.name === UpdateQuestion.Event.AnswerOptionsWereRemoved;
      });
      expect(maybeEvent2).not.toBeUndefined();
      expect(maybeEvent2?.question).toStrictEqual(updatedNewQuestion);
      expect(maybeEvent2?.addedAnswerOptions).toBeUndefined()
      expect(maybeEvent2?.removedAnswerOptions).toContain(addedAnswerOption);
    });
  });
});