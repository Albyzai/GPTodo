type Listener<T> = (data: T) => void;
type EventMap = Record<string, unknown>;

export interface EventEmitter<T extends EventMap> {
  on<K extends keyof T>(event: K, listener: Listener<T[K]>): void;
  off<K extends keyof T>(event: K, listener: Listener<T[K]>): void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
}

export function createEventEmitter<T extends EventMap>(): EventEmitter<T> {
  const listeners: { [K in keyof T]?: Array<Listener<T[K]>> } = {};

  const on = <K extends keyof T>(event: K, listener: Listener<T[K]>): void => {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(listener);
  };

  const off = <K extends keyof T>(event: K, listener: Listener<T[K]>): void => {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter((l) => l !== listener);
  };

  const emit = <K extends keyof T>(event: K, data: T[K]): void => {
    if (!listeners[event]) return;
    for (const listener of listeners[event]) {
      listener(data);
    }
  };

  return { on, off, emit };
}
