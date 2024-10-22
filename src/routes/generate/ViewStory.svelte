<script lang="ts">
  import type { Database, Story, IGeneration, ILine, IListSummary, IPromptStatus, IMetadata, IStoryMeta } from "./story-data";

  import CGTextArea from "../common/CommonGrowingTextArea.svelte";
  import CActionsMenu from "../common/CommonActionsMenu.svelte";


  import { blurOnEnterEscape } from '$lib/svelte-tools';

  import { useCloud } from "freestyle-sh";

  import { onMount } from "svelte";
    import ViewLine from "./ViewLine.svelte";

  export let apiKey: string;
  export let id: string;
  
  const storyData = useCloud<typeof Story>(id);

  let isLoadingStory = false;
  let hasLoadedStory = false; // for first load

  let metadata: IMetadata<IStoryMeta>;
  let lines: ILine[];

  let changed = false;

  function loadStory()
  {
    isLoadingStory = true;
    storyData.getMetadata().then((newMetadata) => metadata = newMetadata);
    storyData.getLines().then((newLines) => {
        hasLoadedStory = true;
        isLoadingStory = false;
        lines = newLines;
        changed = false;
    })
  }

  function saveMetadata()
  {
    storyData.setMetadata(metadata).then((resp) => {
        // TODO handle error
    });
  }

  function handleBlur()
  {
    saveMetadata();
  }

  function saveLine()
  {
    // TODO
  }

  onMount(() => {
    loadStory();
  });

  function handleSave()
  {
    // TODO ?
  }

  function handleNewLine()
  {
    isLoadingStory = true;
    storyData.createLine().then((resp) => {
        if (resp.success)
        {
            loadStory();
            // TODO focus on new line
            return;
        }
        alert ('error creating line: ' + resp.errorMessage);
        isLoadingStory = false;
    });
  }

  function handleDuplicate()
  {
    alert('Not implemented yet')
  }

  function handleArchive()
  {
    metadata.archived = true;
    saveMetadata();
    // TODO close story and go back to top
  }
</script>

<div>
    {#if hasLoadedStory}
        <div class="flex flex-row space-x-4 items-center justify-between">
            <input 
                bind:value={metadata.name}
                on:blur={handleBlur}
                type="text" placeholder="Story title" 
                class="font-bold input input-ghost grow input-lg"
                use:blurOnEnterEscape
            />

            <span class="loading loading-spinner loading-lg {isLoadingStory ? '' : 'invisible'}"></span>

            <CActionsMenu
                label='...'
                id=''
                config={[
                    {
                        text: 'Duplicate',
                        onClick: handleDuplicate,
                    },
                    {
                        text: 'Archive',
                        onClick: handleArchive,
                    }
                ]}
            />

            <button
                class="btn {changed ? 'btn-primary' : 'btn-disabled'}"
                on:click={handleSave}
            >
                {changed ? 'Save!' : 'Saved'}
            </button>
        </div>

        <div class="flex gap-4 flex-col">
            <CGTextArea
                label="Story style"
                bind:text={metadata.meta.style}
                onBlur={handleBlur}
            />

            {#each lines as line (line.id)}
                <ViewLine 
                    apiKey={apiKey}
                    line={line}
                    saveLine={saveLine}
                    style={metadata.meta.style}
                />
            {/each}
            

            <div class="flex flex-row space-x-4 items-center justify-between">
                <button
                    class="btn btn-secondary"
                    on:click={handleNewLine}
                >
                    + New Line
                </button>
            </div>
        </div>
    {/if}


    {#if !hasLoadedStory}
        <div>
            Loading story <span class="loading loading-spinner loading-lg"></span>
        </div>
    {/if}
</div>

