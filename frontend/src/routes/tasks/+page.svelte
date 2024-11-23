<script>
    import TodoDialog from "$lib/components/TodoDialog.svelte";
</script>

<TodoDialog open={true} task={{ content: 'Title', timestamp: Date.now()}} />