<script lang="ts">
    import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "$lib/components/shadcn/ui/dialog";
    import type { Task } from "$lib/stores/Todo";
    import { goto } from '$app/navigation'
    import { todoStore } from "$lib/stores/Todo";
    import Input from "$lib/components/shadcn/ui/input/input.svelte";
    import Form from './Form.svelte'
    import BorderlessInput from "./BorderlessInput.svelte";
    let { task, open = false } = $props<{ task: Partial<Task>, open: boolean }>();

    function formatDateTime(timestamp: number): string {
        return new Date(timestamp).toLocaleString([], { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    function close() {
        console.log('close')
        goto('/')
    }

    function save() {
        todoStore.create(task)
    }
</script>
<Dialog bind:open onOpenChange={close} closeOnEscape={true}>
        <DialogContent class="sm:max-w-[425px] md:max-w-[800px]" >
    <DialogHeader>
        <DialogTitle>
            <BorderlessInput value={task.content}  />
        </DialogTitle>
        <DialogDescription>
            Scheduled for {formatDateTime(task.timestamp)}
        </DialogDescription>
    </DialogHeader>
    <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
            <span class="col-span-4">
                {task.content}
            </span>
        </div>
    </div>
</DialogContent>
</Dialog>