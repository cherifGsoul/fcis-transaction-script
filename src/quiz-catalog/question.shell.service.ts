import { BunSqliteDBQuestions } from ".";
import { UpdateQuestion, type Question } from "./core";
import Database from "bun:sqlite";

export const createQuestion = (db: Database, question: Question.t) => {
  BunSqliteDBQuestions.saveQuestion(db, question);
};

export const getQuestionForId = (db: Database, id: string) => {
  return BunSqliteDBQuestions.getQuestion(db, id);
};

// Define the type for the event handler functions
type EventHandler = (
  db: Database,
  persistedQuestion: Question.t,
  newQuestion: Question.t,
  event: UpdateQuestion.t
) => void;

// Define the type for the event handlers map
type EventHandlersMap = Map<UpdateQuestion.Event, EventHandler>;

// Define the event handlers map
const eventHandlers: EventHandlersMap = new Map([
  [
    UpdateQuestion.Event.QuestionPromptWasUpdated,
    (db, _, newQuestion) =>
      BunSqliteDBQuestions.updateQuestionPrompt(db, newQuestion),
  ],
  [
    UpdateQuestion.Event.AnswerOptionsWereAdded,
    (db, persistedQuestion, _, event) => {
      if (event.addedAnswerOptions) {
        event.addedAnswerOptions.forEach((ao: any) => {
          BunSqliteDBQuestions.addAnswerOption(db, persistedQuestion, ao);
        });
      }
    },
  ],
  [
    UpdateQuestion.Event.AnswerOptionsWereRemoved,
    (db, persistedQuestion, _, event) => {
      if (event.removedAnswerOptions) {
        event.removedAnswerOptions.forEach((ao: any) => {
          BunSqliteDBQuestions.removeAnswerOption(db, persistedQuestion, ao);
        });
      }
    },
  ],
  [
    UpdateQuestion.Event.AnswerOptionsWereUpdated,
    (db, persistedQuestion, _, event) => {
      if (event.updatedAnswerOptions) {
        event.updatedAnswerOptions.forEach((ao: any) => {
          BunSqliteDBQuestions.updateAnswerOption(db, persistedQuestion, ao);
        });
      }
    },
  ],
]);

export function updateQuestion(
  db: Database,
  id: string,
  newQuestion: Question.t
) {
  // I/O
  const persistedQuestion = BunSqliteDBQuestions.getQuestion(db, id);

  // Pure
  const events = UpdateQuestion.execute(persistedQuestion, newQuestion);

  // I/O
  const trx = db.transaction(() => {
    events.forEach((event) => {
      const handler = eventHandlers.get(event.name);
      if (handler) {
        handler(db, persistedQuestion, newQuestion, event);
      }
    });
  });

  trx();
}
