import { Deck } from './Deck';
import { Trash } from './Trash';

export class Player {
  readonly id: number;
  decks: Array<Deck>;
  turn?: boolean;
  trash?: Trash;
  private cards = [true, true, true, true, false, false, false, false];
  public counter: number = 0;

  constructor(id: number) {
    this.id = id;
    var deck1 = new Deck(this.id, 'a', this.shuffle([...this.cards]));
    var deck2 = new Deck(this.id, 'b', this.shuffle([...this.cards]));
    var deck3 = new Deck(this.id, 'c', this.shuffle([...this.cards]));
    var deck4 = new Deck(this.id, 'd', this.shuffle([...this.cards]));
    this.decks = [deck1, deck2, deck3, deck4];
    this.trash = new Trash(this.id);
  }
  public getDeck(key: string) {
    return this.decks.find(i => i.id == key);
  }
  shuffle(array: boolean[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  private changeTurn() {
    this.turn = this.turn == null ? false : !this.turn;
  }

  public remove_card(data: string) {
    var result = this.trash?.ValidateCard(data);
    if (result?.dataIsValid == false) return;

    var dec = this.decks.find(i => i.id == result?.deckId);
    dec?.removeSimilarCardsFromLastPosition();
  }
}
