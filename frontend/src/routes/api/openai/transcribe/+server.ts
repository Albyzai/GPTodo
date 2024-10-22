import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { transcribeAudio } from '../../../../lib/api/openai/api';

export const POST: RequestHandler = async ({ request }) => {
    console.log('transcribe hit')
    const formData = await request.formData();
    const audioFile = formData.get('file') as File;

    const text = await transcribeAudio(audioFile);
    return json({ text });
};