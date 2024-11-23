import { Hono } from "hono";
import type { Context } from "hono";

const startTime = Date.now();
export type Router = Hono;

export default function CreateRouter(): Router {
  const router = new Hono();

  router.get("/health", (c: Context) => {
    const currentTime = Date.now();
    const healthCheck = {
      status: "UP",
      timestamp: new Date().toISOString(),
      uptime: `${((currentTime - startTime) / 1000).toFixed(2)} seconds`,
      environment: Deno.env.get("DENO_ENV") || "development",
      version: "1.0.0", // Replace with your actual version
      services: {
        database: "UP", // Replace with actual database check
        cache: "UP", // Replace with actual cache check
        // Add more service checks as needed
      },
      system: {
        memory: Deno.systemMemoryInfo(),
        cpu: {
          loadAverage: Deno.loadavg(),
          coreCount: navigator.hardwareConcurrency,
        },
      },
      responseTime: `${Date.now() - currentTime}ms`,
    };

    return c.json(healthCheck, 200);
  });

  return router;
}
