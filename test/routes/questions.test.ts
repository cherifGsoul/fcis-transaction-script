import { describe, test, expect, beforeEach } from "bun:test";
import app from "../../src/index";
import clone from "lodash.clone";
import { db } from "../../src/config/db";
import merge from "lodash.merge";

describe("questions route", () => {
  beforeEach(() => {
    db.query("DROP TABLE IF EXISTS questions").run();

    db.query("DROP TABLE IF EXISTS answer_options").run();

    const createQuestionsTable = `
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL
      );
    `;

    const createAnswerOptionsTable = `CREATE TABLE IF NOT EXISTS answer_options (
      id TEXT PRIMARY KEY,
      answer TEXT NOT NULL,
      is_correct INTEGER DEFAULT 0,
      question_id TEXT,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );`;

    db.query(createQuestionsTable).run();
    db.query(createAnswerOptionsTable).run();
  });

  test("update question without changes", async () => {
    const createdQuestionResponse = await app.request("/questions", {
      method: "POST",
      body: JSON.stringify({
        prompt: "What is OOP?",
        answerOptions: [{ answer: "object composition", correct: true }],
      }),
    });

    console.log(createdQuestionResponse)

    const createdQuestion = await createdQuestionResponse.json()

    await app.request(`/questions/${createdQuestion.id}`, {
      method: "PUT",
      body: JSON.stringify(clone(createdQuestion))
    })


    const persistedQuestion = await app.request(`/questions/${createdQuestion.id}`, {method: "GET"})
    expect(await persistedQuestion.json()).toStrictEqual(createdQuestion)
  });

  // test("update question prompt", async () => {
  //   const createdQuestionResponse = await app.request("/questions", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       prompt: "What is OOP?",
  //       answerOptions: [{ answer: "object composition", isCorrect: true }],
  //     }),
  //   });

  //   const createdQuestion = await createdQuestionResponse.json();
  //   const expectedQuestion = merge(clone(createdQuestion), {prompt: "What is object-oriented Programming"})

  //    await app.request(`/questions/${createdQuestion.id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(expectedQuestion)
  //   })


  //   const persistedQuestionResponse = await app.request(`/questions/${createdQuestion.id}`, {method: "GET"})
  //   const persistedQuestion = await persistedQuestionResponse.json()
  //   expect(persistedQuestion).toEqual(expectedQuestion)
  // });

  // test("add answer option", async () => {
  //   const createdQuestionResponse = await app.request("/questions", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       prompt: "What is OOP?",
  //       answerOptions: [{ answer: "object composition", isCorrect: true }],
  //     }),
  //   });

  //   const createdQuestion = await createdQuestionResponse.json();
  //   const expectedQuestion = merge(createdQuestion, {
  //     answerOptions: [{ answer: "function composition", isCorrect: false }],
  //   })

  //   await app.request(`/questions/${createdQuestion.id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(expectedQuestion)
  //   })

  //   const persistedQuestionResponse = await app.request(`/questions/${createdQuestion.id}`, {method: "GET"})
  //   const persistedQuestion = await persistedQuestionResponse.json()
  //   expect(expectedQuestion).toStrictEqual(persistedQuestion)
  // })

  // test("update prompt and add answer option", async () => {
  //   const createdQuestionResponse = await app.request("/questions", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       prompt: "What is OOP?",
  //       answerOptions: [{ answer: "object composition", isCorrect: true }],
  //     }),
  //   });

  //   const createdQuestion = await createdQuestionResponse.json();
  //   const expectedQuestion = merge(createdQuestion, {
  //     prompt: "What is Object-Oriented-Programming?",
  //     answerOptions: [{ answer: "function composition", isCorrect: false }],
  //   })

  //   await app.request(`/questions/${createdQuestion.id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(expectedQuestion)
  //   })

  //   const persistedQuestionResponse = await app.request(`/questions/${createdQuestion.id}`, {method: "GET"})
  //   const persistedQuestion = await persistedQuestionResponse.json()
  //   expect(expectedQuestion).toStrictEqual(persistedQuestion)
  // })
  // test("remove answer option", async () => {
  //   const createdQuestionResponse = await app.request("/questions", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       prompt: "What is OOP?",
  //       answerOptions: [{ answer: "object composition", isCorrect: true }, { answer: "function composition", isCorrect: false }],
  //     }),
  //   });

  //   const createdQuestion = await createdQuestionResponse.json();
  //   const expectedQuestion = merge(createdQuestion, {
  //     answerOptions: [{ answer: "object composition", isCorrect: true }],
  //   })

  //   await app.request(`/questions/${createdQuestion.id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(expectedQuestion)
  //   })

  //   const persistedQuestionResponse = await app.request(`/questions/${createdQuestion.id}`, {method: "GET"})
  //   const persistedQuestion = await persistedQuestionResponse.json()
  //   expect(expectedQuestion).toStrictEqual(persistedQuestion)
  // })

  // test("update question prompt and remove answer option", async () => {
  //   const createdQuestionResponse = await app.request("/questions", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       prompt: "What is OOP?",
  //       answerOptions: [{ answer: "object composition", isCorrect: true }, { answer: "function composition", isCorrect: false }],
  //     }),
  //   });

  //   const createdQuestion = await createdQuestionResponse.json();
  //   const expectedQuestion = merge(createdQuestion, {
  //     prompt: "What is Object-Oriented-Programming?",
  //     answerOptions: [{ answer: "object composition", isCorrect: true }],
  //   })

  //   await app.request(`/questions/${createdQuestion.id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(expectedQuestion)
  //   })

  //   const persistedQuestionResponse = await app.request(`/questions/${createdQuestion.id}`, {method: "GET"})
  //   const persistedQuestion = await persistedQuestionResponse.json()
  //   expect(expectedQuestion).toStrictEqual(persistedQuestion)
  // })

  // test("update answer option", async () => {
  //   const createdQuestionResponse = await app.request("/questions", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       prompt: "What is OOP?",
  //       answerOptions: [{ answer: "object composition", isCorrect: true }],
  //     }),
  //   });

  //   const createdQuestion = await createdQuestionResponse.json();
  //   const expectedQuestion = merge(createdQuestion, {
  //     answerOptions: [{ answer: "objects composition", isCorrect: true }],
  //   })

  //   await app.request(`/questions/${createdQuestion.id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(expectedQuestion)
  //   })

  //   const persistedQuestionResponse = await app.request(`/questions/${createdQuestion.id}`, {method: "GET"})
  //   const persistedQuestion = await persistedQuestionResponse.json()
  //   expect(expectedQuestion).toStrictEqual(persistedQuestion)
  // })
});
