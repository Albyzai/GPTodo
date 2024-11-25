import { writable, get } from "svelte/store";
import { todoStore } from "./Todo.ts";

export type Message = {
    role: 'user' | 'assistant';
    content: string;
};

function createChatStore() {
    const { subscribe, update } = writable({
        messages: [] as Message[],
        language: 'en', // Default language
        isProcessing: false
    });

    async function handleNewUserMessage() {
        update(store => ({ ...store, isProcessing: true }));
        try {
         const store = get(chatStore)
            const response = await fetch("/api/openai/completion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    messages: store.messages,
                    language: store.language
                }),
            });
            console.log('API Response Status:', response.status);
            const responseData = await response.json();
            console.log('API Response Data:', responseData);
    
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }
    
            const { text, tasks = [] } = responseData;
    
            update(store => ({
                ...store,
                messages: [...store.messages, { role: 'assistant', content: text }]
            }));
            for(const task of tasks) { todoStore.create(task) }
        } catch (error) {
            console.error("Error processing message:", error);
            update(store => ({
                ...store,
                messages: [...store.messages, { role: 'assistant', content: "Sorry, there was an error processing your message." }]
            }));
        } finally {
            update(store => ({ ...store, isProcessing: false }));
        }
    }

    return {
        subscribe,
        send: (role: 'user' | 'assistant', content: string) => {
            update(store => ({
                ...store,
                messages: [...store.messages, { role, content }]
            }));
            if (role === 'user') {
                handleNewUserMessage();
            }
        },
        setLanguage: (language: string) => update(store => ({
            ...store,
            language
        }))
    };
}

export const chatStore = createChatStore();