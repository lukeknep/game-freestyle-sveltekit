<script lang="ts">
  import type { Database, Story, IGeneration, ILine, IListSummary, IPromptStatus } from "./story-data";
  import ViewStory from './ViewStory.svelte';

  import { useCloud } from "freestyle-sh";

  import { onMount } from "svelte";

  export let apiKey: string;
  
  let selectedStoryId: string = ''; // TODO make this in Props


  const database = useCloud<typeof Database>("DatabaseX");

  let storyList: IListSummary = [];
  let isLoadingStoryList = false;
  let hasLoadedStories = false; // for first load



  function loadStories()
  {
    isLoadingStoryList = true;
    database.getStoryList().then((newStoryList) =>
    {
        console.log(newStoryList);
        isLoadingStoryList = false;
        hasLoadedStories = true; // just for first load
        storyList = newStoryList;
    });
  }

  function selectStory(storyId: string)
  {
    selectedStoryId = storyId;
  }

  function createStory()
  {
    console.log('create');
    database.createStory().then((response) =>
    {
        console.log(response);
    });
  }

  onMount(() => {
    loadStories();
  });

</script>

<div>
    {#if selectedStoryId}
        {#each [selectedStoryId] as s (selectedStoryId) }
            <ViewStory
                id={selectedStoryId}
                apiKey={apiKey}
            />
        {/each}
        
    {/if}

    {#if hasLoadedStories}
        {#if !selectedStoryId}
            <div class="text-1xl">
                Your Stories!
                {#if isLoadingStoryList}
                    <span class="loading loading-spinner loading-lg"></span>
                {/if}
            </div>

            <div class="flex flex-col gap-4">
                {#each storyList as storySummary (storySummary.id)}
                    <div class="card bg-base-100 w-96 shadow-xl">
                        <div class="card-body">
                            <h2 class="card-title">
                                <div class="flex">
                                    <div class="grow">
                                        { storySummary.name }
                                    </div>
                                </div>
                            </h2>
                            <p>Edited {storySummary.updatedAtMillis}</p>
                            <div class="card-actions justify-end">
                                <button 
                                    class="btn btn-neutral"
                                    on:click={() => selectStory(storySummary.id)}
                                >
                                    Work on it
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <div
                class="btn btn-primary"
                on:click={() => createStory()}
            >
                + New Story 
            </div>
        {/if}
    {/if}

    {#if !hasLoadedStories}
        <div>
            Starting up <span class="loading loading-spinner loading-lg"></span>
        </div>
    {/if}
</div>

