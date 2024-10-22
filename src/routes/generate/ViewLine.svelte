<script lang="ts">
  import type { Database, Story, IGeneration, ILine, IListSummary, IPromptStatus, IMetadata } from "./story-data";
  import CGTextArea from "../common/CommonGrowingTextArea.svelte";
  import ViewGeneration from "./ViewGeneration.svelte";

  import { newIGeneration } from "./story-data-utils";

  import { blurOnEnterEscape } from '$lib/svelte-tools';

  import { useCloud } from "freestyle-sh";

  import { onMount } from "svelte";

  export let apiKey: string;
  export let line: ILine;
  export let style: string;
  export let saveLine: () => void; // TODO change to correct signature
  
  let modified = false;

  function handleSave()
  {
    // TODO ?
  }

  function handleGenerate()
  {
    console.log('gen', line.numInitialGenerations);
    
    let oldGens = line.generations;
    line.generations = [];
    oldGens.map((gen) => line.generations.push(gen)); // TODO find out if there's a better way to do this in svelte

    for (let i = 0; i < line.numInitialGenerations; i ++)
    {
        line.generations.push(newIGeneration(line, style));
    }
  }
</script>

<div>
    <div class="card bg-base-100 shadow-xl max-w-full content-start justify-content-start">
        <div class="card-body">
            <h2 class="card-title"
                style="margin: -2rem; margin-bottom: 0px;"
            >
                <textarea
                    class="w-full text-slate-600 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    rows="1"
                    bind:value={ line.text }
                    placeholder="..."
                    required
                ></textarea>
            </h2>

            <CGTextArea
                label="Image Prompt"
                bind:text={ line.imagePrompt }
            />

            <div class="flex flex-wrap">
                {#each line.generations as gen (gen.id)}
                    <ViewGeneration
                        bind:generation={gen}
                        apiKey={apiKey}
                    />
                {/each}
            </div>
          
            <div class="card-actions justify-end">
                <button 
                    class="btn btn-primary"
                    on:click={handleGenerate}
                >
                    Generate Images
                </button>
            </div>
      </div>        
    </div>
</div>

