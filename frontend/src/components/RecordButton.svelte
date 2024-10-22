<script lang="ts">
    import { chatStore } from "$lib/stores/Chat";
    import Button from "$lib/components/ui/button/button.svelte";
    let recording = $state(false);
    let mediaRecorder: MediaRecorder | null = null;
    let audioContext: AudioContext;
    let audioSource: AudioBufferSourceNode | null = null;

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            mediaRecorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                const formData = new FormData();
                formData.append("file", blob, "audio.webm");

                try {
                    const response = await fetch("/api/openai/transcribe", {
                        method: "POST",
                        body: formData,
                    });
                    const { text } = await response.json();
                    chatStore.send('user', text)
                } catch (error) {
                    console.error("Transcription error:", error);
                }
            };

            mediaRecorder.start();
            recording = true;
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    }

    async function playTextToSpeech(text: string) {
        try {
            const response = await fetch("/api/openai/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            const reader = response.body!.getReader();
            const stream = new ReadableStream({
                async start(controller) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        controller.enqueue(value);
                    }
                    controller.close();
                },
            });

            const response2 = new Response(stream);
            const arrayBuffer = await response2.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            if (audioSource) {
                audioSource.stop();
            }
            audioSource = audioContext.createBufferSource();
            audioSource.buffer = audioBuffer;
            audioSource.connect(audioContext.destination);
            audioSource.start();
        } catch (error) {
            console.error("Error playing text-to-speech:", error);
        }
    }

    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            recording = false;
        }
    }
    $effect(() => console.log('recording changed', recording))
    $effect(() => {
        const lastMessage = $chatStore.messages[$chatStore.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
            playTextToSpeech(lastMessage.content);
        }
    });
    
</script>

<Button class="rounded-full bg-red-600 w-14 h-14" onclick={() => (recording ? stopRecording() : startRecording())}>
    {recording ? "stop" : "start"}
</Button>
