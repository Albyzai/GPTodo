import textToSpeech from "../../../../api/openai/text-to-speech.ts";
import type { RequestEvent } from "@sveltejs/kit";

export const POST = async ({ request }: RequestEvent) => {
  const data = await request.json();
  console.log("DATA", data);
  const audioStream = await textToSpeech(data.content);

  return new Response(audioStream, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
};
