import { assertEquals, assertInstanceOf } from "@std/assert";
import tryCatch from "./tryCatch.ts";

Deno.test("tryCatch", async (t) => {
  await t.step("should handle synchronous success", async () => {
    const [result, error] = await tryCatch(() => "success", "default");
    assertEquals(result, "success");
    assertEquals(error, null);
  });

  await t.step("should handle synchronous failure", async () => {
    const [result, error] = await tryCatch(() => {
      throw new Error("sync error");
    }, "default");
    assertEquals(result, "default");
    assertInstanceOf(error, Error);
    assertEquals(error.message, "sync error");
  });

  await t.step("should handle asynchronous success", async () => {
    const [result, error] = await tryCatch(() => "async success", "default");
    assertEquals(result, "async success");
    assertEquals(error, null);
  });

  await t.step("should handle asynchronous failure", async () => {
    const [result, error] = await tryCatch(() => {
      throw new Error("async error");
    }, "default");
    assertEquals(result, "default");
    assertInstanceOf(error, Error);
    assertEquals(error.message, "async error");
  });

  await t.step("should handle non-Error throws", async () => {
    const [result, error] = await tryCatch(() => {
      throw "string error";
    }, "default");
    assertEquals(result, "default");
    assertInstanceOf(error, Error);
    assertEquals(error.message, "string error");
  });
});
