import { LitElement, html, css } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { Events } from '../events';

import cssg from '../globalcss';

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

  constructor() {
    super();
  }

  render() {
    return html`<div
      draggable=${this.draggable ? true : false}
      @dragstart=${this.dragstarted}
      @dragend=${this.dragended}
      @dblclick=${this.doubleClick}
      class="card"
      card-data=${this.playerId! +
      '||' +
      this.getCharValue() +
      '||' +
      this.deckId?.toLocaleLowerCase()}
    >
      ${this.value ? 1 : 0}
    </div> `;
  }
  doubleClick(e: any) {
    debugger;
    console.log('for later');
    // alert('clicked');
    // document.dispatchEvent(
    //   new CustomEvent(Events.Card_Removed, {
    //     detail: this.playerId + '||' + this.deckId,
    //   })
    // );
  }
  dragstarted(e: any) {
    //debugger;
    this.style.opacity = '0.2';
    e.dataTransfer.effectAllowed = 'move';
    var data = e.target.getAttribute('card-data');
    e.dataTransfer.setData(data, data);
    // var one_value = 'one||' + this.playerId;
    // var zero_value = 'zero||' + this.playerId;
    // e.dataTransfer.setData(
    //   this.value ? one_value : zero_value,
    //   this.playerId + '||' + this.deckId
    // );
  }
  dragended() {
    this.style.opacity = '1';
  }
  connectedCallback() {
    super.connectedCallback();

    this.style.setProperty(
      '--background-color',
      this.value == true ? `blue` : 'red'
    );
    this.style.setProperty(
      '--border-color',
      this.value == true ? `#075ac1` : '#b31414d6'
    );
  }

  private getCharValue() {
    if (this.value) return 'one';
    else return 'zero';
  }

  static get styles() {
    return [
      cssg,
      css`
        div.card {
          height: 100px;
          width: 60px;
          flex: 100px 1 0;
          border-radius: 5px;
          margin-bottom: -20px;
          background-color: var(--background-color);
          box-shadow: 3px 3px 3px gray;
          color: white;
          font-size: 2em;
          border: 3px solid;
          border-color: var(--border-color);
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
        }
      `,
    ];
  }
}
