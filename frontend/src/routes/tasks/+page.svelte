<script>
    import TodoDialog from "$components/TodoDialog.svelte";
</script>

<TodoDialog open={true} task={{ content: 'Title', timestamp: Date.now()}} />