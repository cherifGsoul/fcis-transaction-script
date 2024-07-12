import { Hono } from 'hono';
import { SignIn } from './views/SignIn';
import { validator } from 'hono/validator';
import { SafeParseReturnType, typeToFlattenedError, z } from 'zod';

const identityAccess = new Hono();

const signInFormSchema = z.object({
  emailAddress: z.string().email(),
  password: z.string().min(4).max(20),
});

type SignInForm = z.infer<typeof signInFormSchema>;

identityAccess.get('/signing', async (c) => {
  return c.html(
    <SignIn
      data={undefined}
      errors={{
        formErrors: [],
        fieldErrors: {},
      }}
    />
  );
});

identityAccess.post(
  '/signing',
  validator('form', (value: SignInForm, c) => {
    const parsed: SafeParseReturnType<
      { emailAddress: string; password: string },
      SignInForm
    > = signInFormSchema.safeParse(value);
    if (!parsed.success) {
      const errors: typeToFlattenedError<
        { emailAddress: string; password: string },
        string
      > = parsed.error.flatten();
      return c.html(<SignIn data={value} errors={errors} />);
    }
    return parsed.data;
  }),
  async (c) => {
    const formData = c.req.valid('form');
    /**
     * @todo handle sign in
     */
    return c.html(
      <SignIn
        data={undefined}
        errors={{
          formErrors: [],
          fieldErrors: {},
        }}
      />
    );
  }
);

export default identityAccess;
