<script lang="ts">
    import * as Avatar from "$lib/components/shadcn/ui/avatar";
    import LoginDialog from "$lib/components/LoginDialog.svelte";
    import { derived } from "svelte/store";
    import { page } from "$app/stores";
    import { Button } from "$lib/components/shadcn/ui/button";
    const me = derived(page, ({ data }) => data.me);
    $effect(() => console.log("ME EXISTS", $me));
</script>

<header class="p-4">
    <nav class="flex justify-between items-center">
        <h1>Logo</h1>
        {#if $me}
            <div class="flex items-center gap-2">
                <Avatar.Root>
                    <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
                    <Avatar.Fallback>CN</Avatar.Fallback>
                  </Avatar.Root>
                <Button>Logout</Button>
            </div>
        {:else}
            <a href="/auth">
                <Button>Get Started</Button>
            </a>
        {/if}
    </nav>
</header>

