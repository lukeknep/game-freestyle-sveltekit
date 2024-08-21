<script lang="ts">
    import type { Level } from "$lib/game";
  import type LevelManager from "$lib/level";

  import { useCloud } from "freestyle-sh";
  import { onMount } from "svelte";

  const levelManager = useCloud<typeof LevelManager>("level-manager");

  let levels: Level[] = [];

  onMount(() => {
    refreshLevels();
  });

  function refreshLevels() 
  {
    levelManager.getLevels().then((newLevels) => {
        if (!newLevels) {
            return;
        }
        levels = Object.values(newLevels).sort((a,b) => {
            return a.createdAtMillis - b.createdAtMillis;
        });
    });
  }

</script>

<h2> All {levels ? levels.length : 0} Levels </h2>

{#each levels as level (level.id)}
    <div class="counter">
    <button
        on:click={() => {}}
    >
        Delete Level
    </button>

    {#each level.rounds as round, roundIndex}
        <div class="counter-viewport">
            {#each level.words as word, index}
                <div class="{round.answers[index] ? "word-correct" : "" } word">{word}</div>
            {/each}
            <input type="text" bind:value={level.exampleClues[roundIndex]} />
        </div>
    {/each}

    <button
        on:click={() => {}}
    >
        Approve Level
    </button>
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
