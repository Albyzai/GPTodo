<script lang="ts">
    import { Input} from "$lib/components/shadcn/ui/input";
    import type { HTMLInputAttributes } from "svelte/elements";
    type $$Props = HTMLInputAttributes;
    const { value }: $$Props["value"] = $props();
</script>

<Input {value} class="border-none text-xl p-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" />
