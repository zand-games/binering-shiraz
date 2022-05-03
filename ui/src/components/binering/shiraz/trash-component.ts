import { LitElement, html, css } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';

import cssg from '../globalcss';
import { GameStore } from '../store';
import { Trash, Color } from '../../../types/binering/Trash';
import { Player } from '../../../types/binering/Player';
import { tsGenerator } from '@type-craft/content';
import { Game } from '../../../types/binering/Game';
import { StoreSubscriber } from 'lit-svelte-stores';
@customElement('trash-component')
export class TrashComponent extends LitElement {
  @state()
  playerId!: number;

  game = new StoreSubscriber(this, () => GameStore);
  private get trash() {
    return this.game.value.players[this.playerId!].trash;
  }

  render() {
    var _divValue = '';
    if (this.trash!.selectedCard == Color.NotSelected) {
      _divValue = '?';
    } else if (this.trash!.selectedCard == Color.True) {
      _divValue = '1';
    } else {
      _divValue = '0';
    }
    var turn = html`<div class="turn ">Your Turn!</div>`;
    return html`
      <div
        @dragenter=${this.dragEntered}
        @dragend=${this.dragEnded}
        @dragleave=${this.dragleaved}
        @drop=${this.droped}
        @dragover=${this.dragovered}
        class="trashbox shadow ${this.classSelector()}"
      >
        ${this.game.value.players[this.playerId].turn == true ? turn : ''}
        ${_divValue}
      </div>
    `;
  }
  dragovered(e: any) {
    if (
      this.game.value.players[this.playerId!].can_card_removable(
        e.dataTransfer.types.toString()
      )
    ) {
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
    this.game.value.players[this.playerId].remove_card(e.dataTransfer.types);
    this.style.opacity = '1';
    GameStore.update(val => {
      val = this.game.value;
      return val;
    });
  }

  classSelector() {
    if (this.trash!.selectedCard == Color.NotSelected) {
      return 'notdefnied';
    } else if (this.trash!.selectedCard == Color.True) {
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
        .turn {
          font-size: 0.4em;
          background-color: #23303e;
          opacity: 0.8;
        }
      `,
    ];
  }
}
