<script lang="ts">
    import { type Task } from "$lib/stores/Todo";
    import { goto } from '$app/navigation'

    let { task } = $props<{ task: Task; dayStart?: Date }>();

    function formatTime(timestamp: number): string {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function open() {
        goto(`tasks/${task.id}`)
    }
</script>

<button class="flex flex-col p-2 rounded-md border w-full " onclick={open} tabindex="0">
    <small>{formatTime(task.timestamp)}</small>
    <span>
        {task.content}
    </span>
</button>

