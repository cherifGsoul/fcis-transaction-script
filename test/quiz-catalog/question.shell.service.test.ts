import { describe, beforeAll, expect, test, beforeEach } from "bun:test";
import { Database } from "bun:sqlite";
import {
  Question,
  QuestionShellService,
} from "../../src/quiz-catalog";

describe("question service", () => {
  let db: Database;
  beforeAll(() => {
    db = new Database("quizr.db");
  });

  beforeEach(() => {
    db.query("DROP TABLE IF EXISTS questions").run();

    db.query("DROP TABLE IF EXISTS answer_options").run();

    const ddl1 = `
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL
      );
    `;

    const ddl2 = `CREATE TABLE IF NOT EXISTS answer_options (
      id TEXT PRIMARY KEY,
      answer TEXT NOT NULL,
      is_correct INTEGER DEFAULT 0,
      question_id TEXT,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );`;

    db.query(ddl1).run();
    db.query(ddl2).run();
  });

  describe("create question", () => {
    test("create valid question", () => {
      const question: Question.t = {
        id: crypto.randomUUID(),
        prompt: "what is oop?",
        answerOptions: [
          {
            id: crypto.randomUUID(),
            answer: "Objects composition",
            isCorrect: true,
          },
          {
            id: crypto.randomUUID(),
            answer: "Functions composition",
            isCorrect: false,
          },
        ],
      };
      QuestionShellService.createQuestion(db, question);
      const persistedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(persistedQuestion).not.toBeUndefined();
      expect(persistedQuestion).toStrictEqual(question);
    });
  })

  describe("update question", () => {
    test("update question prompt", () => {
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

      QuestionShellService.createQuestion(db, question);
      const persistedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(persistedQuestion).not.toBeUndefined();
      expect(persistedQuestion).toStrictEqual(question);

      const newQuestion = {
        ...persistedQuestion,
        prompt: "What is Object-Oriented Programming?"
      }

      QuestionShellService.updateQuestion(db, persistedQuestion.id, newQuestion);
      let updatedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(updatedQuestion).not.toBeUndefined();

      expect(updatedQuestion).toStrictEqual(newQuestion);
    })

    test("add answer option", () => {
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

      QuestionShellService.createQuestion(db, question);
      const persistedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(persistedQuestion).not.toBeUndefined();
      expect(persistedQuestion).toStrictEqual(question);

      const newQuestion = {
        ...persistedQuestion,
        prompt: "What is Object-Oriented Programming?",
        answerOptions: [
          ...persistedQuestion.answerOptions,
          {
            id: crypto.randomUUID(),
            answer: "logic programming",
            isCorrect: false
          }
        ]
      }

      QuestionShellService.updateQuestion(db, persistedQuestion.id, newQuestion);
      let updatedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(updatedQuestion).not.toBeUndefined();
      expect(updatedQuestion).toStrictEqual(newQuestion);
    })


    test("update prompt and add answer option", () => {
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

      QuestionShellService.createQuestion(db, question);
      const persistedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(persistedQuestion).not.toBeUndefined();
      expect(persistedQuestion).toStrictEqual(question);

      const newQuestion = {
        ...persistedQuestion,
        prompt: "what is object-oriented programming?",
        answerOptions: [
          ...persistedQuestion.answerOptions,
          {
            id: crypto.randomUUID(),
            answer: "logic programming",
            isCorrect: false
          }
        ]
      }

      QuestionShellService.updateQuestion(db, persistedQuestion.id, newQuestion);
      let updatedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(updatedQuestion).not.toBeUndefined();
      expect(updatedQuestion).toStrictEqual(newQuestion);
    })

    test("remove answer option", () => {
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

      QuestionShellService.createQuestion(db, question);
      const persistedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(persistedQuestion).not.toBeUndefined();
      expect(persistedQuestion).toStrictEqual(question);

      const newQuestion = {
        ...persistedQuestion,
        answerOptions: [question.answerOptions[0]]
      }

      QuestionShellService.updateQuestion(db, persistedQuestion.id, newQuestion);
      let updatedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(updatedQuestion).not.toBeUndefined();
      expect(updatedQuestion).toStrictEqual(newQuestion);
    })

    test("update question prompt and remove answer option", () => {
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

      QuestionShellService.createQuestion(db, question);
      const persistedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(persistedQuestion).not.toBeUndefined();
      expect(persistedQuestion).toStrictEqual(question);

      const newQuestion = {
        ...persistedQuestion,
        prompt: "what is Object Oriented Programming",
        answerOptions: []
      }

      QuestionShellService.updateQuestion(db, persistedQuestion.id, newQuestion);
      let updatedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(updatedQuestion).not.toBeUndefined();
      expect(updatedQuestion).toStrictEqual(newQuestion);
    })

    test("update answer option", () => {
      const answerOption1 = {
        id: crypto.randomUUID(),
        answer: "Objects composition",
        isCorrect: true
      }

      const answerOption2 = {
        id: crypto.randomUUID(),
        answer: "Functions composition",
        isCorrect: false
      }

      const question: Question.t = {
        id: crypto.randomUUID(),
        prompt: "what is oop?",
        answerOptions: [answerOption1, answerOption2],
      };

      QuestionShellService.createQuestion(db, question);
      const persistedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(persistedQuestion).not.toBeUndefined();
      expect(persistedQuestion).toStrictEqual(question);

      const updatedAnswerOption2 = {
        ...answerOption2,
        answer: "Composition over inheritence"
      }
      const newQuestion = {
        ...persistedQuestion,
        prompt: "what is Object Oriented Programming",
        answerOptions: [
          answerOption1,
          updatedAnswerOption2
        ]
      }

      QuestionShellService.updateQuestion(db, persistedQuestion.id, newQuestion);
      let updatedQuestion = QuestionShellService.getQuestionForId(db, question.id);
      expect(updatedQuestion).not.toBeUndefined();
      expect(updatedQuestion).toStrictEqual(newQuestion);
    })
  })
});
