import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './section-component';
import { GameStore } from '../store';
import gcss from '../globalcss';
import { Game } from '../../../types/binering/Game';
import { derived, Writable } from 'svelte/store';
import { StoreSubscriber } from 'lit-svelte-stores';
@customElement('board-component')
export class BoardComponent extends LitElement {
  game = new StoreSubscriber(this, () => GameStore);

  async playAgain() {
    await this.game.value.startNewGame();
    GameStore.update(val => {
      val = this.game.value;
      return val;
    });
  }
  gameStatus(div: string) {
    if (div == 'status')
      return this.game.value.game_finished == true ? '' : 'hide';
    else return this.game.value.game_finished == true ? 'gamedisabled' : '';
  }
  render() {
    return html`
      <div class="${this.gameStatus('status')}">
        <h4>${this.game.value.Winner!}</h4>
        <button @click=${this.playAgain}>Play Again!</button>
      </div>
      <div class="container ${this.gameStatus('game')}">
        <section-component .playerId=${1}></section-component>
        <section-component .playerId=${2}></section-component>
      </div>
    `;
  }
  static get styles() {
    return [
      gcss,
      css`
        div.container {
          display: grid;
          grid-template-columns: repeat(2, auto);
          column-gap: 10rem;
        }
        .gamedisabled {
          pointer-events: none;
          opacity: 0.5;
        }
        .hide {
          display: none;
        }
        button {
          cursor: pointer;
          background-color: #c24bcd; /* Green */
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 1em;
          border-radius: 12px;
          margin-bottom: 25px;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
        }
      `,
    ];
  }
}
