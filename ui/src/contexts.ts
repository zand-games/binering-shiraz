import { Context, createContext } from '@holochain-open-dev/context';
import { AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { GameStore } from './components/binering/store';

export const appWebsocketContext: Context<AppWebsocket> =
  createContext('appWebsocket');
export const appInfoContext: Context<InstalledAppInfo> =
  createContext('appInfo');

// export const gameStoreContext: Context<GameStore> = createContext('game/store');
