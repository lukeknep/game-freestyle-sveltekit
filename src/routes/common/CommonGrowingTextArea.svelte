<script lang="ts">

  import { blurOnEnterEscape } from '$lib/svelte-tools';

  export let text: string;
  export let label: string = '';
  export let onBlur: () => void = () => {console.log('blur')};
</script>

<div class="form-control">
    {#if label}
    <div class="label">
        <span class="label-text">{ label }</span>
        </div>
    {/if}

    <div class="flex-1 grow">
        <div class="
            grid
            text-sm
            [&>textarea]:text-inherit
            [&>textarea]:resize-none
            [&>textarea]:overflow-hidden
            [&>textarea]:[grid-area:1/1/2/2]
            
        ">
            <textarea
                class="w-full text-slate-600 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                rows="1"
                bind:value={ text }
                placeholder="..."
                required
                on:blur={onBlur}
            ></textarea>
            <div class="
                [grid-area:1/1/2/2]
                whitespace-pre-wrap
                invisible
                border
                px-3.5
                py-2.5
                text-inherit
            ">
                { text }
            </div>
        </div>
    </div>
</div>