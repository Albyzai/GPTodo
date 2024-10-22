import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chat } from '../../../../lib/api/openai/api';

export const POST: RequestHandler = async ({ request }) => {
    const { messages } = await request.json();
    console.log('MESSAGES', messages)
    const response = await chat(messages, 'danish');
    console.log('RESPONSE', response);
    return json(response);
};