import { typeToFlattenedError } from 'zod';
import { Layout } from '../../shared/views/Layout';

export const SignIn = ({
  data,
  errors,
}: {
  data: Record<string, string> | undefined;
  errors: typeToFlattenedError<
    { emailAddress: string; password: string },
    string
  >;
}) => {
  return (
    <Layout>
      <section class="hero is-fullheight">
        <div class="hero-body">
          <div class="container">
            <div class="columns is-vcentered is-centered">
              <div class="column is-4-desktop">
                <div class="box">
                  <h2 class="title is-4">Sign in</h2>

                  <form method="post">
                    <div class="field">
                      <label class="label">Email Address</label>
                      <div class="control">
                        <input
                          name="emailAddress"
                          class="input"
                          type="email"
                          placeholder="Email Address"
                          value={data && data?.emailAddress}
                        />
                      </div>
                      <p class="help is-danger">{errors && errors.fieldErrors?.emailAddress}</p>

                    </div>

                    <div class="field">
                      <label class="label">Password</label>
                      <div class="control">
                        <input
                          name="password"
                          class="input"
                          type="password"
                          placeholder="Password"
                        />
                      </div>
                      <p class="help is-danger">{errors && errors.fieldErrors?.password}</p>
                    </div>

                    <div class="field">
                      <button class="button is-primary">Sign in</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
