import type { ChatCompletionTool } from "openai/resources/chat/completions";

const createTaskSchema: ChatCompletionTool = {
  type: "function",
  function: {
    name: "create_task",
    description: "Create a new task with the given details",
    parameters: {
      type: "object",
      properties: {
        event: { type: "string", description: "The name or title of the task" },
        date: {
          type: "string",
          description: "The date of the task in YYYY-MM-DD format",
        },
        time: {
          type: "string",
          description: "The time of the task in HH:MM format",
        },
        notes: {
          type: "string",
          description: "Additional notes or details about the task",
          default: "",
        },
      },
      required: ["event", "date", "time"],
      additionalProperties: false,
    },
  },
};

export default createTaskSchema;
