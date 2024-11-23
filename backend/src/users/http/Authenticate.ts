import CreateRouter, { type Router } from "$service/Router.ts";
import Authenticate from "../mutations/Authenticate.ts";
import tryCatch from "$utils/tryCatch.ts";
import type { Context } from "hono";

const $inject = [CreateRouter, Authenticate];

function AuthenticateUser(router: Router, authenticate: ReturnType<typeof Authenticate>) {
  return router.post("/auth", async (c: Context) => {
    const { username, password } = await c.req.json();
    const [token, error] = await tryCatch(() => authenticate(username, password));

    if (error || !token) {
      return c.json({ error: "Authentication failed" }, 401);
    }

    return c.json({ token });
  });
}

export default Object.assign(AuthenticateUser, { $inject });
