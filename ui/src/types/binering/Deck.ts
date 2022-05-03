export class Deck {
  readonly playerId: number;
  readonly id: string;
  cards: boolean[];
  constructor(playerId: number, deckId: string, cards: boolean[]) {
    this.playerId = playerId;
    this.id = deckId;
    this.cards = cards;
  }

  /// pop  :take the last item from array, we need it for Trash dragDrop.
  // push  : add item to last postion. so we need it to internal movement.
  //unshift : add item to first position. when oponent inject card to the deck

  public removeSimilarCardsFromLastPosition() {
    //debugger;
    //alert('delete forom' + this.playerId + '  ' + this.id);
    var cardVal = this.cards.pop();

    while (this.cards[this.cards.length - 1] == cardVal) {
      this.cards.pop();
    }
  }

  public removeLastCard() {}

  public addNewItemToFirstPosition() {}
}
