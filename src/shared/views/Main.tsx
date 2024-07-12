import { html } from "hono/html"

export const Layout = (props: { children?: any }) => {
  return (
    html`<!DOCTYPE html>
    <html lang="en" data-theme="light">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Quizr</title>
        <script src="http://localhost:5173/@vite/client" type="module"></script>
        <script src="http://localhost:5173/resources/js/index.js", type="module"></script>
      </head>
      <body hx-boost="true">
        <div class="columns is-gapless">
          <aside class="column is-2">
            <aside class="menu">
              <ul class="menu-list">
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Customers</a></li>
              </ul>
          </aside>
          </aside>
          <main class="column is-10"> 
          ${props.children}
          </main>
        </div>
      </body>
    </html>`
  )
}