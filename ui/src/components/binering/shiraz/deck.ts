import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './card';
import cssg from '../globalcss';

@customElement('deck-com')
export class Deck extends LitElement {
  @state()
  cards!: Array<boolean>;

  @state()
  playerId: string = 'A';

  @state()
  deckId: number = 0;

  render() {
    return html` <div class="deck">
      ${this.cards.map(
        (card, i, arr) =>
          html`<card-comp
            .playerId=${this.playerId}
            .value=${card}
            .deckId=${this.deckId}
            .draggable=${arr.length - 1 === i ? true : false}
          >
          </card-comp>`
      )}
    </div>`;
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('Card_Remove_Event', e => this.cardRemoved(e));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('Card_Remove_Event', this.cardRemoved);
  }
  cardRemoved(e: any) {
    const dataArray = e.detail.split('||');
    let playerId = dataArray[0];
    let deckId = dataArray[1];
    if (
      playerId == null ||
      deckId == null ||
      playerId == undefined ||
      deckId == undefined
    )
      return;

    if (playerId == this.playerId && this.deckId == deckId) {
      //alert('palerid:' + playerId + ' \n deckId:' + deckId);
      this.cards = this.cards.splice(0, this.cards.length - 1);
    }
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
