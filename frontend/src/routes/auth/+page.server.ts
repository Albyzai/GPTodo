import authenticate, { type Payload } from "../../api/users/authenticate.ts";
import type { Load } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema, registerSchema } from '../../lib/schemas/index.ts';

export const load: Load = async () => {
    const [loginForm, registerForm] = await Promise.all([
        superValidate(zod(loginSchema)),
        superValidate(zod(registerSchema))
    ]);
    return {
        loginForm,
        registerForm
    };
};
export const actions = {
    default: async ({ request }: { request: Request }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData) as Payload;
        const response = await authenticate(data);
        console.log(response);
        return response;
    }
}