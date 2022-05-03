// Format of incoming valid data from card on Drag&Drop
// PlayerId||CardType||DeckId
// example:
// 1||one||A
// 2||zero||C

export enum Color {
  Zero = 0,
  True = 1,
  NotSelected = 2,
}
import { parseCardInfo } from '../utils';
export class Trash {
  readonly playerId?: number;
  selectedCard: Color = Color.NotSelected;

  constructor(playerId: number) {
    this.playerId = playerId;
  }
  public get value() {
    return this.selectedCard == Color.True ? true : false;
  }
  public isValidCard(input: string): boolean {
    const result = parseCardInfo(input);

    if (result.dataIsValid == false) return false;

    // input card should be from the same player
    if (this.playerId != result.playerId) return false;

    if (this.selectedCard == Color.NotSelected) {
      // this color type is not selected so far
      return true;
    } else if (
      // the input card should be the same as before
      (this.selectedCard == Color.True && result.value == true) ||
      (this.selectedCard == Color.Zero && result.value == false)
    ) {
      return true;
    }
    return false;
  }

  public setColor(value: boolean) {
    this.selectedCard = value ? Color.True : Color.Zero;
  }
}
