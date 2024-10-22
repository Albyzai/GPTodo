
import { Hono } from 'hono';
import Router from '$service/Router.ts';
import tasks from '$tasks/module.ts';

const CreateHonoApp = () => new Hono();
export default tasks
  .register(CreateHonoApp, true)
  .after(CreateHonoApp, (app: Hono, resolve) => {
    const router = resolve(Router);
    console.log('ALL ROUTES', router.routes);
    app.route('', router);
    Deno.serve(app.fetch);
});
