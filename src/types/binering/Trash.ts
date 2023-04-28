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

  public setColor(value: boolean) {
    this.selectedCard = value ? Color.True : Color.Zero;
  }
}
