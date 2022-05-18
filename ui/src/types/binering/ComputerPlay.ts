import { GameStore } from '../../components/binering/store';
import { GenerateCardData } from './Card';
import { Game } from './Game';
import { Player } from './Player';

export class ComputerPlayer {
  public static async fill_empty_deck(
    myBoard: Player,
    game: Game
  ): Promise<boolean> {
    var emptyDecks = myBoard.decks.filter(i => i.cards.length == 0);
    if (emptyDecks.length > 1) {
      alert(
        'BUG: Blank Decks >1 : Would you please kindly send this bug to Hedayat with a screenshot'
      );
    }
    if (emptyDecks.length == 1) {
      const emptyDeck = emptyDecks[0];
      const candidateDecks = myBoard.decks.filter(
        i => i.id != emptyDeck.id && i.cards.length > 1
      );
      const selectedDeck =
        candidateDecks[Math.floor(Math.random() * candidateDecks.length)];
      const cardData = GenerateCardData(
        myBoard.id,
        selectedDeck.id,
        selectedDeck.cards[selectedDeck.cards.length - 1]
      );
      await game.transfer_card(cardData, myBoard.id, emptyDeck.id);
      return true;
    } else {
      return false;
    }
  }

  public static async remove_card(
    myBoard: Player,
    game: Game
  ): Promise<boolean> {
    var decks = myBoard.decks.filter(
      i => i.cards[i.cards.length - 1] == myBoard.trash!.value
    );

    var deck = decks[Math.floor(Math.random() * decks.length)];
    if (deck != undefined) {
      // move to trash
      const cardData = GenerateCardData(
        myBoard.id,
        deck.id,
        myBoard.trash!.value
      );
      await myBoard.remove_card(cardData);
      return true;
    } else {
      return false;
    }
  }

  private static async transfer_card_to_oponent(
    opponent: Player,
    myBoard: Player,
    game: Game
  ): Promise<boolean> {
    var myDecks = myBoard.decks.filter(
      i => i.cards[i.cards.length - 1] == !myBoard.trash!.value
    );
    var myDeck = myDecks[Math.floor(Math.random() * myDecks.length)];

    var opponentdecks = opponent.decks.filter(i => i.cards.length < 8);
    var opponentdeck =
      opponentdecks[Math.floor(Math.random() * opponentdecks.length)];

    if (myDeck != undefined && opponentdeck != undefined) {
      const cardData = GenerateCardData(
        myBoard.id,
        myDeck.id,
        !myBoard.trash!.value
      );
      await game.transfer_card(cardData, opponent.id, opponentdeck.id);
      return true;
    } else {
      return false;
    }
  }
  static numerber = 0;
  public static async Move(opponent: Player, myBoard: Player, game: Game) {
    await delay(6000);
    if (!(await ComputerPlayer.fill_empty_deck(myBoard, game))) {
      if (!(await ComputerPlayer.remove_card(myBoard, game))) {
        if (
          !(await ComputerPlayer.transfer_card_to_oponent(
            opponent,
            myBoard,
            game
          ))
        ) {
          alert(
            'BUG: there is no possible movement by computer. Would you please take screenshot for Hedayat'
          );
        }
      }
    }

    GameStore.update(val => {
      val = game;
      return val;
    });
    await delay(1000);
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
