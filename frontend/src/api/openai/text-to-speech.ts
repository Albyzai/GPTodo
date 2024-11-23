const method = "POST";

export default async function textToSpeech(text: string) {
  console.log("SENDING TEXT TO SPEECH", text);
  const response = await fetch("http://localhost:8000/text-to-speech", {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.arrayBuffer();
}
