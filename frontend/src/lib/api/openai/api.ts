//import { type Task } from '$lib/stores/Todo';
import { OpenAI } from 'openai';
import type { ChatCompletionRequestMessage, TranscriptionResponse } from './types';
import { createTaskSchema } from './schemas';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function textToSpeech(text: string): Promise<ReadableStream> {
    const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
        response_format: "mp3",
    });

    return response.body;
}

export async function chat(messages: ChatCompletionRequestMessage[], language: string) {
    const currentDate = new Date();
    const settingsMessage: OpenAI.Chat.ChatCompletionMessageParam = { role: 'system', content: `You are a helpful planning assistant. Your goal is to help create and manage items for a todo list. Always respond in ${language}. Use appropriate date and time formats for the selected language. If you need more information to create a task, ask for it.` };
    const dateMessage: OpenAI.Chat.ChatCompletionMessageParam = { role: 'system', content: `Current date and time: ${currentDate.toISOString()}. Take careful note of what is planned when` };

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-2024-08-06',
            messages: [settingsMessage, dateMessage, ...messages],
            tools: [createTaskSchema],
            tool_choice: "auto"
        });

        console.log('COMPLETION', completion);
        const choice = completion.choices[0];
        console.log('RESPONSE MESSAGE', choice);
        console.log('choice message', choice.message)
        if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls) {
            const tasks = choice.message.tool_calls
                .filter(call => call.function.name === "create_task")
                .flatMap(call => {
                    console.log('call function', call.function)
                    const functionArgs = JSON.parse(call.function.arguments);
                    console.log('functionArgs', functionArgs)
                    return (Array.isArray(functionArgs) ? functionArgs : [functionArgs]).map(task => {
                        const { event, date, time, notes } = task;
                        console.log('date', date)
                        console.log('time', time)
                        console.log('event', event)
                        console.log('notes', notes)
                        let taskDate = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
                        // If the parsed date is before the current date, assume it's for next year
                        if (taskDate < currentDate) {
                            taskDate = addDays(taskDate, 365);
                        }
                        console.log('taskDate.getTime()', taskDate.getTime())
                        return {
                            content: `${event}\n${notes || ''}`,
                            timestamp: taskDate.getTime()
                        };
                    });
                });
            console.log('tasks', tasks)
            const responseText = tasks.map(task =>
                `I've added a task for ${task.content.split('\n')[0]} on ${new Date(task.timestamp).toLocaleString(language)}.`
            ).join('\n');

            return { text: responseText, tasks };
        }

        // If no tool was called or it wasn't the create_task function
        return {
            text: choice.message.content || "I couldn't create any tasks from that information. Could you please provide more details?",
            tasks: []
        };
    } catch (error) {
        console.error("An error occurred:", error);
        return {
            text: "I'm sorry, I couldn't process that request. Could you please try again?",
            tasks: []
        };
    }
}


export async function transcribeAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TranscriptionResponse = await response.json();
    return data.text;
}