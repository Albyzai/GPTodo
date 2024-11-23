import CreateRouter, { type Router } from "$service/Router.ts";
import Client from "$openai/Client.ts";
import CreateTaskTool from "$openai/tools/CreateTask.ts";
import tryCatch from "$utils/tryCatch.ts";
import type { Context } from "hono";
import type { ChatTool } from "$openai/types.ts";
import isAuthorized from "$middleware/auth.ts";

const $inject = [CreateRouter, Client];

function Chat(router: Router, createClient: ReturnType<typeof Client>) {
  return router.post("/chat", isAuthorized, async (c: Context) => {
    const { message } = await c.req.json();
    const tools: ChatTool[] = [CreateTaskTool as unknown as ChatTool];
    const client = createClient(tools);

    // TEMP
    const currentDate = new Date();
    const settingsMessage = {
      role: "system",
      content:
        "You are a helpful planning assistant. Your goal is to help create and manage items for a todo list. Use appropriate date and time formats for the selected language. If you need more information to create a task, ask for it.",
    };
    const dateMessage = {
      role: "system",
      content:
        `Current date and time: ${currentDate.toISOString()}. Take careful note of what is planned when`,
    };

    const messages = [settingsMessage, dateMessage, ...message];
    console.log("messages", messages);
    const [response, error] = await tryCatch(() => client.chat(messages));
    console.log("response", response);
    console.log("error", error);
    if (error) {
      return c.json({ error: "Failed to chat" }, 500);
    }

    return c.json(response);
  });
}

export default Object.assign(Chat, { $inject });
