import { describe, beforeAll, expect, test, beforeEach } from "bun:test";
import { Database } from "bun:sqlite";
import { Question, BunSqliteDBQuestions } from "../../src/quiz-catalog";

describe("bun sqlite questions", () => {
  let db: Database;
  beforeAll(() => {
    db = new Database(":memory:");
  });

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

  test("create question", () => {
    const question: Question.t = {
      id: crypto.randomUUID(),
      prompt: "what is oop?",
      answerOptions: [{
        id: crypto.randomUUID(),
        answer: "Objects composition",
        isCorrect: true
      },{
        id: crypto.randomUUID(),
        answer: "Functions composition",
        isCorrect: false
      }],
    };
    BunSqliteDBQuestions.saveQuestion(db, question);
    const persistedQuestion = BunSqliteDBQuestions.getQuestion(db, question.id);
    expect(persistedQuestion).not.toBeUndefined();
    expect(persistedQuestion).toStrictEqual(question);
  });
});
