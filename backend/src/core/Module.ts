// @ts-nocheck: difficult typing

// IoC Container To-Do List:

// 1. Register Factories
// - Allow registration of factory functions
// - Support both named and anonymous registrations
// - Validate factories during registration (e.g., check for circular dependencies)

// 2. Lazy Dependency Resolution
// - Do not resolve dependencies until they are needed
// - Implement a lazy loading mechanism for better performance

// 3. Lifecycle Management
// - Implement lifecycle hooks (e.g., onCreate, onDestroy)
// - Support different instance scopes:
//   a. Singleton: One instance for the entire container
//   b. Transient: New instance created each time
//   c. Scoped: One instance per scope (e.g., per request in a web application)

// 4. Dependency Resolution Strategy
// - Implement a strategy for resolving dependencies
// - Handle circular dependencies gracefully
// - Optimize for already initialized dependencies (caching)

// 5. Asynchronous Support
// - Allow for asynchronous factory functions and dependency resolution
// - Implement proper error handling for async operations

// 6. Scheduling and Initialization
// - Implement a mechanism to schedule callbacks for execution
// - Create an initialization process that respects dependency order

// 7. Module System
// - Allow for modular container configuration
// - Implement a way to extend or compose containers

// 8. Configuration and Customization
// - Allow for runtime configuration of the container
// - Provide hooks for customizing the resolution process

// 9. Performance Optimization
// - Implement caching strategies for resolved dependencies
// - Optimize the dependency graph for faster resolution

// 10. Debugging and Introspection
// - Provide tools for inspecting the current state of the container
// - Implement logging for important container operations

// 11. Type Safety
// - Ensure strong typing throughout the container
// - Implement type inference for resolved dependencies

// 12. Error Handling
// - Implement comprehensive error checking and reporting
// - Provide clear error messages for common issues (e.g., missing dependencies)

// 13. Testing Support
// - Implement features to facilitate easy testing of components using the container
// - Allow for easy mocking of dependencies in tests

// 14. Cleanup and Disposal
// - Implement a mechanism for proper cleanup of resources
// - Handle disposal of instances when they're no longer needed

// 15. Interoperability
// - Consider how the container will work with existing code or libraries
// - Provide adapters or wrappers for common use cases

// 16. Documentation and Examples
// - Create comprehensive documentation for using the container
// - Provide examples of common patterns and best practices

// Implementation Notes:
// - Use a Map to store factories: const registry: ServiceRegistry = new Map();
// - Implement getInject function to extract dependencies: getInject(factory).map(getInstance) ?? []
// - Consider using a WeakMap for caching resolved instances to allow garbage collection
// - Implement a topological sort for dependency resolution order
// - Use Proxies for lazy loading of deeply nested dependencies

type Factory<T> = (...args: unknown[]) => T;
type LifecycleHook<T> = (instance?: T) => void | Promise<void>;

type InjectedFactory<T> = Factory<T> & { $inject?: Factory<unknown>[] };

type RegistryEntry<T> = {
  factory: Factory<T>;
  isSingleton: boolean;
};

function getInject<T>(obj: InjectedFactory<T>): Factory<unknown>[] {
  return obj.$inject || [];
}

export default class Module {
  #registry: Map<Factory<unknown>, RegistryEntry<unknown>>;
  #instances: Map<Factory<unknown>, unknown>;
  #lifecycleHooks: Map<
    "before" | "after",
    Map<Factory<unknown>, Set<LifecycleHook<unknown>>>
  >;
  #scheduled: Set<() => void>;

  constructor() {
    this.#registry = new Map();
    this.#instances = new Map();
    this.#scheduled = new Set();
    this.#lifecycleHooks = new Map([
      ["before", new Map()],
      ["after", new Map()],
    ]);
  }

  register<T>(factory: Factory<T>, isSingleton = false): this {
    this.#registry.set(factory, { factory, isSingleton });
    return this;
  }

  before<T>(factory: Factory<T>, hook: LifecycleHook<T>): this {
    const hooks = this.#lifecycleHooks.get("before");
    if (!hooks.has(factory)) hooks.set(factory, new Set());
    hooks.get(factory).add(hook as LifecycleHook<unknown>);
    return this;
  }

  after<T>(
    factory: Factory<T>,
    hook: (instance: T, resolve: <R>(factory: Factory<R>) => R) => void,
  ): this {
    const hooks = this.#lifecycleHooks.get("after");
    if (!hooks.has(factory)) hooks.set(factory, new Set());
    hooks.get(factory).add(hook as LifecycleHook<unknown>);
    return this;
  }

  get<T>(key: string): T {
    return this.#resolve<T>(key);
  }

  schedule(task: (() => void) | [Factory<unknown>, <T>(arg: T) => void]): this {
    if (Array.isArray(task)) {
      const [factory, callback] = task;
      this.#scheduled.add(() => callback(this.#resolve(factory)));
    } else {
      this.#scheduled.add(task);
    }
    return this;
  }

  extends(module: Module): this {
    // Merge registries, keeping both but prioritizing the extending module
    for (const [factory, entry] of module.#registry) {
      if (!this.#registry.has(factory)) {
        this.#registry.set(factory, entry);
      }
    }

    // Merge lifecycle hooks
    for (const [stage, hooksMap] of module.#lifecycleHooks) {
      const thisHooksMap = this.#lifecycleHooks.get(stage);
      if (!thisHooksMap) continue;
      for (const [factory, hooks] of hooksMap) {
        if (!thisHooksMap.has(factory)) {
          thisHooksMap.set(factory, new Set());
        }
        for (const hook of hooks) {
          thisHooksMap.get(factory).add(hook);
        }
      }
    }

    // Merge scheduled tasks
    for (const task of module.#scheduled) {
      this.#scheduled.add(task);
    }

    return this;
  }

  #resolve<T>(factory: Factory<T>): T {
    const entry = this.#registry.get(factory);
    if (!entry) {
      throw new Error(
        `No factory registered for: ${factory.name || "anonymous"}`,
      );
    }
    const { isSingleton } = entry;

    // Return cached instance for singletons
    if (isSingleton && this.#instances.has(factory)) {
      return this.#instances.get(factory) as T;
    }

    const instance = this.#createInstance(factory);

    // Cache instance if it's a singleton
    if (isSingleton) {
      this.#instances.set(factory, instance);
    }

    return instance as T;
  }

  #createInstance<T>(factory: Factory<T>): T {
    const beforeHooks = this.#lifecycleHooks.get("before")?.get(factory) ?? [];
    const afterHooks = this.#lifecycleHooks.get("after")?.get(factory) ?? [];

    for (const hook of beforeHooks) {
      hook();
    }

    const dependencies = getInject(factory).map((dep) => this.#resolve(dep));
    const instance = factory(...dependencies);

    for (const hook of afterHooks) {
      hook(instance, this.#resolve.bind(this));
    }
    return instance;
  }

  initiate(): void {
    for (const factory of this.#registry.keys()) {
      this.#resolve(factory);
    }

    // Run scheduled tasks
    for (const task of this.#scheduled) {
      task();
    }
    this.#scheduled.clear();
  }
}
