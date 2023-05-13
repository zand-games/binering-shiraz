import { Player } from './Player';
import { Color } from './Trash';
import { parseCardInfo } from '../utils';
import { ComputerPlayer } from './ComputerPlay';
export var PlayeType;
(function (PlayeType) {
    PlayeType[PlayeType["Single"] = 1] = "Single";
    PlayeType[PlayeType["MultiPlayer"] = 2] = "MultiPlayer";
})(PlayeType || (PlayeType = {}));
export class Game {
    constructor() {
        this.players = {};
        this.playType = PlayeType.Single;
        this.rounds = [];
        this.game_finished = false;
        this.round_finished = false;
        this.location = 'Shiraz, Iran';
        this.coordination = 'Shiraz, Iran';
        this.locationUrl = '';
        this.locations = [];
        this.startNewGame();
    }
    get goole_map_current_location() {
        return ('http://maps.google.com/maps?z=20&q=' +
            this.latitute +
            ',' +
            this.longtitude);
    }
    get latitute() {
        if (this.players[1].isLatitute) {
            return this.players[1].get_location();
        }
        else {
            return this.players[2].get_location();
        }
        return '0';
    }
    get longtitude() {
        if (this.players[1].isLatitute) {
            return this.players[2].get_location();
        }
        else {
            return this.players[1].get_location();
        }
    }
    ResumeGame(game_hash) {
        // fetch game from DHT
    }
    async startNewGame() {
        this.looser = '';
        this.rounds = [];
        this.game_finished = false;
        this.round_finished = false;
        if (this.playType == PlayeType.Single) {
            this.player1 = new Player(1, 'Player 1', false);
            this.player2 = new Player(2, 'Computer', true);
        }
        else {
            this.player1 = new Player(1, 'Player 1', false);
            this.player2 = new Player(2, 'Player 2', false);
        }
        this.player1.turn = true;
        this.player1.onRemoveCard = async (data) => {
            await this.onRemoveCardEventHandler(data, this);
        };
        this.player2.onRemoveCard = async (data) => {
            await this.onRemoveCardEventHandler(data, this);
        };
        this.players = { 1: this.player1, 2: this.player2 };
        this.coordination = this.latitute + ',' + this.longtitude;
        this.locations = [];
        this.locations.push({
            latitude: this.latitute,
            longitude: this.longtitude,
        });
    }
    async startNewRound() {
        this.looser = '';
        this.game_finished = false;
        this.round_finished = false;
        this.player1.new_round();
        this.player2.new_round();
        if (this.rounds.length % 2 == 0)
            this.changeTurn(2);
        else
            this.changeTurn(1);
        this.locations = [];
        this.locations.push({
            latitude: this.latitute,
            longitude: this.longtitude,
        });
    }
    async onRemoveCardEventHandler(data, game) {
        var _a, _b;
        var oponent = game.getOponent(data.player.id);
        await this.changeTurn(data.player.id);
        if (((_a = data.player.trash) === null || _a === void 0 ? void 0 : _a.selectedCard) == Color.NotSelected)
            data.player.trash.setColor(data.playedCard);
        if (((_b = oponent.trash) === null || _b === void 0 ? void 0 : _b.selectedCard) == Color.NotSelected) {
            oponent.trash.setColor(!data.playedCard);
        }
        // find_location(this);
        this.locations.push({
            latitude: this.latitute,
            longitude: this.longtitude,
        });
    }
    calc_score(winner, looser) {
        var count = 0;
        winner.decks.forEach(dec => (count += dec.cards.length));
        looser.decks.forEach(dec => (count += dec.cards.length));
        return -count;
    }
    check_game_looer(round_looserid) {
        const count = this.getScore(round_looserid);
        if (Math.abs(count) >= 21) {
            this.looser = this.players[round_looserid].name + ' lost the game! ';
            this.game_finished = true;
        }
    }
    check_round_looser() {
        if (this.player1.remainedCard() == 0) {
            const score = this.calc_score(this.player1, this.player2);
            this.looser = this.player2.name + ' lost the round!  Score:' + score;
            this.rounds.push({
                round_looserid: this.player2.id,
                score: score,
            });
            this.round_finished = true;
            this.check_game_looer(this.player2.id);
        }
        if (this.player2.remainedCard() == 0) {
            const score = this.calc_score(this.player2, this.player1);
            this.looser = this.player1.name + ' lost the round! Score:' + score;
            this.round_finished = true;
            this.rounds.push({
                round_looserid: this.player1.id,
                score: score,
            });
            this.check_game_looer(this.player1.id);
        }
    }
    getScore(playerId) {
        var count = 0;
        this.rounds
            .filter(i => i.round_looserid == playerId)
            .map(j => (count += j.score));
        return count;
    }
    async changeTurn(playerId) {
        if (!playerId) {
            // color is already selected
            if (this.players[1].turn) {
                this.players[1].turn = false;
                this.players[2].turn = true;
            }
            else {
                this.players[1].turn = true;
                this.players[2].turn = false;
            }
        }
        else {
            this.players[playerId].turn = false;
            this.getOponent(playerId).turn = true;
        }
        this.check_round_looser();
        if (this.round_finished == false) {
            if (this.player2.isComputer && this.player2.turn) {
                ComputerPlayer.Move(this.player1, this.player2, this);
            }
        }
    }
    getOponent(playerId) {
        if (playerId == 1)
            return this.players[2];
        else if (playerId == 2)
            return this.players[1];
        else
            throw new Error('PlayerId is invalid!');
    }
    async transfer_card(input, target_player, target_deck) {
        var _a, _b, _c, _d, _e;
        debugger;
        const source_card = parseCardInfo(input);
        console.log(source_card);
        if (source_card.dataIsValid == false)
            return;
        // it is not your turn to play
        if (this.players[source_card.playerId].turn == false)
            return;
        if (source_card.playerId == target_player) {
            //internal move
            (_a = this.players[target_player]
                .getDeck(target_deck)) === null || _a === void 0 ? void 0 : _a.cards.push(source_card.value);
            (_b = this.players[target_player].getDeck(source_card.deckId)) === null || _b === void 0 ? void 0 : _b.cards.pop();
        }
        else {
            // moved from oponent
            await this.transfer_all_possible_card_from_attacker_deck_to_target_deck((_c = this.players[target_player].trash) === null || _c === void 0 ? void 0 : _c.value, (_d = this.players[source_card.playerId].getDeck(source_card.deckId)) === null || _d === void 0 ? void 0 : _d.cards, (_e = this.players[target_player].getDeck(target_deck)) === null || _e === void 0 ? void 0 : _e.cards);
            // this.players[target_player]
            //   .getDeck(target_deck)
            //   ?.cards.unshift(source_card.value!);
            // this.players[source_card.playerId!]
            //   .getDeck(source_card.deckId!)
            //   ?.cards.pop();
        }
        this.locations.push({
            latitude: this.latitute,
            longitude: this.longtitude,
        });
        await this.changeTurn();
    }
    async transfer_all_possible_card_from_attacker_deck_to_target_deck(selected_card, source_deck, target_deck) {
        // move all the similar cards form button of source deck to the top of the target deck.
        debugger;
        while (target_deck.length < 8 &&
            source_deck[source_deck.length - 1] == selected_card) {
            target_deck.unshift(selected_card);
            source_deck.pop();
        }
    }
}
//# sourceMappingURL=Game.js.map