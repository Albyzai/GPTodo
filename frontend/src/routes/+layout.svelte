<script lang="ts">
    import '../app.css';
    import TodoList from '$components/TodoList.svelte';
    import Conversation from "$components/Conversation.svelte";
    import RecordButton from "$components/RecordButton.svelte";
    import LanguagePicker from "$components/LanguagePicker.svelte";
    let { children } = $props() 
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
    {@render children()}
    </div>

    