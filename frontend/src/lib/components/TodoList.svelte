<script lang="ts">
    import { Button } from "$lib/components/shadcn/ui/button";
    import Week from "./Week.svelte";
    import { todoStore } from "$lib/stores/Todo";

    let currentWeekStart = $state(getStartOfWeek(new Date()));

    function getStartOfWeek(date: Date): Date {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    let weekDates = $derived(
        Array.from({ length: 7 }, (_, i) => {
            const date = new Date(
                currentWeekStart.getTime() + i * 24 * 60 * 60 * 1000,
            );
            date.setHours(0, 0, 0, 0);
            return date;
        }),
    );

    let weekEnd = $derived(
        new Date(weekDates[6].getTime() + 24 * 60 * 60 * 1000),
    );

    let weekTasks = $derived(
        $todoStore.tasks.filter(
            (task) =>
                task.timestamp >= currentWeekStart.getTime() &&
                task.timestamp < weekEnd.getTime(),
        ),
    );

    $effect(() => {
        console.log('WEEK TASKS', weekTasks)
        console.log('ALL STORE TASKS', $todoStore.tasks)
    })

    function nextWeek() {
        currentWeekStart = new Date(
            currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000,
        );
    }

    function prevWeek() {
        currentWeekStart = new Date(
            currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000,
        );
    }

    function goToCurrentWeek() {
        currentWeekStart = getStartOfWeek(new Date());
    }
</script>

<div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Weekly To-Do List</h2>
    <div class="flex justify-between mb-4">
        <Button on:click={prevWeek}>Previous Week</Button>
        <Button on:click={goToCurrentWeek}>Current Week</Button>
        <Button on:click={nextWeek}>Next Week</Button>
    </div>
    <Week {weekDates} {weekTasks} />
</div>
