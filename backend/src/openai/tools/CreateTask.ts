import { parse } from "date-fns";
import schema from "./CreateTask.schema.ts";
import type { ChatTool } from "../types.ts";

type CreateTaskArgs = {
  event: string;
  date: string;
  time: string;
  notes?: string;
};

function createTask(args: CreateTaskArgs) {
  const { event, date, time, notes } = args;
  const taskDate = parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date());
  // If the parsed date is before the current date, assume it's for next year

  console.log("taskDate.getTime()", taskDate.getTime());

  // const responseText = tasks.map(task =>
  //     `I've added a task for ${task.content.split('\n')[0]} on ${new Date(task.timestamp).toLocaleString(language)}.`
  // ).join('\n');
  return {
    content: `${event}\n${notes || ""}`,
    timestamp: taskDate.getTime(),
  };
}

const Tool: ChatTool<CreateTaskArgs> = {
  schema,
  function: createTask,
};

export default Tool;
