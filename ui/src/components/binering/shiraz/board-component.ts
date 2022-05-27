import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './section-component';
import { GameStore } from '../store';
import gcss from '../globalcss';
import { Game } from '../../../types/binering/Game';
import { derived, Writable } from 'svelte/store';
import { StoreSubscriber } from 'lit-svelte-stores';
import './playertype-component';
import './map-component';
@customElement('board-component')
export class BoardComponent extends LitElement {
  game = new StoreSubscriber(this, () => GameStore);
  firstUpdated() {
    var map = this.shadowRoot!.getElementById('map');

    map?.addEventListener('dblclick', event => {
      console.log('Double-click detected');
      var section = this.shadowRoot!.getElementById('gamesection');

      if (section?.classList.contains('showgame')) {
        section.classList.remove('showgame');
        section.classList.add('hidegame');
      } else {
        section?.classList.remove('hidegame');
        section?.classList.add('showgame');
      }

      // Double-click detected
    });
  }
  async play_again() {
    if (this.game.value.game_finished) await this.game.value.startNewGame();
    else await this.game.value.startNewRound();
    GameStore.update(val => {
      val = this.game.value;
      return val;
    });
  }
  @state()
  show_map: boolean = true;

  render() {
    return html`
      <map-component
        id="map"
        .userId=${this.game.value.coordination}
      ></map-component>
      <secion id="gamesection">
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
        <playertype-component class="nonselectable"></playertype-component>
        <div class="data nonselectable">
          <a
            class="location"
            target="_blank"
            href="${this.game.value.locationUrl}"
            >You here! on the map</a
          >
        </div>
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
  show_map_click() {
    // this.show_map = !this.show_map;
    // // console.log(this.show_map);
    // var iframe = this.shadowRoot?.querySelector(
    //   '#gmap_canvas'
    // ) as HTMLIFrameElement;
    // if (this.show_map) {
    //   iframe.style.visibility = 'visible';
    // } else {
    //   iframe.style.visibility = 'hidden';
    // }
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
}
