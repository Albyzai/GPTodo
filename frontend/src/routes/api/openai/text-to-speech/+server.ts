import { textToSpeech } from '../../../../lib/api/openai/api';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { text } = await request.json();
  const stream = await textToSpeech(text);

  return new Response(stream, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    },
  });
};