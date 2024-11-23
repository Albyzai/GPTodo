<script lang="ts">
    import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "$lib/components/shadcn/ui/select";
    import { chatStore } from "$lib/stores/Chat";
  
    const languages = new Map([
      ['en', 'English'],
      ['no', 'Norweigan'],
      ['es', 'Spanish'],
      ['da', 'Danish']
    ])

    $effect(() => {
      chatStore.setLanguage('da');
    });
    function handleLanguageChange(event: CustomEvent<string>) {
      console.log('language changed')
      chatStore.setLanguage(event.detail);
    }
  </script>
  {@html `<!-- @ts-ignore -->`}
  <Select {...{
    ...{} 
    /* @ts-ignore */
  }} onSelectedChange={handleLanguageChange} selected={$chatStore.language}>
    <SelectTrigger class="w-[180px]">
      <SelectValue placeholder="Select Language" />
    </SelectTrigger>
    <SelectContent>
      {#each Array.from(languages) as [code, name]}
        <SelectItem value={code}>{name}</SelectItem>
      {/each}
    </SelectContent>
  </Select>