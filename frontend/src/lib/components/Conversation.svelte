<script lang="ts">
    type Message = {
        role: 'user' | 'assistant';
        content: string;
    };

    type FormProps = { messages: Message[] }

    let { messages = [] }: FormProps = $props();
    let userInput = $state("");
    let isProcessing = $state(false);


    async function sendMessage(e: Event) {
        e.preventDefault();
        if (!userInput.trim() || isProcessing) return;
        isProcessing = true;
        const result = await fetch("/api/openai/completion", {
            method: "POST",
            body: JSON.stringify({ messages: [{ role: "user", content: userInput }] }),
        });
        isProcessing = false;
        const audioData = await result.arrayBuffer();
        const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // Play the audio
        audio.play();
        // Clean up the URL object when done
        audio.onended = () => URL.revokeObjectURL(audioUrl);
        userInput = "";
    }
</script>

<div class="conversation p-4 bg-slate-200 w-full rounded-md border-2 min-h-60">
    {#each messages as message}
        <div class={message.role === "user" ? "text-blue-600" : "text-green-600"}>
            <strong>{message.role}:</strong> {message.content}
        </div>
    {/each}
</div>

<form onsubmit={sendMessage} class="mt-4">
    <input
        bind:value={userInput}
        placeholder="Type your message..."
        class="w-full p-2 border rounded"
        disabled={isProcessing}
    />
    <button
        type="submit"
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={isProcessing}
    >
        {isProcessing ? "Processing..." : "Send"}
    </button>
</form>