import { parseCardInfo, messageBox } from '../utils';
import { Deck } from './Deck';
import { Color, Trash } from './Trash';

export interface MoveEventInfo {
  playedCard: boolean;
  player: Player;
}
export class Player {
  public onRemoveCard?: (data: MoveEventInfo) => Promise<void>;
  public name: string = '';
  readonly id: number;
  private _isComputer: boolean = false;
  public score: number = 0;
  public get isComputer() {
    return this._isComputer;
  }
  decks: Array<Deck>;
  private _turn?: boolean;
  public get turn() {
    return this._turn!;
  }
  public set turn(val: boolean) {
    this._turn = val;
  }
  trash?: Trash;

  //private _deckTemplate = [true, false];
  private _deckTemplate = [true, false, true, false, true, false, true, false];
  public counter: number = 0;
  constructor(id: number, name: string, isComputer: boolean) {
    this.id = id;
    this.name = name;
    var deck1 = new Deck(this.id, 'a', this.shuffle([...this._deckTemplate]));
    var deck2 = new Deck(this.id, 'b', this.shuffle([...this._deckTemplate]));
    var deck3 = new Deck(this.id, 'c', this.shuffle([...this._deckTemplate]));
    var deck4 = new Deck(this.id, 'd', this.shuffle([...this._deckTemplate]));
    this.decks = [deck1, deck2, deck3, deck4];
    this.trash = new Trash(this.id);
    this._isComputer = isComputer;
  }
  public new_round() {
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
    // Deck Can not Be empty
    if (this.isThereEmptyDeck()) {
      return false;
    }
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

  public remainedCard() {
    var count = 0;
    this.decks.forEach(
      dec => (count += dec.howManyRemained(this.trash?.value!))
    );
    return count;
  }

  private isThereEmptyDeck(): boolean {
    return this.decks.some(dec => dec.cards.length == 0);
  }
  public async remove_card(data: string) {
    if (!this.can_card_removable(data)) return; // double check if the card can be removable
    var result = parseCardInfo(data);
    if (result?.dataIsValid == false) return;

    var dec = this.decks.find(i => i.id == result?.deckId);
    dec?.removeSimilarCardsFromLastPosition();

    if (this.onRemoveCard) {
      await this.onRemoveCard({ player: this, playedCard: result?.value! });
    }
  }

  public can_card_removable(input: string): boolean {
    const result = parseCardInfo(input);

    if (result.dataIsValid == false) return false;

    // candidate card should be from the same player
    if (this.id != result.playerId) return false;

    // Deck Can not Be empty
    if (this.isThereEmptyDeck() && this.remainedCard() > 3) return false;

    if (this.trash!.selectedCard == Color.NotSelected) {
      // this color type is not selected so far
      return true;
    } else if (
      // the input card should be the same as before
      (this.trash!.selectedCard == Color.True && result.value == true) ||
      (this.trash!.selectedCard == Color.Zero && result.value == false)
    ) {
      return true;
    }
    return false;
  }
}
