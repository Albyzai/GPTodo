<script lang="ts">
import { chatStore } from '$lib/stores/Chat';
import { Button } from '$lib/components/shadcn/ui/button';
import tryCatch from '../../../../backend/src/utils/tryCatch';
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
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', blob, 'audio.webm');
      try {
        const response = await fetch('/api/openai/transcribe', {
          method: 'POST',
          body: formData,
        });
        const { text } = await response.json();
        chatStore.send('user', text);
      } catch (error) {
        console.error('Transcription error:', error);
      }
    };

    mediaRecorder.start();
    recording = true;
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
}

async function playTextToSpeech(text: string) {
    console.log('INITIAL TEXT', text)
  const [response, error] = await tryCatch(() =>
    fetch('/api/openai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    }),
  );

  if (error) {
    console.error('Text to speech error:', error);
  }

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  const arrayBuffer = await response?.arrayBuffer();
    
    audioContext.decodeAudioData(
      arrayBuffer,
      (buffer) => {
        if (audioSource) {
          audioSource.stop();
        }
        audioSource = audioContext.createBufferSource();
        audioSource.buffer = buffer;
        audioSource.connect(audioContext.destination);
        audioSource.start();
      },
      (error) => {
        console.error('Error decoding audio data:', error);
      }
    );
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    recording = false;
  }
}
$effect(() => console.log('recording changed', recording));
$effect(() => {
  const lastMessage = $chatStore.messages[$chatStore.messages.length - 1];
  if (lastMessage && lastMessage.role === 'assistant') {
    console.log('LAST MESSAGE', lastMessage);
    playTextToSpeech(lastMessage.content);
  }
});
</script>

<Button class="rounded-full bg-red-600 w-14 h-14" onclick={() => (recording ? stopRecording() : startRecording())}>
    {recording ? "stop" : "start"}
</Button>
