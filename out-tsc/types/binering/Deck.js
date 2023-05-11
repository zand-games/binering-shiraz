import { parseCardInfo } from '../utils';
export class Deck {
    constructor(playerId, deckId, cards) {
        this.playerId = playerId;
        this.id = deckId;
        this.cards = cards;
    }
    getDecimal() {
        // var a = [false, true, false, true];
        // var b: any = a.reduce((res, x) => (res << 1) | x);
        // var result: any = this.cards.reduce((res, x) => (res << 1) | x);
        return Deck.boolArrToNumber(this.cards);
    }
    getHex() {
        return this.getDecimal().toString(16);
    }
    getPercentage() {
        const result = ((this.getDecimal() * 100) / 255).toString() + '%';
        //  console.log(result);
        return result;
    }
    /// pop  :take the last item from array, we need it for Trash dragDrop.
    // push  : add item to last postion. so we need it to internal movement.
    //unshift : add item to first position. when oponent inject card to the deck
    howManyRemained(val) {
        var item = 0;
        this.cards.map(i => (i == val ? item++ : ''));
        return item;
    }
    removeSimilarCardsFromLastPosition() {
        var cardVal = this.cards.pop();
        while (this.cards[this.cards.length - 1] == cardVal) {
            this.cards.pop();
        }
    }
    acceptNewCard(input, canOponentSendCard) {
        const cardInfo = parseCardInfo(input);
        // I am full
        if (this.cards.length == 8)
            return false;
        // I do not accept card from myself
        if (cardInfo.playerId == this.playerId && cardInfo.deckId == this.id)
            return false;
        // I can accept card from my side and other decks
        if (cardInfo.playerId == this.playerId && cardInfo.deckId != this.id)
            return true;
        // I accept card from oponent
        if (canOponentSendCard)
            return true;
        return false;
    }
}
Deck.boolArrToNumber = (arr) => {
    if (arr == null || arr == undefined || arr.length == 0)
        return 0;
    return parseInt(arr.map(r => (r ? '1' : '0')).join(''), 2);
};
//# sourceMappingURL=Deck.js.map