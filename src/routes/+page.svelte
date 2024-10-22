<script lang='ts'>
  	import type { PageData } from './$types';
	import Home from './home/Home.svelte';
	import Login from './login/Login.svelte';

	export let data: PageData;

	let loggedIn = false;

	import { loginStore } from "$lib/stores";

	loginStore.subscribe((value: string) => {
		console.log(value);
		if (value)
		{
			loggedIn = true;
		}
	});

</script>

<svelte:head>
	<title>LINKFAST!</title>
	<meta name="description" content="Funnest word game on the Internet! according to at least two people" />
</svelte:head>

<section>
	{#if loggedIn}
		<Home />
	{/if}
	{#if !loggedIn}
		<Login />
	{/if}
</section>
