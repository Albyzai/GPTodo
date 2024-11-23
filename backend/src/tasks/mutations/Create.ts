import Task from "$schemas/Task.ts";

export default function CreateTaskMutation() {
  return async (title: string, description: string) => {
    const task = new Task({ title, description });
    console.log("task created", task);
    await task.save();
    return task;
  };
}
