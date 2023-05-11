// Format of incoming valid data from card on Drag&Drop
// PlayerId||CardType||DeckId
// example:
// 1||one||A
// 2||zero||C
export var Color;
(function (Color) {
    Color[Color["Zero"] = 0] = "Zero";
    Color[Color["True"] = 1] = "True";
    Color[Color["NotSelected"] = 2] = "NotSelected";
})(Color || (Color = {}));
export class Trash {
    constructor(playerId) {
        this.selectedCard = Color.NotSelected;
        this.playerId = playerId;
    }
    get value() {
        return this.selectedCard == Color.True ? true : false;
    }
    setColor(value) {
        this.selectedCard = value ? Color.True : Color.Zero;
    }
}
//# sourceMappingURL=Trash.js.map