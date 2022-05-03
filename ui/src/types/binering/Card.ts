export class ChessBoard {
  public board: number[] = [];
  public board2: number[] = [];
  constructor() {
    var val = false;
    for (var i = 0; i < 64; i++) {
      this.board.push(+val);
      val = !val;
      this.board2.push(+val);
    }
  }

  public print() {
    console.log(this.board.toString().replace(/,/g, ''));
    console.log(this.board2.toString().replace(/,/g, ''));
  }
}

export interface Card {
  player: Player;
  id: string;
}

enum Player {
  A = 1,
  B = 2,
}
