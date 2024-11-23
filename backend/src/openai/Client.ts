import { OpenAI } from "openai";
import type {
  ChatCompletionRequestMessage,
  ChatTool,
  ToolFunction,
  TranscriptionResponse,
} from "./types.ts";
import tryCatch from "$utils/tryCatch.ts";

export default function CreateClient() {
  return function createClient(tools: ChatTool[] = []) {
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
    ): Promise<string> {
      const [completion, error] = await tryCatch(() =>
        openai.chat.completions.create({
          model: "gpt-4o-2024-08-06",
          messages,
          tools: tools.map((t) => t.schema),
          tool_choice: "auto",
        })
      );

      console.log("COMPLETION", completion);
      if (error || !completion) {
        throw new Error("Failed to generate chat completion");
      }

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
    }

    async function transcribeAudio(audioBlob: File): Promise<string> {
      const [response, error] = await tryCatch(() =>
        openai.audio.transcriptions.create({
          file: audioBlob,
          model: "whisper-1",
        })
      );

      if (error || !response) {
        throw new Error("Failed to transcribe audio");
      }

      const data: TranscriptionResponse = response as TranscriptionResponse;
      return data.text;
    }

    return {
      textToSpeech,
      chat,
      transcribeAudio,
    };
  };
}
