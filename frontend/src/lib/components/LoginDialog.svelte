<script lang="ts">
    import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogHeader, DialogTitle } from "$lib/components/shadcn/ui/dialog";
    import { Label } from "$lib/components/shadcn/ui/label";
    import { Input } from "$lib/components/shadcn/ui/input";
    import { Button } from "$lib/components/shadcn/ui/button";

    let email = "";
    let password = "";

    async function handleSubmit() {
        console.log("Login attempt with:", { email, password });
    }
</script>

<Dialog>
    <DialogTrigger>
        <Button>Login</Button>
    </DialogTrigger>
    <DialogContent>
        <DialogTitle>Login</DialogTitle>
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email"
                    bind:value={email}
                    required
                />
            </div>
            <div class="space-y-2">
                <Label for="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    bind:value={password}
                    required
                />
            </div>
        </form>

    </DialogContent>
</Dialog>