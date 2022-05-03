// Format of incoming valid data from card on Drag&Drop
// PlayerId||CardType||DeckId
// example:
// 1||one||A
// 2||zero||C
export interface CardInfo {
  playerId?: number;
  deckId?: string;
  value?: boolean;
  dataIsValid: boolean;
}
export enum Color {
  Zero = 0,
  True = 1,
  NotSelected = 2,
}

export class Trash {
  readonly playerId?: number;
  selectedCard: Color = Color.NotSelected;

  constructor(playerId: number) {
    this.playerId = playerId;
  }

  public isValidCard(input: string): boolean {
    const result = this.ValidateCard(input);

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

  public ValidateCard(input: string): CardInfo {
    const data: string[] = input.toString().split('||');
    var result: CardInfo = {
      dataIsValid: false,
    };
    if (data.length < 3) {
      const result: CardInfo = {
        dataIsValid: false,
      };
    } else {
      result.playerId = Number(data[0]);
      result.value = data[1].toLowerCase() == 'one' ? true : false;
      result.deckId = data[2];
      result.dataIsValid = true;
    }
    return result;
  }
}
