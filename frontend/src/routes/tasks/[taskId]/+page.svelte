<script lang="ts">
    import { page } from '$app/stores';
    import { todoStore, type Task as TaskType } from '$lib/stores/Todo';
    import TodoDialog from '$lib/components/TodoDialog.svelte';
    const taskId = $page.params.taskId;
    const task = $derived($todoStore.tasks.find((t: TaskType) => t.id === taskId));
    </script>
    
    {#if task}
      <TodoDialog {task} open={true} />
    {:else}
      <p>Task not found</p>
    {/if}