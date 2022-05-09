import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './section-component';
import { GameStore } from '../store';
import gcss from '../globalcss';
import { Game } from '../../../types/binering/Game';
import { derived, Writable } from 'svelte/store';
import { StoreSubscriber } from 'lit-svelte-stores';
import './playertype-component';
@customElement('board-component')
export class BoardComponent extends LitElement {
  game = new StoreSubscriber(this, () => GameStore);

  async play_again() {
    if (this.game.value.game_finished) await this.game.value.startNewGame();
    else await this.game.value.startNewRound();
    GameStore.update(val => {
      val = this.game.value;
      return val;
    });
  }

  render() {
    return html`
      <div
        class="${this.game.value.game_finished == true ||
        this.game.value.round_finished == true
          ? 'show'
          : 'hide'}"
      >
        <h4>${this.game.value.looser!}</h4>
        <button @click=${this.play_again}>
          ${this.game.value.game_finished
            ? 'Play new game!'
            : 'Play new round!'}
        </button>
      </div>
      <playertype-component></playertype-component>

      <div
        class="container ${this.game.value.game_finished == true ||
        this.game.value.round_finished
          ? 'gamedisabled'
          : ''}"
      >
        <div>
          <section-component .playerId=${1}></section-component>
        </div>
        <div>
          <section-component .playerId=${2}></section-component>
        </div>
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
        .show {
          display: inline;
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
