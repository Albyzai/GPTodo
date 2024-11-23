// @ts-nocheck: difficult typing
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import Module from "./Module.ts";

Deno.test("Module IoC", async (t) => {
  await t.step("should register and resolve a simple factory", () => {
    const testString = "Hello, World!";
    let result: string | undefined;
    const simpleFactory = () => testString;

    new Module()
      .register(simpleFactory)
      .schedule([
        simpleFactory,
        (value) => {
          result = value;
        },
      ])
      .initiate();

    assertEquals(result, testString);
  });

  await t.step("should resolve dependencies", () => {
    const dep1 = () => "Dependency 1";
    const dep2 = () => "Dependency 2";
    const main = Object.assign(
      (dep1: string, dep2: string) => `${dep1} and ${dep2}`,
      {
        $inject: [dep1, dep2],
      },
    );
    let result: string | undefined;

    new Module()
      .register(dep1)
      .register(dep2)
      .register(main)
      .schedule([
        main,
        (value) => {
          result = value;
        },
      ])
      .initiate();

    assertEquals(result, "Dependency 1 and Dependency 2");
  });

  await t.step("should support lifecycle hooks", () => {
    const logs: string[] = [];
    const service = () => "Service";

    new Module()
      .register(service)
      .before(service, () => logs.push("Before service"))
      .after(service, (instance) => logs.push(`After service: ${instance}`))
      .initiate();

    assertEquals(logs, ["Before service", "After service: Service"]);
  });

  await t.step("should support scheduling", () => {
    const logs: string[] = [];
    const logger = () => (msg: string) => logs.push(msg);

    new Module()
      .register(logger)
      .schedule([logger, (log) => log("Scheduled task")])
      .initiate();

    assertEquals(logs, ["Scheduled task"]);
  });

  await t.step("should support singletons", () => {
    let counter = 0;
    let instance1: number | undefined;
    let instance2: number | undefined;

    const increment = () => ++counter;

    new Module()
      .register(increment, true)
      .schedule([
        increment,
        (value) => {
          instance1 = value;
        },
      ])
      .schedule([
        increment,
        (value) => {
          instance2 = value;
        },
      ])
      .initiate();

    assertEquals(instance1, instance2);
    assertEquals(instance1, 1);
    assertEquals(counter, 1);
  });

  await t.step("should support transient instances", () => {
    let counter = 0;
    let instance1: number | undefined;
    let instance2: number | undefined;
    const increment = () => () => ++counter;

    new Module()
      .register(increment)
      .schedule([
        increment,
        (cb) => {
          const val = cb();
          instance1 = val;
        },
      ])
      .schedule([
        increment,
        (cb) => {
          const val = cb();
          instance2 = val;
        },
      ])
      .initiate();

    assertNotEquals(instance1, instance2);
    assertEquals(instance1, 1);
    assertEquals(instance2, 2);
    assertEquals(counter, 2);
  });

  await t.step("should support extending modules", () => {
    const baseValue = () => "Base";
    const sharedValue = () => "Base Shared";
    const extendedValue = () => "Extended";
    const extendedSharedValue = () => "Extended Shared";

    const baseModule = new Module()
      .register(baseValue)
      .register(sharedValue, true) // Make it a singleton
      .before(sharedValue, () => console.log("Base Before"))
      .after(sharedValue, (value) => console.log(`Base After: ${value}`))
      .schedule(() => console.log("Base Scheduled Task"));

    const extendingModule = new Module()
      .register(extendedValue)
      .register(extendedSharedValue, true) // Add a new shared value
      .before(extendedSharedValue, () => console.log("Extended Before"))
      .after(
        extendedSharedValue,
        (value) => console.log(`Extended After: ${value}`),
      )
      .schedule(() => console.log("Extended Scheduled Task"));

    const combinedModule = new Module().extends(baseModule).extends(
      extendingModule,
    );

    const logs: string[] = [];
    const originalConsoleLog = console.log;
    console.log = (message: string) => logs.push(message);

    combinedModule.initiate();

    console.log = originalConsoleLog;

    assertEquals(combinedModule.get(baseValue), "Base");
    assertEquals(combinedModule.get(extendedValue), "Extended");
    assertEquals(combinedModule.get(sharedValue), "Base Shared");
    assertEquals(combinedModule.get(extendedSharedValue), "Extended Shared");
    assertEquals(logs, [
      "Base Before",
      "Base After: Base Shared",
      "Extended Before",
      "Extended After: Extended Shared",
      "Base Scheduled Task",
      "Extended Scheduled Task",
    ]);
  });
});
