
export type Payload = {
    username: string;
    password: string;
}

const method = "POST";

export default async function register(body: Payload) {
    const response = await fetch("http://localhost:8000/users", {
        method,
        body: JSON.stringify(body),
    });
    return response.json();
}