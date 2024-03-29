import '@webcomponents/scoped-custom-element-registry';

import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './components/binering/shiraz/create-game';
import './components/binering/shiraz/game-detail';
import './components/binering/shiraz/board-component';
import './components/message-box';
import { appWebsocketContext, appInfoContext } from './contexts';
import './components/binering/shiraz/help-component';
@customElement('game-app')
export class GameApp extends LitElement {
  render() {
    return html`
      <main>
        <h1 class="nonselectable">
          <a class="title" href="https://zand.games">Shiraz Game</a>
          <help-component></help-component>
        </h1>
        <board-component></board-component>
        <footer class="nonselectable">
          <h6>
            © 2022
            <a class="footerlink" target="_blank" href="https://zand.games"
              >Zand.Games</a
            >
          </h6>
        </footer>
      </main>
    `;
  }

  static styles = css`
    .footerlink {
      color: white;
      text-decoration: none;
    }
    .title {
      text-decoration: none;
    }
    footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      align-items: center;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      z-index: 300;
      opacity: 0.5;
      /* background-color: rgb(154 181 3 / 100%); */
    }

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

    h1 {
      position: relative;
      z-index: 5;
      text-shadow: 2px 2px 5px white;
    }
    h6 {
      padding-top: 10px;
      margin: 0;
      color: white;
    }
    main {
      flex-grow: 1;
    }

    .app-footer {
      font-size: 0.6em;
      align-items: center;
      opacity: 0.5;
    }

    .app-footer a {
      margin-left: 5px;
    }
    .nonselectable {
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* IE10+/Edge */
      user-select: none; /* Standard */
    }
  `;
}
