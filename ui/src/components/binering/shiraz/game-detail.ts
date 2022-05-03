import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import {
  InstalledCell,
  AppWebsocket,
  InstalledAppInfo,
} from '@holochain/client';
import { contextProvided } from '@holochain-open-dev/context';
import { appInfoContext, appWebsocketContext } from '../../../contexts';
import { Game } from '../../../types/binering/shiraz';
import '@material/mwc-circular-progress';
import '@type-craft/title/title-detail';
import '@type-craft/content/content-detail';

@customElement('game-detail')
export class GameDetail extends LitElement {
  @property()
  entryHash!: string;

  @state()
  _game: Game | undefined;

  @contextProvided({ context: appWebsocketContext })
  appWebsocket!: AppWebsocket;

  @contextProvided({ context: appInfoContext })
  appInfo!: InstalledAppInfo;

  async firstUpdated() {
    const cellData = this.appInfo.cell_data.find(
      (c: InstalledCell) => c.role_id === 'binering'
    )!;

    this._game = await this.appWebsocket.callZome({
      cap_secret: null,
      cell_id: cellData.cell_id,
      zome_name: 'shiraz',
      fn_name: 'get_game',
      payload: this.entryHash,
      provenance: cellData.cell_id[1],
    });
  }

  render() {
    if (!this._game) {
      return html`<div
        style="display: flex; flex: 1; align-items: center; justify-content: center"
      >
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;
    }
    return html`
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Game</span>
        <title-detail
          .value=${this._game.title}
          style="margin-top: 16px"
        ></title-detail>
        <content-detail
          .value=${this._game.content}
          style="margin-top: 16px"
        ></content-detail>
      </div>
    `;
  }
}
