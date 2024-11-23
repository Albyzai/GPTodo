<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { loginSchema } from '$lib/schemas/login';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { Input } from "$lib/components/shadcn/ui/input";
    import { Button } from "$lib/components/shadcn/ui/button";
    import * as ShadcnForm from '$lib/components/shadcn/ui/form';
    import type { SuperForm, SuperValidated } from 'sveltekit-superforms';
    import type { z } from 'zod';
    type LoginData = z.infer<typeof loginSchema>;

type LoginProps = { 
    data: SuperValidated<LoginData>  // Take SuperValidated data instead
}
    let { data }: LoginProps = $props();
    // const loginForm = $derived(superForm($page.data.loginForm, { validators: loginSchema }));
    const form = superForm<LoginData>(data, {
        validators: zodClient(loginSchema)
    });

</script>
<form action="" use:form.enhance>
    <ShadcnForm.Field {form} name="email">
        <ShadcnForm.Control let:attrs>
            <ShadcnForm.Label>Email</ShadcnForm.Label>
            <Input {...attrs} type="email" />
        </ShadcnForm.Control>
        <ShadcnForm.Description>Enter your email</ShadcnForm.Description>
        <ShadcnForm.FieldErrors />
    </ShadcnForm.Field>

    <ShadcnForm.Field {form} name="password">
        <ShadcnForm.Control let:attrs>
            <ShadcnForm.Label>Password</ShadcnForm.Label>
            <Input {...attrs} type="password" />
        </ShadcnForm.Control>
        <ShadcnForm.Description>Enter your password</ShadcnForm.Description>
        <ShadcnForm.FieldErrors />
    </ShadcnForm.Field>

    <Button type="submit" class="w-full">Sign In</Button>
</form>