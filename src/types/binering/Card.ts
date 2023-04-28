export function GenerateCardData(
  playerId: number,
  deckId: string,
  cardType: boolean
): string {
  const charValue = cardType ? 'one' : 'zero';
  return playerId + '||' + charValue + '||' + deckId.toLocaleLowerCase();
}
