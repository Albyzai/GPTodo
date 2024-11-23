const method = "POST";

export default async function transcribe(audioFile: File) {
  const response = await fetch("http://localhost:8000/transcribe", {
    method,
    body: audioFile,
  });

  return response.json();
}
