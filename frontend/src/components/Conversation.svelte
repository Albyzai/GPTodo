<script lang="ts">
    import { chatStore } from "$lib/stores/Chat";

    let userInput = $state("");
    let isProcessing = $state(false);


    function sendMessage(e: Event) {
        e.preventDefault();
        if (!userInput.trim() || isProcessing) return;

        chatStore.send("user", userInput);
        userInput = "";
    }
</script>

<div class="conversation p-4 bg-slate-200 w-full rounded-md border-2 min-h-60">
    {#each $chatStore.messages as message}
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