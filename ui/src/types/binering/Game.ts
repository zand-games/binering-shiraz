import { MoveEventInfo, Player } from './Player';
import { Color } from './Trash';
import { parseCardInfo } from '../utils';
import { HtmlTagHydration } from 'svelte/internal';
import { ComputerPlayer } from './ComputerPlay';
export enum PlayeType {
  Single = 1,
  MultiPlayer = 2,
}
export class Game {
  public players: Record<number, Player> = {};
  private player1!: Player;
  private player2!: Player;
  public Winner?: string;
  public playType: PlayeType = PlayeType.Single;
  //private complay!: ComputerPlayer;
  constructor() {
    this.startNewGame();
    //this.game_finished = true;
  }
  public ResumeGame(game_hash: String) {
    // fetch game from DHT
  }
  public async startNewGame() {
    this.game_finished = false;
    this.Winner = '';
    if (this.playType == PlayeType.Single) {
      this.player1 = new Player(1, 'Player 1', false);
      this.player2 = new Player(2, 'Computer', true);
    } else {
      this.player1 = new Player(1, 'Player 1', false);
      this.player2 = new Player(2, 'Player 2', false);
    }

    this.player1.onRemoveCard = async data => {
      await this.onRemoveCardEventHandler(data, this);
    };
    this.player2.onRemoveCard = async data => {
      await this.onRemoveCardEventHandler(data, this);
    };
    this.players = { 1: this.player1, 2: this.player2 };
  }
  public game_finished!: boolean;
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
  }
  private calc_score(winner: Player, looser: Player) {
    var count = 0;
    // All card of looser in the game * 3
    winner.decks.forEach(dec => (count += dec.cards.length * 2));

    // in the opponent board
    // looser.decks.forEach(dec =>
    //   dec.cards.forEach(card =>
    //     card == !winner.trash?.value ? (count += 3) : (count += 0)
    //   )
    // );
    return count;
  }
  private check_winner() {
    if (this.player1.remainedCard() == 0) {
      // alert('Player ' + 1 + 'Won the round!');
      this.Winner =
        this.player1.name +
        ' Won the round!  Score:' +
        this.calc_score(this.player1, this.player2);
      this.game_finished = true;
    }
    if (this.player2.remainedCard() == 0) {
      this.Winner =
        this.player2.name +
        ' Won the round! Score:' +
        this.calc_score(this.player2, this.player1);
      // alert('Player ' + 2 + 'Won the round!');
      this.game_finished = true;
    }
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
    this.check_winner();
    // if (this.playType == PlayeType.Single) {
    //   if (this.game_finished == false) {
    //     if (this.player2.turn == true) this.complay.Move(this.player1);
    //   }
    // }
    //debugger;
    if (this.game_finished == false) {
      // if (this.player1.isComputer && this.player1.turn) {
      //   await ComputerPlayer.Move(this.player2, this.player1, this);
      // }
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

  /// pop  :take the last item from array, we need it for Trash dragDrop.
  // push  : add item to last postion. so we need it to internal movement.
  //unshift : add item to first position. when oponent inject card to the deck
  public async transfer_card(
    input: string,
    target_player: number,
    target_deck: string
  ) {
    const source_card = parseCardInfo(input);
    if (source_card.dataIsValid == false) return;

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

    await this.changeTurn();
  }
}
