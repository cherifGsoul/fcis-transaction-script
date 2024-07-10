import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./src/config/schema.ts",
  out: "drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "quizr.db",
  },
  verbose: true,
  strict: true,
})