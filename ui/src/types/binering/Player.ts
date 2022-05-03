import { parseCardInfo } from '../utils';
import { Deck } from './Deck';
import { Color, Trash } from './Trash';

export interface MoveEventInfo {
  playedCard: boolean;
  player: Player;
}
export class Player {
  public onRemoveCard?: (data: MoveEventInfo) => void;

  readonly id: number;
  decks: Array<Deck>;
  private _turn?: boolean;
  public get turn() {
    return this._turn!;
  }
  public set turn(val: boolean) {
    this._turn = val;
  }
  trash?: Trash;

  private _deckTemplate = [true, true, true, true, false, false, false, false];
  public counter: number = 0;

  constructor(id: number) {
    this.id = id;
    var deck1 = new Deck(this.id, 'a', this.shuffle([...this._deckTemplate]));
    var deck2 = new Deck(this.id, 'b', this.shuffle([...this._deckTemplate]));
    var deck3 = new Deck(this.id, 'c', this.shuffle([...this._deckTemplate]));
    var deck4 = new Deck(this.id, 'd', this.shuffle([...this._deckTemplate]));
    this.decks = [deck1, deck2, deck3, deck4];
    this.trash = new Trash(this.id);
  }
  public getDeck(key: string) {
    return this.decks.find(i => i.id == key);
  }

  public can_Card_Transfer_To_Oponent(): boolean {
    if (this.trash!.selectedCard == Color.NotSelected) return false;
    return this.decks.every(
      dec => dec.cards[dec.cards.length - 1] != this.trash?.value
    );
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

  public remove_card(data: string) {
    var result = parseCardInfo(data);
    if (result?.dataIsValid == false) return;

    var dec = this.decks.find(i => i.id == result?.deckId);
    dec?.removeSimilarCardsFromLastPosition();

    if (this.onRemoveCard) {
      this.onRemoveCard({ player: this, playedCard: result?.value! });
    }
  }
}
