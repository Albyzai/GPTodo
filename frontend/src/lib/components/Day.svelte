<script lang="ts">
    import { Card } from "$lib/components/shadcn/ui/card";
    import { todoStore, type Task as TaskType } from "$lib/stores/Todo";
    import Task from "./Task.svelte";
    import { goto } from "$app/navigation";

    type DayProps = {
        day: string;
        tasks: TaskType[];
        date: Date;
    };

    let { day, tasks, date }: DayProps = $props();
    
    function addTask() {
        goto("tasks");
        return;
    }
</script>

<Card class="flex flex-col p-4">
    <h3 class="text-lg font-bold mb-2 capitalize">{day}</h3>
    <ol class="space-y-2">
        {#each tasks as task (task.id)}
            <Task {task} />
        {/each}

        <button
            onclick={addTask}
            class="flex items-center justify-center p-1 rounded-md border border-dotted w-full text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all duration-300 opacity-0 hover:opacity-100"
        >
            +
        </button>
    </ol>
</Card>
