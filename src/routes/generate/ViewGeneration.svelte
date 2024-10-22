<script lang="ts">
    import { stringify } from "postcss";
  import type { Database, Story, IGeneration, ILine, IListSummary, IPromptStatus, IMetadata } from "./story-data";

  import { onMount } from "svelte";

  export let apiKey: string;
  export let generation: IGeneration;

  onMount(() =>
  {
    if (!generation.image && generation.status !== 'loading' && generation.status !== 'deleted')
    {
        sendPrompt();
    }
  });

  async function sendPrompt()
  {
    if (generation.promptUsed.length > 4000)
    {
        alert ("Prompt too long! Max length is 4000");
        return;
    }

    try {
        generation.status='loading';

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: generation.promptUsed,
                n: 1,
                size: '1792x1024',
                model: 'dall-e-3',
                quality: 'hd',
                response_format: 'b64_json',
                style: 'vivid', // TODO try 'vivid'
                // user: line.id, // TODO change to user's id
            })
        });

        const data = await response.json();

        if (response.ok) {
            const base64Image = 'data:image/png;base64,' + data.data[0].b64_json;
            displayImage(base64Image);
        } else {
            generation.status = 'error';
            // throw new Error(data.error.message);
        }
    } catch (error: any) {
        console.error('Error generating image:', error);
        // alert('Error: ' + error.message);
        generation.status = 'error';
    }
  }

  function displayImage(base64Image: string)
  {
    // TODO save image if needed

    generation.image = base64Image;
    generation.status = 'success';
  }
</script>

<div class="grow">
    {#if generation.status == 'error'}
        Error!
    {/if}
    {#if generation.status == 'success'}
        <img 
            class="max-w-40 max-h-40"
            src={generation.image}
        />
    {/if}
    {#if generation.status == 'loading'}
        <span class="loading loading-spinner loading-lg"></span>
    {/if}
</div>

