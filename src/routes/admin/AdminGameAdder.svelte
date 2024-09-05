<script lang="ts">
  import type { DataManager } from "$lib/data";
  import { generateWords, generateRounds } from "$lib/game-tools";
  import { touchGamesStore } from "$lib/stores";

  import { useCloud } from "freestyle-sh";
  import { onMount } from "svelte";

  const gameManager = useCloud<typeof DataManager>("DataManager");

  export let adminPassword: string;

  let words: string[] = generateWords();
  let rounds = generateRounds(5, 3);
  let clues = ["","",""];

  let showingAdvanced = false;
  let advancedJSON = "";

  function getNewWords()
  {
    words = generateWords();
    rounds = generateRounds(5,3);
    clues = ["","",""];
  }

  onMount(() => {
    getNewWords();
  });

  function saveGame()
  {
    gameManager.saveGame(adminPassword, words, rounds, clues).then(() => {
      getNewWords();
      touchGamesStore();
    });
  }

  function saveAdvancedJSON()
  {
    try {
      let obj = JSON.parse(advancedJSON)
      if (!obj.words || !obj.rounds || !obj.exampleClues)
      {
        alert ("Missing object propeties. See Console");
        console.log(obj);
        return;
      }
      gameManager.saveGame(adminPassword, obj.words, obj.rounds, obj.exampleClues);
      advancedJSON = "";
    } catch(e) {
      alert ("Unable to save JSON. See Console.");
      console.log(e);
    }
    
  }

</script>

<h2> Add Game </h2>

<div class="counter">
  <button
    on:click={getNewWords}
  >
    New Words
  </button>

  {#each rounds as round, roundIndex}
    <div class="counter-viewport">
        {#each words as word, index}
            <div class="{round.answers[index] ? "word-correct" : "" } word">{word}</div>
        {/each}
        <input type="text" bind:value={clues[roundIndex]} />
    </div>
  {/each}

  <button
    on:click={saveGame}
    class="btn"
  >
    Save Game
  </button>
</div>

<div>
  <div on:click={() => showingAdvanced = !showingAdvanced}> Toggle Advanced </div>
  {#if showingAdvanced}
    <input 
      type="text" 
      placeholder="JSON of game to save"
      bind:value={advancedJSON}
    />
    <button class="btn" on:click={saveAdvancedJSON}>Save Game from JSON</button>
  {/if}
</div>

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
