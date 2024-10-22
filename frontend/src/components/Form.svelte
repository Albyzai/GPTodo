<script lang="ts">
    import { enhance } from '$app/forms';

    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    type FormProps = { inputs: Function, action?: string }

    let { inputs, action }: FormProps = $props();
</script>
<form {action} method="POST" use:enhance>
    {@render inputs()}
</form>