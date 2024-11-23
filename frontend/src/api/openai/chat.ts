const method = "POST";

export default async function chat(message: string) {
  const response = await fetch("http://localhost:8000/chat", {
    method,
    body: JSON.stringify({ message }),
  });
  return response.json();
}
