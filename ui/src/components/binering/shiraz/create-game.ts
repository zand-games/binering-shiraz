
import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { InstalledCell, AppWebsocket, InstalledAppInfo } from '@holochain/client';
import { contextProvided } from '@holochain-open-dev/context';
import { appWebsocketContext, appInfoContext } from '../../../contexts';
import { Game } from '../../../types/binering/shiraz';
import '@material/mwc-button';
import '@type-craft/title/create-title';
import '@type-craft/content/create-content';

@customElement('create-game')
export class CreateGame extends LitElement {

    @state()
  _title: string | undefined;

  @state()
  _content: string | undefined;

  isGameValid() {
    return this._title && 
      this._content;
  }

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async createGame() {
    const cellData = this.appInfo.cell_data.find((c: InstalledCell) => c.role_id === 'binering')!;

    const game: Game = {
      title: this._title!,
        content: this._content!,
    };

    const { entryHash } = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'shiraz',
      fn_name: 'create_game',
      payload: game,
      provenance: cellData.cell_id[1]
    });

    this.dispatchEvent(new CustomEvent('game-created', {
      composed: true,
      bubbles: true,
      detail: {
        entryHash
      }
    }));
  }

  render() {
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Game</span>

        <create-title 
      
      @change=${(e: Event) => this._title = (e.target as any).value}
      style="margin-top: 16px"
    ></create-title>

        <create-content 
      
      @change=${(e: Event) => this._content = (e.target as any).value}
      style="margin-top: 16px"
    ></create-content>

        <mwc-button 
          label="Create Game"
          .disabled=${!this.isGameValid()}
          @click=${() => this.createGame()}
        ></mwc-button>
    </div>`;
  }
}
