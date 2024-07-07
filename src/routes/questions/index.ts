import { Hono } from "hono";
import { AnswerOption, Question } from "../../quiz-catalog";
import { createQuestion, updateQuestion } from "../../quiz-catalog/question.shell.service";
import { db } from "../../config/db";
import { getQuestion } from "../../quiz-catalog/bun-sqlite-questions";

const questions = new Hono();

questions.get("/:id", async (c) => {
  const id = await c.req.param("id")
  const question = getQuestion(db, id)
  return c.json(question, 200)
})

questions.post("/", async (c) => {
  const payload = await c.req.json()
  const answerOptions = payload.answerOptions.map(
    (p: any) => AnswerOption.make(crypto.randomUUID(), p.answer, p.isCorrect)
  )
  let question: Question.t = Question.make(crypto.randomUUID(), payload.prompt)
  question.answerOptions = answerOptions
  
  createQuestion(db, question)
  return c.json(question, 201)
})

questions.put("/:id", async(c) => {
  const id = await c.req.param('id');
  const payload = await c.req.json()
  updateQuestion(db, id, payload)
  return c.json(payload, 201)
})

questions.delete("/", async () => {
  
})

export default questions