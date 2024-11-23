import CreateRouter, { type Router } from "$service/Router.ts";
import Create from "../mutations/Create.ts";
import tryCatch from "$utils/tryCatch.ts";
import type { Context } from "hono";

const $inject = [CreateRouter, Create];

function CreateUser(router: Router, create: ReturnType<typeof Create>) {
  return router.post("/users", async (c: Context) => {
    const { username, password } = await c.req.json();
    const [user, error] = await tryCatch(() => create(username, password));

    if (error || !user) {
      return c.json({ error: "Failed to create user" }, 500);
    }

    const { password: _, ...safeUser } = user;
    console.log('SAFE USER', safeUser)
    return c.json(safeUser, 201);
  });
}

export default Object.assign(CreateUser, { $inject });
