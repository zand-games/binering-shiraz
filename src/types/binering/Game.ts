import { MoveEventInfo, Player } from './Player';
import { Color } from './Trash';
import { parseCardInfo } from '../utils';
import { HtmlTagHydration } from 'svelte/internal';
import { ComputerPlayer } from './ComputerPlay';
export enum PlayeType {
  Single = 1,
  MultiPlayer = 2,
}
interface Round {
  round_looserid: number;
  score: number;
}
export interface Coordination {
  latitude: string;
  longitude: string;
}
export class Game {
  public players: Record<number, Player> = {};
  private player1!: Player;
  private player2!: Player;
  public looser?: string;
  public playType: PlayeType = PlayeType.Single;
  public rounds: Array<Round> = [];
  public game_finished: boolean = false;
  public round_finished: boolean = false;
  public location: string = 'Shiraz, Iran';
  public coordination: string = 'Shiraz, Iran';
  public locationUrl: string = '';
  public locations: Array<Coordination> = [];
  constructor() {
    this.startNewGame();
  }

  public get goole_map_current_location() {
    return (
      'http://maps.google.com/maps?z=20&q=' +
      this.latitute +
      ',' +
      this.longtitude
    );
  }
  public get latitute() {
    if (this.players[1].isLatitute) {
      return this.players[1].get_location();
    } else {
      return this.players[2].get_location();
    }
    return '0';
  }

  public get longtitude() {
    if (this.players[1].isLatitute) {
      return this.players[2].get_location();
    } else {
      return this.players[1].get_location();
    }
  }

  public ResumeGame(game_hash: String) {
    // fetch game from DHT
  }
  public async startNewGame() {
    this.looser = '';
    this.rounds = [];
    this.game_finished = false;
    this.round_finished = false;

    if (this.playType == PlayeType.Single) {
      this.player1 = new Player(1, 'Player 1', false);
      this.player2 = new Player(2, 'Computer', true);
    } else {
      this.player1 = new Player(1, 'Player 1', false);
      this.player2 = new Player(2, 'Player 2', false);
    }

    this.player1.turn = true;

    this.player1.onRemoveCard = async data => {
      await this.onRemoveCardEventHandler(data, this);
    };
    this.player2.onRemoveCard = async data => {
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

  public async startNewRound() {
    this.looser = '';
    this.game_finished = false;
    this.round_finished = false;

    this.player1.new_round();
    this.player2.new_round();

    if (this.rounds.length % 2 == 0) this.changeTurn(2);
    else this.changeTurn(1);

    this.locations = [];
    this.locations.push({
      latitude: this.latitute,
      longitude: this.longtitude,
    });
  }
  private async onRemoveCardEventHandler(
    data: MoveEventInfo,
    game: Game
  ): Promise<void> {
    var oponent = game.getOponent(data.player.id);
    await this.changeTurn(data.player.id);
    if (data.player.trash?.selectedCard == Color.NotSelected)
      data.player.trash.setColor(data.playedCard);

    if (oponent.trash?.selectedCard == Color.NotSelected) {
      oponent.trash.setColor(!data.playedCard);
    }
    // find_location(this);
    this.locations.push({
      latitude: this.latitute,
      longitude: this.longtitude,
    });
  }
  private calc_score(winner: Player, looser: Player) {
    var count = 0;
    winner.decks.forEach(dec => (count += dec.cards.length));
    looser.decks.forEach(dec => (count += dec.cards.length));
    return -count;
  }

  private check_game_looer(round_looserid: number) {
    const count = this.getScore(round_looserid);

    if (Math.abs(count) >= 21) {
      this.looser = this.players[round_looserid].name + ' lost the game! ';

      this.game_finished = true;
    }
  }
  private check_round_looser() {
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
  public getScore(playerId: number) {
    var count = 0;
    this.rounds
      .filter(i => i.round_looserid == playerId)
      .map(j => (count += j.score));
    return count;
  }
  public async changeTurn(playerId?: number) {
    if (!playerId) {
      // color is already selected
      if (this.players[1].turn) {
        this.players[1].turn = false;
        this.players[2].turn = true;
      } else {
        this.players[1].turn = true;
        this.players[2].turn = false;
      }
    } else {
      this.players[playerId!].turn = false;
      this.getOponent(playerId).turn = true;
    }
    this.check_round_looser();

    if (this.round_finished == false) {
      if (this.player2.isComputer && this.player2.turn) {
        ComputerPlayer.Move(this.player1, this.player2, this);
      }
    }
  }
  public getOponent(playerId: number) {
    if (playerId == 1) return this.players[2];
    else if (playerId == 2) return this.players[1];
    else throw new Error('PlayerId is invalid!');
  }

  public async transfer_card(
    input: string,
    target_player: number,
    target_deck: string
  ) {
    const source_card = parseCardInfo(input);
    if (source_card.dataIsValid == false) return;

    // it is not your turn to play
    if (this.players[source_card.playerId!].turn == false) return;
    if (source_card.playerId == target_player) {
      //internal move
      this.players[target_player]
        .getDeck(target_deck)
        ?.cards.push(source_card.value!);
      this.players[target_player].getDeck(source_card.deckId!)?.cards.pop();
    } else {
      // moved from oponent
      this.players[target_player]
        .getDeck(target_deck)
        ?.cards.unshift(source_card.value!);
      this.players[source_card.playerId!]
        .getDeck(source_card.deckId!)
        ?.cards.pop();
    }

    this.locations.push({
      latitude: this.latitute,
      longitude: this.longtitude,
    });
    await this.changeTurn();
  }
}
