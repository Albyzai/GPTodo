import CreateRouter, { type Router } from "$service/Router.ts";
import Client from "$openai/Client.ts";
import tryCatch from "$utils/tryCatch.ts";
import type { Context } from "hono";
import isAuthorized from "$middleware/auth.ts";

const $inject = [CreateRouter, Client];

function TextToSpeech(router: Router, createClient: ReturnType<typeof Client>) {
  return router.post("/text-to-speech", isAuthorized, async (c: Context) => {
    const { text } = await c.req.json();
    console.log("TEXT TO SPEECH HIT", text);
    const client = createClient();
    const [audio, error] = await tryCatch(() => client.textToSpeech(text));

    if (error || !audio) {
      return c.json({ error: "Failed to generate speech" }, 500);
    }

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  });
}

export default Object.assign(TextToSpeech, { $inject });
