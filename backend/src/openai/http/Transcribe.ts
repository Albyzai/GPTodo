import CreateRouter, { type Router } from "$service/Router.ts";
import Client from "$openai/Client.ts";
import tryCatch from "$utils/tryCatch.ts";
import type { Context } from "hono";
import isAuthorized from "$middleware/auth.ts";

const $inject = [CreateRouter, Client];

function Transcribe(router: Router, createClient: ReturnType<typeof Client>) {
  return router.post("/transcribe", isAuthorized, async (c: Context) => {
    const formData = await c.req.formData();
    const audioFile = formData.get("file") as File;
    console.log("TRANSCRIBE HIT", audioFile);
    if (!audioFile) {
      return c.json({ error: "No audio file provided" }, 400);
    }

    const client = createClient();

    const [text, error] = await tryCatch(() =>
      client.transcribeAudio(audioFile)
    );

    if (error || !text) {
      return c.json({ error: "Failed to transcribe audio" }, 500);
    }

    return c.json({ text });
  });
}

export default Object.assign(Transcribe, { $inject });
