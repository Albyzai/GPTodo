<script lang="ts">
    import '../app.css';
    import TodoList from '$lib/components/TodoList.svelte';
    import Conversation from "$lib/components/Conversation.svelte";
    import RecordButton from "$lib/components/RecordButton.svelte";
    import LanguagePicker from "$lib/components/LanguagePicker.svelte";
    import Header from "$lib/components/Header.svelte";
    let { children } = $props() 
    </script>
    
    <Header />
   
    {@render children()}

    