import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './card';
import cssg from '../globalcss';

@customElement('deck-com')
export class Deck extends LitElement {
  @property()
  cards!: Array<boolean>;

  render() {
    return html` <div class="deck">
      ${this.cards.map(
        (card, i, arr) =>
          html`<card-comp
            .value=${card}
            .draggable=${arr.length - 1 === i ? true : false}
          >
          </card-comp>`
      )}
    </div>`;
  }
  /// pop  :take the last item from array, we need it for Trash dragDrop.
  // push  : add item to last postion. so we need it to internal movement.
  //unshift : add item to first position. when oponent inject card to the deck
  static get styles() {
    return [
      cssg,
      css`
        div.deck {
          display: flex;
          height: 200px;
          flex-direction: column;
        }
      `,
    ];
  }
}
