<script>
import RecordButton from "$lib/components/RecordButton.svelte";
import TodoList from "$lib/components/TodoList.svelte";
import LanguagePicker from "$lib/components/LanguagePicker.svelte";
import Conversation from "$lib/components/Conversation.svelte";
</script>
<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">AI-Powered Todo List</h1>
    
    <div class="flex justify-between mb-4">
        <RecordButton />
    </div>
    <div class="flex flex-col gap-4">
        <TodoList />
        <div class="flex flex-col gap-2">
            
            <LanguagePicker />
            <Conversation  />
        </div>
        
</div>
</div>