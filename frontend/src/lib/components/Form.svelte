<!-- <script lang="ts">
    import { enhance } from '$app/forms';
    import type { Snippet } from 'svelte';
    import { superForm } from "sveltekit-superforms";

    type FormProps = { children: Snippet, action?: string }

    let { children, action }: FormProps = $props();
</script>
<form {action} method="POST" use:enhance>
    {@render children()}
</form> -->


<script lang="ts">
    import { enhance } from '$app/forms';
    import type { Snippet } from 'svelte';

    import type { SuperValidated } from 'sveltekit-superforms';
    import type { SuperForm } from 'sveltekit-superforms';
    import { superForm } from "sveltekit-superforms";

    type FormProps = { 
        inputs: Snippet<[{ form: ReturnType<typeof superForm> }]>;
        action: string;
        data: SuperValidated<any>;
        schema?: any;
    }

    let { inputs, action, data }: FormProps = $props();

    const form = data ? superForm(data) : undefined
</script>
<form {action} method="POST" use:enhance>
    {#if form}
        {@render inputs({form})}
    {/if}
</form>
