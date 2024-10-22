<script lang="ts">
  import type { DataManager } from "$lib/data";
  import { useCloud } from "freestyle-sh";
  import { onMount } from "svelte";

  import { setLoginStore } from "$lib/stores";

  const server = useCloud<typeof DataManager>("DataManager");

  import { TelInput, normalizedCountries } from 'svelte-tel-input';
  import type { DetailedValue, CountryCode, E164Number } from 'svelte-tel-input/types';

  // Any Country Code Alpha-2 (ISO 3166)
  let telCountry: CountryCode | null = 'US';

  // You must use E164 number format. It's guarantee the parsing and storing consistency.
  let telValue: E164Number | null = '';

  // Validity
  let telIsValid = false;

  // Optional - Extended details about the parsed phone number
  let telDetailedValue: DetailedValue | null = null;

  function handleLogin()
  {
    if (telIsValid)
    {
        setLoginStore("" + telValue);
    }
  }

  /* Attempted DaisyUI dropdown for Country that didn't work 

  <div class="dropdown">
            <div tabindex="0" role="button" class="btn m-1">
                {telCountry}
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                {#each normalizedCountries as currentCountry (currentCountry.id)}
                    <li><a>
                        {currentCountry.name} (+{currentCountry.dialCode})
                    </a></li>
                        
                    
                        
                {/each}
            </ul>
        </div>
*********************************/

</script>

<div>
    <div class="text-3xl"> 
        LINKFAST!
    </div>

    <div class="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
        <div class="text-2xl"> 
            Login with your phone (sends SMS)
        </div>

        <label 
            class="input input-lg input-bordered flex items-center gap-2 px-0 py-0 {telIsValid ? 'input-success' : ''}"
        >
            <select
                class="select"
                aria-label="Country code"
                name="Country"
                bind:value={telCountry}
            >
                <option value={null} hidden={telCountry !== null}>Select</option>
                {#each normalizedCountries as currentCountry (currentCountry.id)}
                <option
                    value={currentCountry.iso2}
                    selected={currentCountry.iso2 === telCountry}
                    aria-selected={currentCountry.iso2 === telCountry}
                >
                    {currentCountry.iso2} (+{currentCountry.dialCode})
                </option>
                {/each}
            </select>
            
            <TelInput
                bind:country={telCountry}
                bind:value={telValue}
                bind:valid={telIsValid}
                bind:detailedValue={telDetailedValue}
                class="{!telIsValid ? 'input-error' : ''} w-full max-w-xs"
            />
        </label>

        <button 
            class="btn btn-accent"
            on:click={handleLogin}
        >
            Login
        </button>
    </div>

</div>

