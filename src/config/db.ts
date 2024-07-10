import { Database } from "bun:sqlite";
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Kyselify } from "drizzle-orm/kysely";
import { answerOptions, questions } from "./schema";
import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";


export const db = new Database("quizr.db");

export const drzleDb = drizzle(db);

interface KDatabase {
  questions: Kyselify<typeof questions>
  answerOptions: Kyselify<typeof answerOptions>
}

export const kyselyDb = new Kysely<KDatabase>({
  dialect: new BunSqliteDialect({
    database: db
  }),
  plugins: [
    new ParseJSONResultsPlugin(),
    new CamelCasePlugin()
  ]
})