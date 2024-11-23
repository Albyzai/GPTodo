const method = "POST";

export type Payload = {
    username: string;
    password: string;
}

export default async function authenticate(body: Payload) {
  const response = await fetch("http://localhost:8000/auth", {
    method,
    body: JSON.stringify(body),
  });
  return response.json();
}
