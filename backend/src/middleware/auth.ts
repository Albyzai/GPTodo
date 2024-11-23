import type { Context, Next } from "hono";
import { verify } from "djwt";
import crypto from "node:crypto";
import tryCatch from "$utils/tryCatch.ts";

export default async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];

  const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );
  const [payload, error] = await tryCatch(() => verify(token, key))
  
  if(error || !payload) {
      return c.json({ error: "Invalid token" }, 401);
  }

  c.set("userId", payload.userId)
  next()
}
