<script lang="ts">

  export let label: string;
  export let id: string; // gets passed in with the event handlers
  export let config: { text: string, onClick: (id: string) => void }[];

</script>

<div class="dropdown dropdown-hover dropdown-end">
    <div tabindex="0" role="button" class="btn m-1">
        {label}
    </div>
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        {#each config as item}
            <li>
                <a on:click={() => item.onClick(id)}>
                    {item.text}
                </a>
            </li>
        {/each}
    </ul>
  </div>