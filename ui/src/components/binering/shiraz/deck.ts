import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './card';
import cssg from '../globalcss';
import '../events';
import { Events } from '../events';
@customElement('deck-com')
export class Deck extends LitElement {
  @state()
  cards!: Array<boolean>;

  @state()
  playerId: string = 'A';

  @state()
  deckId: number = 0;

  render() {
    return html` <div
      class="deck"
      @drop=${this.droped}
      @dragover=${this.dragovered}
      @dragenter=${this.dragEntered}
      @dragend=${this.dragended}
      @dragleave=${this.dragleaved}
    >
      ${this.cards.length > 0
        ? this.cards.map(
            (card, i, arr) =>
              html`<card-comp
                .playerId=${this.playerId}
                .value=${card}
                .deckId=${this.deckId}
                .draggable=${arr.length - 1 === i ? true : false}
              >
              </card-comp>`
          )
        : html`<div class="empty">D</div>`}
    </div>`;
  }
  dragended() {
    this.style.opacity = '1';
  }
  dragleaved() {
    this.style.opacity = '1';
  }
  dragEntered(e: any) {
    var _playerId = e.dataTransfer.types.toString().split('||')[1];

    if (this.playerId == _playerId && this.cards.length < 8) {
      // if the card is from myself and the Deck has enough spsace, let's add it. It is internal play
      //  e.preventDefault();
      this.style.opacity = '0.4';
    }
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(Events.Card_Removed, e => this.cardRemoved(e));
    document.addEventListener(Events.Card_Moved_To_Another_Deck, e =>
      this.cardedMoved(e)
    );
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(Events.Card_Removed, this.cardRemoved);
    document.removeEventListener(
      Events.Card_Moved_To_Another_Deck,
      this.cardedMoved
    );
  }
  droped(e: any) {
    var zero = e.dataTransfer.getData('zero||' + this.playerId);
    var one = e.dataTransfer.getData('one||' + this.playerId);

    var receivedValue = zero !== '' ? false : true;

    this.cards.push(receivedValue);
    document.dispatchEvent(
      new CustomEvent(Events.Card_Moved_To_Another_Deck, {
        detail: zero !== '' ? zero : one,
      })
    );
    this.requestUpdate();
    this.style.opacity = '1';
  }
  dragovered(e: any) {
    // do I recieved this drag
    debugger;

    var _playerId = e.dataTransfer.types.toString().split('||')[1];

    if (this.playerId == _playerId && this.cards.length < 8) {
      // if the card is from myself and the Deck has enough spsace, let's add it. It is internal play
      e.preventDefault();
    }
  }
  cardedMoved(e: any) {
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
      // remove the save cards at the ends of array.
      var cardVal = this.cards.pop();

      this.requestUpdate();
    }
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
      // remove the save cards at the ends of array.
      var cardVal = this.cards.pop();
      while (this.cards[this.cards.length - 1] == cardVal) {
        this.cards.pop();
      }
      this.requestUpdate();
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

        div.empty {
          height: 100px;
          width: 60px;
          flex: 100px 1 0;
          border-radius: 5px;

          background-color: var(--background-color);
          box-shadow: 3px 3px 3px gray;
          color: white;
          font-size: 2em;
          border: 3px solid;
          border-color: gray;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
        }
      `,
    ];
  }
}
