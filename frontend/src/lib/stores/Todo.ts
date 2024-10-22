import { writable } from 'svelte/store';

export type Task = {
  id: string;
  content: string;
  timestamp: number; 
};

function createTodoStore() {
  const { subscribe, update } = writable<{ tasks: Task[] }>({ tasks: [] });

  return {
    subscribe,
    create: (task: Omit<Task, 'id'>) => update(store => ({
      tasks: [...store.tasks, { ...task, id: crypto.randomUUID() }]
    })),
    delete: (id: string) => update(store => ({
      tasks: store.tasks.filter(task => task.id !== id)
    })),
    update: (id: string, updates: Partial<Omit<Task, 'id'>>) => update(store => ({
      tasks: store.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }))
  };
}

export const todoStore = createTodoStore();