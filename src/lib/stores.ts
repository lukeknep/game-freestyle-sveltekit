import { writable } from 'svelte/store';
import { browser } from '$app/environment'

export const gamesStore = writable(0);
export const touchGamesStore = function() 
{
    gamesStore.update((n) => Math.random());
}

export const loginStore = writable(browser ? localStorage.getItem("phone") || "" : "");
export const setLoginStore = function(phone: string) 
{
    loginStore.update((n) => {
        if (browser) 
        {
            localStorage.setItem("phone", phone);
        }
        return phone;
    });
}