import { json } from "@sveltejs/kit";
import chat from "../../../../api/openai/chat.ts"; // Fixed alias
import textToSpeech from "../../../../api/openai/text-to-speech.ts"; // Fixed alias
import type { RequestEvent } from "@sveltejs/kit";

export const POST = async ({ request }: RequestEvent) => {
  const { messages } = await request.json();
  console.log("MESSAGE SENT", messages);
  const response = await chat(messages);
  console.log('CHAT RESPONSE', response);
  const audioStream = await textToSpeech(response);
  console.log("AUDIO STREAM", audioStream);

  return new Response(audioStream);
  //return json(response);
};
