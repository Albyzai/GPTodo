import { OpenAI } from "openai";
import type {
  ChatCompletionRequestMessage,
  ChatTool,
  ToolFunction,
  TranscriptionResponse,
} from "./types.ts";

function CreateClient(tools: ChatTool[]) {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

  const _tools: Map<string, ToolFunction> = new Map(
    tools.map((t) => [t.schema.function.name, t.function]),
  );
  async function textToSpeech(
    text: string,
  ): Promise<ReadableStream<Uint8Array>> {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
      response_format: "mp3",
    });

    if (response.body === null) {
      throw new Error("Failed to generate speech: response body is null");
    }

    return response.body;
  }

  async function chat(
    messages: ChatCompletionRequestMessage[],
    language: string,
  ): Promise<string> {
    const currentDate = new Date();
    const settingsMessage: OpenAI.Chat.ChatCompletionMessageParam = {
      role: "system",
      content:
        `You are a helpful planning assistant. Your goal is to help create and manage items for a todo list. Always respond in ${language}. Use appropriate date and time formats for the selected language. If you need more information to create a task, ask for it.`,
    };
    const dateMessage: OpenAI.Chat.ChatCompletionMessageParam = {
      role: "system",
      content:
        `Current date and time: ${currentDate.toISOString()}. Take careful note of what is planned when`,
    };

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [settingsMessage, dateMessage, ...messages],
        tools: tools.map((t) => t.schema),
        tool_choice: "auto",
      });

      const choice = completion.choices[0];
      if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
        for (const { type, function: fn } of choice.message.tool_calls) {
          if (type === "function") {
            const cb = _tools.get(fn.name);
            if (!cb) throw new Error(`No tool found for ${fn.name}`);
            const args = JSON.parse(fn.arguments);
            console.log("args", args);
            await cb(args);
          }
        }
      }
      return choice.message.content ||
        "I couldn't process that information. Could you please provide more details?";
    } catch (error) {
      console.error("An error occurred:", error);
      return "I'm sorry, I couldn't process that request. Could you please try again?";
    }
  }

  async function transcribeAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TranscriptionResponse = await response.json();
      return data.text;
    } catch (error) {
      console.log("error occurred", error);
      throw new Error("Failed to transcribe audio");
    }
  }

  return {
    textToSpeech,
    chat,
    transcribeAudio,
  };
}

export default function createClient() {
  return CreateClient;
}
