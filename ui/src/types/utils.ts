export interface CardInfo {
  playerId?: number;
  deckId?: string;
  value?: boolean;
  dataIsValid: boolean;
}
export function parseCardInfo(input: string): CardInfo {
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
