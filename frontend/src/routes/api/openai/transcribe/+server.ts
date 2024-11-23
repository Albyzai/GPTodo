import { json } from "@sveltejs/kit";
import transcribe from "../../../../api/openai/transcribe.ts";

export const POST = async ({ request }) => {
  console.log("transcribe hit");
  const formData = await request.formData();
  const audioFile = formData.get("file") as File;

  const text = await transcribe(audioFile);

  return json({ text });
};
