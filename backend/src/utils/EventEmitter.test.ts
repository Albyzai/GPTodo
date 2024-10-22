import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createEventEmitter } from "./EventEmitter.ts";

type TestEvents = {
  "test:event": string;
  "number:event": number;
  "object:event": { key: string; value: number };
};

Deno.test("EventEmitter", async (t) => {
  await t.step("should create an event emitter", () => {
    const emitter = createEventEmitter<TestEvents>();
    assertExists(emitter.on);
    assertExists(emitter.off);
    assertExists(emitter.emit);
  });

  await t.step("should allow subscribing to events", () => {
    const emitter = createEventEmitter<TestEvents>();
    let called = false;
    emitter.on("test:event", () => {
      called = true;
    });
    emitter.emit("test:event", "test");
    assertEquals(called, true);
  });

  await t.step("should pass correct data to event listeners", () => {
    const emitter = createEventEmitter<TestEvents>();
    let receivedData: string | undefined;
    emitter.on("test:event", (data) => {
      receivedData = data;
    });
    emitter.emit("test:event", "test data");
    assertEquals(receivedData, "test data");
  });

  await t.step("should allow multiple listeners for the same event", () => {
    const emitter = createEventEmitter<TestEvents>();
    let count = 0;
    const listener1 = () => {
      count++;
    };
    const listener2 = () => {
      count++;
    };
    emitter.on("test:event", listener1);
    emitter.on("test:event", listener2);
    emitter.emit("test:event", "test");
    assertEquals(count, 2);
  });

  await t.step("should allow unsubscribing from events", () => {
    const emitter = createEventEmitter<TestEvents>();
    let count = 0;
    const listener = () => {
      count++;
    };
    emitter.on("test:event", listener);
    emitter.emit("test:event", "test");
    assertEquals(count, 1);
    emitter.off("test:event", listener);
    emitter.emit("test:event", "test");
    assertEquals(count, 1);
  });

  await t.step("should handle different event types correctly", () => {
    const emitter = createEventEmitter<TestEvents>();
    let stringResult: string | undefined;
    let numberResult: number | undefined;
    let objectResult: { key: string; value: number } | undefined;

    emitter.on("test:event", (data) => {
      stringResult = data;
    });
    emitter.on("number:event", (data) => {
      numberResult = data;
    });
    emitter.on("object:event", (data) => {
      objectResult = data;
    });

    emitter.emit("test:event", "test string");
    emitter.emit("number:event", 42);
    emitter.emit("object:event", { key: "test", value: 123 });

    assertEquals(stringResult, "test string");
    assertEquals(numberResult, 42);
    assertEquals(objectResult, { key: "test", value: 123 });
  });

  await t.step(
    "should not throw when emitting an event with no listeners",
    () => {
      const emitter = createEventEmitter<TestEvents>();
      emitter.emit("test:event", "test");
    },
  );

  await t.step("should not call listeners after they have been removed", () => {
    const emitter = createEventEmitter<TestEvents>();
    let count = 0;
    const listener1 = () => {
      count++;
    };
    const listener2 = () => {
      count++;
    };
    emitter.on("test:event", listener1);
    emitter.on("test:event", listener2);
    emitter.emit("test:event", "test");
    assertEquals(count, 2);
    emitter.off("test:event", listener1);
    emitter.emit("test:event", "test");
    assertEquals(count, 3);
  });
});
