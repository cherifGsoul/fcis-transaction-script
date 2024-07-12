import { Hono } from 'hono';
import { questions } from './quiz-catalog/routes';
import identityAccess from './identityaccess/routes';
import { Kysely } from 'kysely';
import { KDatabase } from './config/db';

type Bindings = {
  db: Kysely<KDatabase>;
};

const app = new Hono<{ Bindings: Bindings }>();

app.route('/questions', questions);
app.route('/', identityAccess);

export default app;