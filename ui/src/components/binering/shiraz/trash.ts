import { LitElement, html, css } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';

import cssg from '../globalcss';
import { Events } from '../events';
import { GameStore } from '../store';
import { Trash, Color } from '../../../types/binering/Trash';
import { Player } from '../../../types/binering/Player';
import { tsGenerator } from '@type-craft/content';
import { Game } from '../../../types/binering/Game';
@customElement('trash-component')
export class TrashComponent extends LitElement {
  // @state()
  // value!: boolean;

  @state()
  playerId!: number;

  @state()
  player!: Player;

  connectedCallback() {
    super.connectedCallback();
    GameStore.subscribe(
      value => (this.player! = value.players[this.playerId!])
    );
  }

  render() {
    var _divValue = '';
    //debugger;
    if (this.player.trash!.selectedCard == Color.NotSelected) {
      _divValue = '?';
    } else if (this.player.trash!.selectedCard == Color.True) {
      _divValue = '1';
    } else {
      _divValue = '0';
    }
    return html`
      <h5>Player Counter: ${this.player?.counter}</h5>

      <div
        @dragenter=${this.dragEntered}
        @dragend=${this.dragEnded}
        @dragleave=${this.dragleaved}
        @drop=${this.droped}
        @dragover=${this.dragovered}
        class="trashbox shadow ${this.classSelector()}"
      >
        ${_divValue}
      </div>
    `;
  }
  dragovered(e: any) {
    if (this.player.trash!.isValidCard(e.dataTransfer.types.toString())) {
      e.preventDefault();
    }
  }
  dragEntered(e: any) {
    this.style.opacity = '0.4';
  }
  dragEnded(e: any) {
    this.style.opacity = '1';
  }
  dragleaved(e: any) {
    this.style.opacity = '1';
  }
  droped(e: any) {
    this.player.remove_card(e.dataTransfer.types);
    this.style.opacity = '1';
    GameStore.update(val => {
      val.players[this.playerId].decks = this.player.decks;
      return val;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(
      Events.First_Started_Round,
      this.firstPlayerSelected
    );
  }

  firstPlayerSelected(e: any) {
    //debugger;
    // const dataArray = e.detail.split('||');
    // const _playerId = dataArray[0];
    // const value = dataArray[1];
    // if (
    //   value == null ||
    //   value == undefined ||
    //   _playerId == null ||
    //   _playerId == undefined
    // )
    //   return;
    // if (_playerId != this.playerId) {
    //   this.value = value == 'true' ? false : true;
    // }
  }

  classSelector() {
    // debugger;
    if (this.player.trash!.selectedCard == Color.NotSelected) {
      return 'notdefnied';
    } else if (this.player.trash!.selectedCard == Color.True) {
      return 'one';
    } else {
      return 'zero';
    }
  }

  static get styles() {
    return [
      cssg,
      css`
        .trashbox {
          height: 100px;
          width: 200px;
          margin-right: 50px;
          color: white;
          font-size: 2em;
          align-items: center;
          align-items: center;
          text-align: center;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
        }
        .notdefnied {
          background-color: gray;
        }
        .one {
          background-color: blue;
        }
        .zero {
          background-color: red;
        }
        .shadow {
          -moz-box-shadow: 3px 3px 5px 6px #ccc;
          -webkit-box-shadow: 3px 3px 5px 6px #ccc;
          box-shadow: 3px 3px 5px 6px #ccc;
        }
      `,
    ];
  }
}
