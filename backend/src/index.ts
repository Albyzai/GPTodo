import { Hono } from "hono";
import Router from "$service/Router.ts";
import tasks from "$tasks/module.ts";
import users from "$users/module.ts";

const CreateHonoApp = () => new Hono();
export default tasks
  .extends(users)
  .register(CreateHonoApp, true)
  .after(CreateHonoApp, (app: Hono, resolve) => {
    const router = resolve(Router);
    console.log("ALL ROUTES", router.routes);
    app.route("", router);
    Deno.serve(app.fetch);
  });
