export function GenerateCardData(playerId, deckId, cardType) {
    const charValue = cardType ? 'one' : 'zero';
    return playerId + '||' + charValue + '||' + deckId.toLocaleLowerCase();
}
//# sourceMappingURL=Card.js.map