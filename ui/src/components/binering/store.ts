import { writable, Readable, readable } from 'svelte/store';
import { Game } from '../../types/binering/Game';

export let GameStore = writable<Game>(new Game());
