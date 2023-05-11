import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { contextProvided } from '@holochain-open-dev/context';
import { appWebsocketContext, appInfoContext } from '../../../contexts';
import '@material/mwc-button';
import '@type-craft/title/create-title';
import '@type-craft/content/create-content';
let CreateGame = class CreateGame extends LitElement {
    isGameValid() {
        return this._title &&
            this._content;
    }
    async createGame() {
        const cellData = this.appInfo.cell_data.find((c) => c.role_id === 'binering');
        const game = {
            title: this._title,
            content: this._content,
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
        return html `
      <div style="display: flex; flex-direction: column">
        <span style="font-size: 18px">Create Game</span>

        <create-title 
      
      @change=${(e) => this._title = e.target.value}
      style="margin-top: 16px"
    ></create-title>

        <create-content 
      
      @change=${(e) => this._content = e.target.value}
      style="margin-top: 16px"
    ></create-content>

        <mwc-button 
          label="Create Game"
          .disabled=${!this.isGameValid()}
          @click=${() => this.createGame()}
        ></mwc-button>
    </div>`;
    }
};
__decorate([
    state()
], CreateGame.prototype, "_title", void 0);
__decorate([
    state()
], CreateGame.prototype, "_content", void 0);
__decorate([
    contextProvided({ context: appWebsocketContext })
], CreateGame.prototype, "appWebsocket", void 0);
__decorate([
    contextProvided({ context: appInfoContext })
], CreateGame.prototype, "appInfo", void 0);
CreateGame = __decorate([
    customElement('create-game')
], CreateGame);
export { CreateGame };
//# sourceMappingURL=create-game.js.map