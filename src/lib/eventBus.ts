type Handler<T> = (payload: T) => void;

export interface EventBus<Events extends Record<string, unknown>> {
  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void;
  off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void;
  emit<K extends keyof Events>(event: K, payload: Events[K]): void;
}

/**
 * Dependency-free event bus. Replaces the cabinet's shared
 * `createEventBus<T>()` used by `OtterEvents` ("bark").
 */
export function createEventBus<Events extends Record<string, unknown>>(): EventBus<Events> {
  const handlers = new Map<keyof Events, Set<Handler<unknown>>>();
  return {
    on(event, handler) {
      let set = handlers.get(event);
      if (!set) {
        set = new Set();
        handlers.set(event, set);
      }
      set.add(handler as Handler<unknown>);
    },
    off(event, handler) {
      handlers.get(event)?.delete(handler as Handler<unknown>);
    },
    emit(event, payload) {
      const set = handlers.get(event);
      if (!set) return;
      for (const handler of Array.from(set)) {
        (handler as Handler<Events[typeof event]>)(payload);
      }
    },
  };
}
