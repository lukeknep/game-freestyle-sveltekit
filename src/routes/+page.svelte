<script lang='ts'>
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcome_fallback from '$lib/images/svelte-welcome.png';
  	import type { PageData } from './$types';
	// import GameList from './GameList.svelte';
	import AdminGameAdder from './AdminGameAdder.svelte';
	import AdminGameList from './AdminGameList.svelte';

	export let data: PageData;

</script>

<svelte:head>
	<title>LINKFAST!</title>
	<meta name="description" content="Funnest word game on the Internet! according to at least two people" />
</svelte:head>

<section>
	<h1>
		Admin Page
	</h1>

	<AdminGameAdder />

	<AdminGameList />
	

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
