import { debug } from 'svelte/internal';
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
  //32 cards
  private _allcards = [
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
  ];
  private _deckTemplate = [true, false, true, false, true, false, true, false];
  public counter: number = 0;
  constructor(id: number, name: string, isComputer: boolean) {
    this.id = id;
    this.name = name;
    const decks = this.generate_random_Decks();

    this.decks = decks;
    this.trash = new Trash(this.id);
    this._isComputer = isComputer;
    this.convertBytesToLocaion();
  }
  public new_round() {
    const decks = this.generate_random_Decks();
    this.decks = decks;
    this.trash = new Trash(this.id);
  }

  generate_random_Decks() {
    // var deck1 = new Deck(this.id, 'a', this.shuffle([...this._deckTemplate]));
    // var deck2 = new Deck(this.id, 'b', this.shuffle([...this._deckTemplate]));
    // var deck3 = new Deck(this.id, 'c', this.shuffle([...this._deckTemplate]));
    // var deck4 = new Deck(this.id, 'd', this.shuffle([...this._deckTemplate]));

    var _shfl = this.shuffle([...this._allcards]);

    var decks = this.chunk(_shfl, 8);
    var deck1 = new Deck(this.id, 'a', decks[0]);
    var deck2 = new Deck(this.id, 'b', decks[1]);
    var deck3 = new Deck(this.id, 'c', decks[2]);
    var deck4 = new Deck(this.id, 'd', decks[3]);

    return [deck1, deck2, deck3, deck4];
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

  public get_location() {
    return this.convertBytesToLocaion();
  }

  getColor() {
    var color: any = [];

    color.push(this.decks[0].getDecimal());
    color.push(this.decks[1].getDecimal());
    color.push(this.decks[3].getDecimal());
    color.push(this.decks[3].getPercentage());

    return `rgba(${color.join()})`;
  }

  private convertBytesToLocaion() {
    // var hex =
    //   this.decks[0].getHex() +
    //   this.decks[1].getHex() +
    //   this.decks[2].getHex() +
    //   this.decks[3].getHex();

    var r2 =
      this.decks[0].getDecimal() +
      this.decks[1].getDecimal() +
      this.decks[2].getDecimal() +
      this.decks[3].getDecimal();

    // var baseVal = Number(nums); //parseInt(hex, 16);
    // var r1 = baseVal / 30000;
    // var r2 = r1 / 60;

    if (this.isLatitute) {
      if (r2 > 90) {
        // it is latitute. should not be more that 90.
        r2 = (((r2 % 180) + 180 + 90) % 180) - 90;
      }
      //console.log('Latitute');
    } else {
      // It is longtitute. Should not be more than 180
      if (r2 > 180) {
        r2 = (((r2 % 360) + 360 + 180) % 360) - 180;
      }
      //console.log('Longtitute');
    }
    //console.log('*****************');
    return r2.toString(); //Math.round(r2).toString();
  }

  public get isLatitute(): boolean {
    // if the game is at the begginin, make the left side latitute
    if (this.trash?.selectedCard == Color.NotSelected) {
      if (this.id == 1) return true;
      else return false;
    }

    // for Zero or Red card is latitude
    if (this.trash!.value == false) return true;
    else return false; // One or Blue card is longtitute
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

    // it is not my turn to move
    if (this.turn == false) return;

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

  chunk(array: boolean[], size: number) {
    var results = [];
    while (array.length) {
      results.push(array.splice(0, size));
    }
    return results;
  }
}
