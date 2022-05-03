import { Player } from './Player';

export class Game {
  public players: Record<number, Player>;
  constructor() {
    const p1 = new Player(1);
    const p2 = new Player(2);
    this.players = { 1: new Player(1), 2: new Player(2) };
  }
  public ResumeGame(game_hash: String) {
    // fetch game from DHT
  }
  //   public StartNewGame() {
  //     var item = this.players[2];
  //   }

  //   public Player(id: number): Player {
  //     var item = this.players[1];
  //     //return this.players.get(id);
  //   }
}
