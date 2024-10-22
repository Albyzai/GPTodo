export type ChatCompletionRequestMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export type Message = {
    message: {
        content: string
    }
};

export type ChatGPTResponse = {
    choices: Array<Message>;
};

export type TranscriptionResponse = {
    text: string;
};
