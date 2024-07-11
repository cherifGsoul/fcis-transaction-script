import { Hono } from 'hono';
import { questions } from './routes';
import { Database } from 'bun:sqlite';

type Bindings = {
  db: Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.route('/questions', questions);

export default app;
