<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { registerSchema } from '$lib/schemas';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { Input } from "$lib/components/shadcn/ui/input";
    import { Button } from "$lib/components/shadcn/ui/button";
    import * as ShadcnForm from '$lib/components/shadcn/ui/form';
    import { Checkbox } from "$lib/components/shadcn/ui/checkbox";
    import type { SuperValidated } from 'sveltekit-superforms';
    import type { z } from 'zod';

    type RegisterData = z.infer<typeof registerSchema>;

    type RegisterProps = { 
        data: SuperValidated<RegisterData>
    }

    let { data }: RegisterProps = $props();
    
    const form = superForm<RegisterData>(data, {
        validators: zodClient(registerSchema)
    });
</script>

<form action="/register" use:form.enhance>
    <div class="space-y-4">
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
            <ShadcnForm.Description>Password must be at least 8 characters</ShadcnForm.Description>
            <ShadcnForm.FieldErrors />
        </ShadcnForm.Field>

        <ShadcnForm.Field {form} name="terms">
            <ShadcnForm.Control let:attrs>
                <div class="items-top flex space-x-2">
                    <Checkbox {...attrs} id="terms" />
                    <div class="grid gap-1.5 leading-none">
                        <ShadcnForm.Label for="terms">
                            Accept terms and conditions
                        </ShadcnForm.Label>
                        <p class="text-muted-foreground text-sm">
                            You agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </ShadcnForm.Control>
            <ShadcnForm.FieldErrors />
        </ShadcnForm.Field>

        <Button type="submit" class="w-full">Create Account</Button>
    </div>
</form>