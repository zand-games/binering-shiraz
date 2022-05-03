import { parseCardInfo } from '../utils';
import { Player } from './Player';
import { Color } from './Trash';
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
  public howManyRemained(val: boolean) {
    var item = 0;
    this.cards.map(i => (i == val ? item++ : ''));
    return item;
  }
  public removeSimilarCardsFromLastPosition() {
    var cardVal = this.cards.pop();
    while (this.cards[this.cards.length - 1] == cardVal) {
      this.cards.pop();
    }
  }

  public acceptNewCard(input: string, canOponentSendCard: boolean): boolean {
    const cardInfo = parseCardInfo(input);
    // I am full
    if (this.cards.length == 8) return false;

    // I do not accept card from myself
    if (cardInfo.playerId == this.playerId && cardInfo.deckId == this.id)
      return false;

    // I can accept card from my side and other decks
    if (cardInfo.playerId == this.playerId && cardInfo.deckId != this.id)
      return true;

    // I accept card from oponent
    if (canOponentSendCard) return true;

    return false;
  }
}
