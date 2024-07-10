import { jsonArrayFrom } from "kysely/helpers/sqlite";
import { kyselyDb } from "../../config/db";
import { Actions, AnswerOption, AnswerOptionData, Commands, handle, Question, QuestionCommand, QuestionId } from "./core";

export const handleQuestionCommand = async (command: QuestionCommand): Promise<void> => {
  let question: Question.t | undefined

  // I/O
  if (command.name !== Commands.CREATE_QUESTION) {
    const kyselyQuestion = await kyselyDb
      .selectFrom("questions")
      .where("id", "=", command.data.id)
      .selectAll("questions")
      .select((eb) => [
        jsonArrayFrom(
          eb.selectFrom('answerOptions')
          .select(['answerOptions.id', 'answerOptions.answer', 'answerOptions.correct'])
          .whereRef('answerOptions.question_id', '=', 'questions.id')
          .orderBy('answerOptions.id')
        ).as("answerOptions")
      ]).executeTakeFirstOrThrow()

      question = {
        id: kyselyQuestion.id as QuestionId.t,
        prompt: kyselyQuestion.prompt,
        answerOptions: kyselyQuestion.answerOptions.map((ao) => {
          return {
            id: ao.id,
            answer: ao.answer,
            correct: ao.correct
          } satisfies AnswerOption.t
        })
      }
    }

  // PURE
  const actions = handle(command, question)

  // I/O 
  await kyselyDb.transaction().execute(async (trx) => {
    actions.forEach(async(action) => {
      switch (action.name) {
        case Actions.INSERT_QUESTION:
          await trx.insertInto("questions")
          .values({
            id: action.data.id as string,
            prompt: action.data.prompt as string
          })
          .execute();

          let answerOptions = action.data.answerOptions as Array<AnswerOptionData>

          await trx.insertInto("answerOptions")
          .values(answerOptions.map((ao: AnswerOptionData) => ({
            id: ao.id as string,
            answer: ao.answer as string,
            correct: ao.correct as boolean,
            question_id: action.data.id as string
          })))
          .execute();

          return action.data;
        
        case Actions.UPDATE_QUESTION:
          const questionId = action.data.id as string
          await trx.updateTable("questions")
          .set({
            prompt: action.data.prompt as string,
          })
          .where("id" ,"=", questionId)
          .execute()
        
        case Actions.INSERT_ANSWER_OPTIONS:
          answerOptions = action.data.answerOptions as Array<AnswerOptionData>
          await trx.insertInto("answerOptions")
          .values(answerOptions.map((ao: AnswerOptionData) => ({
            id: ao.id as string,
            answer: ao.answer as string,
            correct: ao.correct as boolean,
            question_id: action.data.id as string
          })))
          .execute();
        
        case Actions.UPDATE_ANSWER_OPTIONS:
          answerOptions = action.data.answerOptions as Array<AnswerOptionData>
          await trx.insertInto("answerOptions")
          .values(answerOptions.map((ao: AnswerOptionData) => ({
            id: ao.id as string,
            answer: ao.answer as string,
            correct: ao.correct as boolean,
            question_id: action.data.id as string
          })))
          .onConflict((oc) =>
            oc.column("id").doUpdateSet((eb) => {
              const keys = Object.keys(answerOptions[0]!) as (keyof AnswerOptionData)[];
              return Object.fromEntries(keys.map((key) => [key, eb.ref(key)]));
            })
          )
          .execute();
        
        case Actions.REMOVE_ANSWER_OPTIONS:
          answerOptions = action.data.answerOptions as Array<AnswerOptionData>
          const ids = answerOptions.map((ao) => ao.id)
          await kyselyDb.deleteFrom("answerOptions")
            .where("id", "in", ids)
            .execute()
        default:
          break;
      }
    })
  })
}