import { writable } from 'svelte/store';

export const gamesStore = writable(0);
export const touchGamesStore = function() 
{
    gamesStore.update((n) => Math.random());
}