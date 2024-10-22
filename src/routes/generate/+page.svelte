<script lang='ts'>
  	import type { PageData } from './$types';
	import Generate from './Generate.svelte';

    import { browser } from '$app/environment'

	export let data: PageData;

    let password = "";
	let selectedStoryId = "";
    if (browser)
    {
        password = localStorage.getItem('generatePassword') || "";
		selectedStoryId = localStorage.getItem('generateSelectedStoryId') || "";
    }
    let passwordSaved = password !== "";

    function savePass()
    {
        passwordSaved = true;
        if (browser)
        {
            localStorage.setItem('generatePassword', password);
        }
    }
</script>

<svelte:head>
	<title>Stories!</title>
	<meta name="description" content="" />
</svelte:head>

<section>

    {#if !passwordSaved}
        <input
            type="text"
            bind:value={password}
            placeholder="apikey"
        />
        <button on:click={savePass}>Enter</button>
    {/if}
    {#if passwordSaved}
        <Generate
            apiKey={password}
         />
    {/if}
	

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
