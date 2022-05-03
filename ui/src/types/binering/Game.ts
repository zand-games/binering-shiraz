import { MoveEventInfo, Player } from './Player';
import { Color } from './Trash';

export class Game {
  public players: Record<number, Player>;
  constructor() {
    debugger;
    var p1 = new Player(1);
    var p2 = new Player(2);
    p1.onMove = data => {
      this.onMoveEventHandler(data, this);
    };
    p2.onMove = data => {
      this.onMoveEventHandler(data, this);
    };
    this.players = { 1: p1, 2: p2 };
  }
  public ResumeGame(game_hash: String) {
    // fetch game from DHT
  }

  private onMoveEventHandler(data: MoveEventInfo, game: Game) {
    data.player.turn = false;
    var oponent = game.getOponent(data.player.id);
    oponent.turn = true;

    if (data.player.trash?.selectedCard == Color.NotSelected)
      data.player.trash.setColor(data.playedCard);

    if (oponent.trash?.selectedCard == Color.NotSelected) {
      oponent.trash.setColor(!data.playedCard);
    }
  }

  private getOponent(playerId: number) {
    debugger;
    if (playerId == 1) return this.players[2];
    else if (playerId == 2) return this.players[1];
    else throw new Error('PlayerId is invalid!');
  }
}
