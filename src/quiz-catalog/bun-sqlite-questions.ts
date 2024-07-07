import { Database } from "bun:sqlite";
import { AnswerOption, Question } from "./core";

export const getQuestion = (db: Database, id: string) => {
  const stmt = db.query(`SELECT
  q.id AS question_id,
  q.prompt AS prompt,
  CASE
      WHEN COUNT(ao.id) > 0 THEN
          JSON_GROUP_ARRAY(
              JSON_OBJECT(
                  'id', ao.id,
                  'answer', ao.answer,
                  'isCorrect', ao.is_correct
              )
          )
      ELSE
          '[]'
  END AS answerOptions
FROM
  questions q
LEFT JOIN
  answer_options ao ON q.id = ao.question_id
  WHERE q.id = $id
GROUP BY
  q.id
  `);

  const maybeQuestion: any = stmt.get({ $id: id });

  if (!maybeQuestion) {
    throw new Error("Question not found");
  }

  const q = {
    id: maybeQuestion.question_id,
    prompt: maybeQuestion.prompt,
    answerOptions: JSON.parse(maybeQuestion.answerOptions).map((ao) => ({
      ...ao,
      isCorrect: ao.isCorrect === 1 ? true : false,
    })),
  };

  return q;
};

export const saveQuestion = (db: Database, question: Question.t) => {
  const insertQuestionStmt = db.prepare(
    "INSERT INTO questions (id, prompt) values ($id, $prompt)"
  );
  const insertAnswerOptionStmt = db.prepare(
    "INSERT INTO answer_options (id, answer, is_correct, question_id) values ($id, $answer, $isCorrect, $questionId)"
  );

  const insertOptions = db.transaction((answerOptions) => {
    answerOptions.forEach((ao) => {
      insertAnswerOptionStmt.run(ao);
    });
  });

  const insertQuestions = db.transaction((answerOptions) => {
    insertQuestionStmt.run(question.id, question.prompt);
    insertOptions(answerOptions);
  });

  const dbOptions = question.answerOptions.map((ao) => ({
    $id: ao.id,
    $answer: ao.answer,
    $isCorrect: ao.isCorrect ? 1 : 0,
    $questionId: question.id,
  }));

  insertQuestions(dbOptions);
};

export function updateQuestionPrompt(db: Database, newQuestion: Question.t) {
  const sql = `
  UPDATE questions
  SET prompt = $prompt
  WHERE id = $id
  `;

  const stmt = db.prepare(sql);
  stmt.run({ $prompt: newQuestion.prompt, $id: newQuestion.id });
}

export function addAnswerOption(
  db: Database,
  existingQuestion: Question.t,
  ao: AnswerOption.t
) {
  const insertAnswerOptionStmt = db.prepare(
    "INSERT INTO answer_options (id, answer, is_correct, question_id) values ($id, $answer, $isCorrect, $questionId)"
  );

  insertAnswerOptionStmt.run({
    $id: ao.id,
    $answer: ao.answer,
    $isCorrect: ao.isCorrect ? 1 : 0,
    $questionId: existingQuestion.id,
  });
}

export function removeAnswerOption(
  db: Database,
  persistedQuestion: Question.t,
  ao: AnswerOption.t
) {
  const deleteStmt = db.prepare(
    "DELETE FROM answer_options WHERE id = $id AND question_id = $questionId"
  );
  deleteStmt.run({ $id: ao.id, $questionId: persistedQuestion.id });
}

export function updateAnswerOption(
  db: Database,
  persistedQuestion: Question.t,
  ao: AnswerOption.t
) {
  const sql = `
    UPDATE answer_options
    SET answer = $answer,
        is_correct = $isCorrect
    WHERE id = $id
    AND question_id = $questionId
  `;

  const stmt = db.prepare(sql);

  stmt.run({
    $id: ao.id,
    $answer: ao.answer,
    $isCorrect: ao.isCorrect,
    $questionId: persistedQuestion.id,
  });
}
