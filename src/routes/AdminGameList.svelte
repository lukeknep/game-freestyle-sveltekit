<script lang="ts">
    import type { Game } from "$lib/game-tools";
  import type GameManager from "$lib/game";
  import { gamesStore } from "$lib/stores";

  import { useCloud } from "freestyle-sh";
  import { onMount } from "svelte";



  const gameManager = useCloud<typeof GameManager>("game-manager");

  let games: Game[] = [];
  let serverGames: Game[] = [];
  

  onMount(() => {
    refreshGames();
  });

  gamesStore.subscribe(() => { refreshGames() });

  function setLocalGames(newGames: Game[])
  {
    if (!newGames) {
        return;
    }
    games = newGames;
    serverGames = JSON.parse(JSON.stringify(newGames)) as any as Game[];
  }

  function refreshGames() 
  {
    gameManager.getGames().then(setLocalGames);
  }

  function deleteGame(gameId: number)
  {
    gameManager.deleteGame(gameId).then(setLocalGames);
  }

  function approveGame(gameId: number, active: boolean)
  {
    gameManager.setGame(gameId, {
        active,
    })
    .then(setLocalGames);
  }

  function saveGame(gameId: number)
  {
    const game = games.find((l) => l.id == gameId);
    if (game !== undefined)
    {
        gameManager.setGame(gameId, game)
            .then(setLocalGames);
    }
  }

</script>

<h2> All {games ? games.length : 0} Games </h2>

{#each games as game, gameIndex (game.id)}
    <div class="counter-wrapper">
        <div class="counter-top" on:click={() => alert(JSON.stringify(game))}>
            Game {game.id}
        </div>
        <div class="counter">
            <button
                on:click={() => deleteGame(game.id)}
            >
                Delete
            </button>

            {#each game.rounds as round, roundIndex}
                <div class="counter-viewport">
                    {#each game.words as word, index}
                        <div class="{round.answers[index] ? "word-correct" : "" } word">{word}</div>
                    {/each}
                    <input type="text" bind:value={game.exampleClues[roundIndex]} />
                </div>
            {/each}

            <button
                on:click={() => saveGame(game.id)}
                class="fixed-width-button"
            >
                { 
                    game.exampleClues.every((c, i) => serverGames[gameIndex].exampleClues[i] == c) ? "" : "Save Changes" 
                }
            </button>

            <button
                on:click={() => approveGame(game.id, !game.active)}
            >
                { game.active ? "Deactivate" : "Approve" }
            </button>
        </div>
    </div>
{/each}

<style>
  .word-correct {
    font-weight: bold;
  }

  .counter {
    display: flex;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
  }

  .counter button {
    /* width: 2em; */
    padding: 0px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background-color: transparent;
    touch-action: manipulation;
    font-size: 1rem;
    cursor: pointer;
  }

  .fixed-width-button {
    width: 100px;
  }

  .counter button:hover {
    background-color: var(--color-bg-1);
  }

  svg {
    width: 25%;
    height: 25%;
  }

  path {
    vector-effect: non-scaling-stroke;
    stroke-width: 2px;
    stroke: #444;
  }

  .counter-viewport {
    width: 200px;
    text-align: center;
    position: relative;
  }

  .counter-viewport strong {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    font-weight: 400;
    color: var(--color-theme-1);
    font-size: 4rem;
    align-items: center;
    justify-content: center;
  }

  .counter-digits {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .hidden {
    top: -100%;
    user-select: none;
  }
</style>
