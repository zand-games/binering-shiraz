import '@webcomponents/scoped-custom-element-registry';

import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AppWebsocket, InstalledCell } from '@holochain/client';
import { ContextProvider } from '@holochain-open-dev/context';
import '@material/mwc-circular-progress';

import './components/binering/shiraz/create-game';
import './components/binering/shiraz/game-detail';
import './components/binering/shiraz/board';
import { appWebsocketContext, appInfoContext } from './contexts';

@customElement('holochain-app')
export class HolochainApp extends LitElement {
  @state() loading = true;
  @state() entryHash: string | undefined;

  async firstUpdated() {
    const appWebsocket = await AppWebsocket.connect(
      `ws://localhost:${process.env.HC_PORT}`
    );

    new ContextProvider(this, appWebsocketContext, appWebsocket);

    const appInfo = await appWebsocket.appInfo({
      installed_app_id: 'binering-app',
    });
    new ContextProvider(this, appInfoContext, appInfo);

    this.loading = false;
  }

  render() {
    // if (this.loading)
    //   return html`
    //     <mwc-circular-progress indeterminate></mwc-circular-progress>
    //   `;

    return html`
      <main>
        <h1>binering-app</h1>

        <board-game></board-game>
        <!-- <create-game
          @game-created=${(e: CustomEvent) =>
          (this.entryHash = e.detail.entryHash)}
        ></create-game>
        ${this.entryHash
          ? html` <game-detail .entryHash=${this.entryHash}></game-detail> `
          : html``} -->
      </main>
    `;
  }

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--lit-element-background-color);
    }

    main {
      flex-grow: 1;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;
}
