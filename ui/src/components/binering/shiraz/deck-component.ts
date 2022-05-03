import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './card-component';
import cssg from '../globalcss';
import '../events';
import { Events } from '../events';
import { Deck } from '../../../types/binering/Deck';
import { GameStore } from '../store';
import { StoreSubscriber } from 'lit-svelte-stores';

@customElement('deck-component')
export class DeckComponent extends LitElement {
  @state()
  playerId?: number;

  @state()
  deckId!: string;

  game = new StoreSubscriber(this, () => GameStore);
  get deck() {
    return this.game.value.players[this.playerId!].getDeck(this.deckId!);
  }
  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html` <div
      class="deck"
      @drop=${this.droped}
      @dragover=${this.dragovered}
      @dragenter=${this.dragEntered}
      @dragend=${this.dragended}
      @dragleave=${this.dragleaved}
    >
      ${this.deck!.cards.length > 0
        ? this.deck!.cards.map(
            (card, i, arr) =>
              html`<card-component
                .playerId=${this.playerId}
                .value=${card}
                .deckId=${this.deckId}
                .draggable=${this.isdraggable(i, arr)}
              >
              </card-component>`
          )
        : html`<div class="empty">${this.deckId.toUpperCase()}</div>`}
    </div>`;
  }

  isdraggable(index: number, arr: boolean[]) {
    const iscardIsLastIndex = arr.length - 1 === index ? true : false;

    if (iscardIsLastIndex == false) return false;
    // Game is not strated
    if (
      this.game.value.players[this.playerId!].turn == null ||
      this.game.value.players[this.playerId!].turn == undefined
    )
      return true;

    if (this.game.value.players[this.playerId!].turn == true) return true;
    return false;
  }

  dragended() {
    this.style.opacity = '1';
  }
  dragleaved() {
    this.style.opacity = '1';
  }
  dragEntered(e: any) {}

  disconnectedCallback() {
    super.disconnectedCallback();
  }
  droped(e: any) {
    // var zero = e.dataTransfer.getData('zero||' + this.playerId);
    // var one = e.dataTransfer.getData('one||' + this.playerId);
    // var receivedValue = zero !== '' ? false : true;
    // this.cards.push(receivedValue);
    // document.dispatchEvent(
    //   new CustomEvent(Events.Card_Moved_To_Another_Deck, {
    //     detail: zero !== '' ? zero : one,
    //   })
    // );
    // this.requestUpdate();
    this.game.value.transfer_card(
      e.dataTransfer.types,
      this.playerId!,
      this.deckId
    );
    GameStore.update(val => {
      val = this.game.value;
      return val;
    });
    this.style.opacity = '1';
  }
  dragovered(e: any) {
    this.style.opacity = '.5';
    if (
      this.deck?.acceptNewCard(
        e.dataTransfer.types,
        this.game.value
          .getOponent(this.playerId!)
          .can_Card_Transfer_To_Oponent()
      )
    ) {
      e.preventDefault();
      //console.log('accepted');
    }
    // do I recieved this drag
    // debugger;
    // var _playerId = e.dataTransfer.types.toString().split('||')[1];
    // if (this.playerId == _playerId && this.cards.length < 8) {
    //   // if the card is from myself and the Deck has enough spsace, let's add it. It is internal play
    //   e.preventDefault();
    // }
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

    // if (playerId == this.playerId && this.deckId == deckId) {
    //   // remove the save cards at the ends of array.
    //   var cardVal = this.cards.pop();

    //   this.requestUpdate();
    // }
  }
  cardRemoved(e: any) {
    // const dataArray = e.detail.split('||');
    // let playerId = dataArray[0];
    // let deckId = dataArray[1];
    // if (
    //   playerId == null ||
    //   deckId == null ||
    //   playerId == undefined ||
    //   deckId == undefined
    // )
    //   return;
    // if (playerId == this.playerId && this.deckId == deckId) {
    //   // remove the save cards at the ends of array.
    //   var cardVal = this.cards.pop();
    //   while (this.cards[this.cards.length - 1] == cardVal) {
    //     this.cards.pop();
    //   }
    //   this.requestUpdate();
    // }
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
