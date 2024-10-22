<script lang="ts">
import Day from "./Day.svelte";
import { type Task } from '$lib/stores/Todo';

type WeekProps = {
    weekDates: Date[];
    weekTasks: Task[]
};

let { weekDates, weekTasks }: WeekProps = $props();


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getTasksForDay(date: Date): Task[] {
    const dayEnd = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    return weekTasks.filter(task => 
        task.timestamp >= date.getTime() && task.timestamp < dayEnd.getTime()
    );
}
</script>

<div class="week-container">
  <h3 class="text-xl font-bold mb-2">Week of {weekDates[0].toDateString()}</h3>
  <div class="grid grid-cols-7 gap-4 p-4">
    {#each weekDates as date, index}
      <Day 
        day={days[index]} 
        tasks={getTasksForDay(date)} 
        date={date} 
      />
    {/each}
  </div>
</div>