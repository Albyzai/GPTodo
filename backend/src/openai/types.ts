import type { ChatCompletionTool } from "openai/resources/chat/completions";

export type ChatCompletionRequestMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type Message = {
  message: {
    content: string;
  };
};

export type ChatGPTResponse = {
  choices: Array<Message>;
};

export type TranscriptionResponse = {
  text: string;
};

export type ToolFunction<
  T extends Record<string, unknown> = Record<string, unknown>,
> = (args: T) => Promise<unknown> | unknown;

export type ChatTool<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  schema: ChatCompletionTool;
  function: ToolFunction<T>;
};
