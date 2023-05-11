import { LitElement, html, css } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import cssg from '../globalcss';
import { StoreSubscriber } from 'lit-svelte-stores';
import { GameStore } from '../store';
import { GenerateCardData } from '../../../types/binering/Card';
import { ComputerPlayer } from '../../../types/binering/ComputerPlay';

@customElement('card-component')
export class CardComponent extends LitElement {
  @state()
  value: boolean = false;

  @state()
  playerId?: number;

  @state()
  deckId?: string;

  @state()
  draggable: boolean = false;

  game = new StoreSubscriber(this, () => GameStore);

  constructor() {
    super();
  }

  render() {
    var background = this.value == true ? `blue` : 'red';
    var border = this.value == true ? `#075ac1` : '#b31414d6';
    return html`<div
      style="background-color:${background}; border-color:${border}"
      draggable=${this.isDraggable()}
      @dragstart=${this.dragstarted}
      @dragend=${this.dragended}
      @dblclick=${this.doubleClick}
      class="card ${this.draggableClass()}"
      card-data=${GenerateCardData(this.playerId!, this.deckId!, this.value)}
    >
      ${this.value ? 1 : 0}
    </div> `;
  }
  async doubleClick(e: any) {
    if (this.game.value.players[this.playerId!].isComputer == true) return;

    // if (
    //   !(await ComputerPlayer.fill_empty_deck(
    //     this.game.value.players[this.playerId!],
    //     this.game.value
    //   ))
    // ) {
    //   await this.game.value.players[this.playerId!].remove_card(
    //     e.target.getAttribute('card-data')
    //   );
    // }

    await this.game.value.players[this.playerId!].remove_card(
      e.target.getAttribute('card-data')
    );
    GameStore.update(val => {
      val = this.game.value;
      return val;
    });
  }
  dragstarted(e: any) {
    this.style.opacity = '0.2';
    e.dataTransfer.effectAllowed = 'move';
    var data = e.target.getAttribute('card-data');
    e.dataTransfer.setData(data, data);
  }
  dragended() {
    this.style.opacity = '1';
  }
  connectedCallback() {
    super.connectedCallback();
  }
  private isDraggable(): boolean {
    if (this.game.value.players[this.playerId!].isComputer) return false;
    return this.draggable;
  }
  private draggableClass() {
    if (this.game.value.players[this.playerId!].isComputer) return '';
    if (this.draggable) return 'draggable';
  }

  static get styles() {
    return [
      cssg,
      css`
        div.card {
          height: 1.5em;
          width: 1.1em;
          flex: 100px 1 0;
          border-radius: 5px;
          margin-bottom: -20px;
          box-shadow: 3px 3px 3px gray;
          color: white;
          font-size: 2em;
          border: 3px solid;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
        }
        .draggable {
          cursor: pointer;
        }
        .draggable:hover {
          animation: blinker 1s linear infinite;
        }
        @keyframes blinker {
          50% {
            opacity: 0.3;
          }
        }
      `,
    ];
  }
}
