import { describe, test } from "bun:test"
import { Commands, CreateQuestionCommand, handle, handleGetQuestion, handleQuestionCommand } from "../../../src/quiz-catalog";

describe("question shell", () => {
  test("insert question", async () => {
    const command: CreateQuestionCommand = {
      name: Commands.CREATE_QUESTION,
      data: {
        id: crypto.randomUUID(),
        prompt: "what is OOP?",
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
    await handleQuestionCommand(command);
    const questionData = await handleGetQuestion(command.data.id);
    console.log(questionData)
  });
});