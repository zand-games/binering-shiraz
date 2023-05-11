import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './section-component';
import { GameStore } from '../store';
import gcss from '../globalcss';
import { StoreSubscriber } from 'lit-svelte-stores';
import './playertype-component';
import './map-component';
let BoardComponent = class BoardComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.game = new StoreSubscriber(this, () => GameStore);
        this.show_map = true;
    }
    firstUpdated() {
        var map = this.shadowRoot.getElementById('map');
        map === null || map === void 0 ? void 0 : map.addEventListener('dblclick', event => { });
    }
    async play_again() {
        if (this.game.value.game_finished)
            await this.game.value.startNewGame();
        else
            await this.game.value.startNewRound();
        GameStore.update(val => {
            val = this.game.value;
            return val;
        });
    }
    show_hide_board(e) {
        var section = this.shadowRoot.getElementById('gamesection');
        debugger;
        if (Boolean(e.detail.status) == false) {
            section === null || section === void 0 ? void 0 : section.classList.remove('showgame');
            section === null || section === void 0 ? void 0 : section.classList.add('hidegame');
        }
        else {
            section === null || section === void 0 ? void 0 : section.classList.remove('hidegame');
            section === null || section === void 0 ? void 0 : section.classList.add('showgame');
        }
    }
    render() {
        return html `
      <map-component
        @boardStatus=${this.show_hide_board}
        id="map"
        .coordination=${this.game.value.locations}
      ></map-component>
      <secion id="gamesection" class="nonselectable">
        <div
          class="${this.game.value.game_finished == true ||
            this.game.value.round_finished == true
            ? 'show'
            : 'hide'}"
        >
          <h4>${this.game.value.looser}</h4>
          <button @click=${this.play_again}>
            ${this.game.value.game_finished
            ? 'Play new game!'
            : 'Play new round!'}
          </button>
        </div>
        <playertype-component class="nonselectable"></playertype-component>
        <div
          class="container ${this.game.value.game_finished == true ||
            this.game.value.round_finished
            ? 'gamedisabled'
            : ''}"
        >
          <div>
            <section-component
              class="nonselectable"
              .playerId=${1}
            ></section-component>
          </div>
          <div>
            <section-component
              class="nonselectable"
              .playerId=${2}
            ></section-component>
          </div>
        </div>
      </secion>
    `;
    }
    show_map_click() { }
    connectedCallback() {
        super.connectedCallback();
    }
    static get styles() {
        return [
            gcss,
            css `
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
          opacity: 0.8;
        }

        .location {
          text-decoration: none;
          color: whitesmoke;
        }
        .showmap {
          font-size: 0.7em;
          font-family: 'courier', 'sans-serif', 'Serif';
          margin-top: -50px;
        }

        .hidegame {
          //visibility: visible;
          display: none;
        }
        .showgame {
          //visibility: hidden;
          display: inline;
        }
        .nonselectable {
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
        }
      `,
        ];
    }
};
__decorate([
    state()
], BoardComponent.prototype, "show_map", void 0);
BoardComponent = __decorate([
    customElement('board-component')
], BoardComponent);
export { BoardComponent };
//# sourceMappingURL=board-component.js.map