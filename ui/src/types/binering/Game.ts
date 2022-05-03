import { MoveEventInfo, Player } from './Player';
import { Color } from './Trash';
import { parseCardInfo } from '../utils';

export class Game {
  public players: Record<number, Player>;
  constructor() {
    var p1 = new Player(1);
    var p2 = new Player(2);
    p1.onRemoveCard = data => {
      this.onRemoveCardEventHandler(data, this);
    };
    p2.onRemoveCard = data => {
      this.onRemoveCardEventHandler(data, this);
    };
    this.players = { 1: p1, 2: p2 };
  }
  public ResumeGame(game_hash: String) {
    // fetch game from DHT
  }

  private onRemoveCardEventHandler(data: MoveEventInfo, game: Game) {
    debugger;
    // data.player.turn = false;
    var oponent = game.getOponent(data.player.id);
    // oponent.turn = true;
    this.changeTurn(data.player.id);
    if (data.player.trash?.selectedCard == Color.NotSelected)
      data.player.trash.setColor(data.playedCard);

    if (oponent.trash?.selectedCard == Color.NotSelected) {
      oponent.trash.setColor(!data.playedCard);
    }
  }

  private changeTurn(playerId?: number) {
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
      this.getOponent(playerId!).turn = true;
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
  public transfer_card(
    input: string,
    target_player: number,
    target_deck: string
  ) {
    const source_card = parseCardInfo(input);
    if (source_card.dataIsValid == false) return;

    console.log(
      'Source Deck Before: ',
      this.players[source_card.playerId!]
        .getDeck(source_card.deckId!)
        ?.cards.toString()
    );
    console.log(
      'Target Deck Before',
      this.players[target_player].getDeck(target_deck)?.cards.toString()
    );

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
    console.log(
      'Source Deck After: ',
      this.players[source_card.playerId!]
        .getDeck(source_card.deckId!)
        ?.cards.toString()
    );
    console.log(
      'Target Deck After',
      this.players[target_player].getDeck(target_deck)?.cards.toString()
    );

    this.changeTurn();
  }
}
