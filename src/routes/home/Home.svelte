<script lang="ts">
  import type { Game } from "$lib/game-tools";
  import type { DataManager } from "$lib/data";

  import { useCloud } from "freestyle-sh";

  import { onMount } from "svelte";


  const server = useCloud<typeof DataManager>("DataManager");
  let todaysGames: Game[] = [];
  let loadingTodaysGames = true;

  function setTodaysGames(newGames: Game[])
  {
    if (!newGames) {
        return;
    }
    todaysGames = newGames;
    loadingTodaysGames = false;

    if (newGames.some((g) => !g))
    {
        alert ("Some games were null");
    }
  }

  function loadGames() 
  {
    loadingTodaysGames = true;
    server.getTodaysGames().then(setTodaysGames);
  }

  onMount(() => {
    loadGames();
  })
</script>

<div>
    <div class="text-3xl"> 
        Todays {!todaysGames.length && loadingTodaysGames ? '...' : todaysGames.length} Games
    </div>

    {#each todaysGames as game, gameIndex (game.id)}
        <div>
            Game: {game.id}
        </div>
    {/each}

    <div>{ loadingTodaysGames }</div>
</div>

