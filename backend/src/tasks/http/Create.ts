import CreateRouter, { type Router } from '$service/Router.ts'
import Create from '../mutations/Create.ts'
import tryCatch from '$utils/tryCatch.ts'
import type { Context } from 'hono';

const $inject = [CreateRouter, Create];

function CreateTask(router: Router, create: ReturnType<typeof Create>) {
    return router.post('/tasks', async (c: Context) => {
        const { title, description } = await c.req.json();
        const [task, error] = await tryCatch(() => create(title, description));

        if(error || !task) {
            return c.json({ error: 'Failed to create task' }, 500);
        }

        return c.json(task)
    });
}

export default Object.assign(CreateTask, { $inject });