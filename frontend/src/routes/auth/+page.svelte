<script lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/shadcn/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/shadcn/ui/tabs';
import { page } from '$app/stores';
import LoginForm from '$lib/components/forms/Login.svelte';
import RegisterForm from '$lib/components/forms/Register.svelte';
const loginForm = $derived($page.data.loginForm);
const registerForm = $derived($page.data.registerForm);
</script>
<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
    <Card class="w-[400px]">
        <CardHeader>
        <CardTitle>Welcome</CardTitle>
            <CardDescription>Login or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs value="login" class="w-full">
                <TabsList class="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                    <LoginForm data={loginForm} />
                </TabsContent>
                
                <TabsContent value="register">
                    <RegisterForm data={registerForm} />
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
</div>