import { assertEquals } from "@std/assert";
import isThenable from "./isThenable.ts";

Deno.test("isThenable", async (t) => {
  await t.step("should return true for Promise objects", () => {
    assertEquals(isThenable(Promise.resolve()), true);
    assertEquals(isThenable(new Promise(() => {})), true);
  });

  await t.step("should return true for thenable objects", () => {
    // biome-ignore lint/suspicious/noThenProperty: should be able to use then for this case
    const thenable = { then: () => {} };
    assertEquals(isThenable(thenable), true);
  });

  await t.step("should return false for non-thenable objects", () => {
    assertEquals(isThenable({}), false);
    assertEquals(isThenable(null), false);
    assertEquals(isThenable(undefined), false);
    assertEquals(isThenable(42), false);
    assertEquals(isThenable("string"), false);
    assertEquals(isThenable(true), false);
    // biome-ignore lint/suspicious/noThenProperty: should be able to use then for this case
    assertEquals(isThenable({ then: "not a function" }), false);
  });
});