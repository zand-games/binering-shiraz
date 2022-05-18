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
      <div class="data">
        <a
          class="location"
          target="_blank"
          href="${this.game.value.locationUrl}"
          >${this.game.value.location}</a
        >
      </div>
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

      <div id="bg">
        <iframe
          width="1080"
          height="1080"
          id="gmap_canvas"
          src="https://maps.google.com/maps?q=${this.game.value
            .coordination}&t=&z=3&ie=UTF8&iwloc=&output=embed"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
        ></iframe>
      </div>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
  }
  static get styles() {
    return [
      gcss,
      css`
        #bg {
          position: absolute;
          top: -5px;
          left: 0;
          width: 100%;
          height: 100%;
        }
        #bg iframe {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          min-width: 100%;
          min-height: 100%;
          z-index: 0;
        }
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
        .data {
          background-color: silver;
          font-size: 0.7em;
          background-color: #891d1d;
          color: #fff3e3;
          margin-bottom: 1.5em;
          padding: 0.4em;
          overflow: auto;
          border-radius: 12px;
        }

        .location {
          text-decoration: none;
          color: whitesmoke;
        }
      `,
    ];
  }
}
