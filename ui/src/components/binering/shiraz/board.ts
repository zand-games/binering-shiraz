import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './section';
import { GameStore } from '../store';
import gcss from '../globalcss';
import { Game } from '../../../types/binering/Game';
import { derived, Writable } from 'svelte/store';
import { StoreSubscriber } from 'lit-svelte-stores';
@customElement('board-component')
export class BoardComponent extends LitElement {
  @property()
  private game!: Game;

  connectedCallback() {
    super.connectedCallback();
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="container">
        <section-component .playerId=${1}></section-component>
        <section-component .playerId=${2}></section-component>
      </div>
    `;
  }
  click() {
    // GameStore.update(val => {
    //   val.players[1].counter = val.players[1].counter + 1;
    //   return val;
    // });
    // GameStore2.update(x => {
    //   x.counter += 1;
    //   return x;
    // });
    //  this.requestUpdate();

    //alert();
    //this.player.age //.update((count) => count + 1);
    //console.log(this.store.value);
    // GameStore.set(new Player(4));
    // console.log(this.player.age);
    this.game.players[1].decks[0].removeSimilarCardsFromLastPosition();

    GameStore.update(i => this.game);

    // GameStore.update(value=>
    //   value.players[0].decks[0].removeSimilarCardsFromLastPosition());
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
      `,
    ];
  }
}
