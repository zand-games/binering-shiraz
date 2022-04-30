import { LitElement, html, css } from 'lit';
import { state, customElement } from 'lit/decorators.js';

import cssg from '../globalcss';

@customElement('trash-comp')
export class Trash extends LitElement {
  @state()
  value!: boolean;

  @state()
  playerId: string = 'A';

  render() {
    var _divValue = '';
    if (this.value == null || this.value == undefined) {
      _divValue = '?';
    } else if (this.value == true) {
      _divValue = '1';
    } else {
      _divValue = '0';
    }
    return html`
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
    //debugger;
    var zeroCard = e.dataTransfer.types.includes('zero||' + this.playerId);
    var oneCard = e.dataTransfer.types.includes('one||' + this.playerId);
    var _playerId = e.dataTransfer.types.toString().split('||')[1];

    if (this.value == undefined) {
      //  game  start
      /// raise an event that game started....
      if (this.playerId == _playerId) {
        e.preventDefault();
      }
    } else {
      if (zeroCard == true && this.value == false) e.preventDefault();

      if (oneCard == true && this.value == true) e.preventDefault();
    }
  }
  dragEntered(e: any) {
    this.style.opacity = '0.4';
  }
  dragEnded(e: any) {
    debugger;
    this.style.opacity = '1';
  }
  dragleaved(e: any) {
    this.style.opacity = '1';
  }
  droped(e: any) {
    debugger;
    var zero = e.dataTransfer.getData('zero||' + this.playerId);
    var one = e.dataTransfer.getData('one||' + this.playerId);

    this.value = zero !== '' ? false : true;
    this.style.opacity = '1';

    document.dispatchEvent(
      new CustomEvent('Card_Remove_Event', { detail: zero !== '' ? zero : one })
    );
  }
  connectedCallback() {
    super.connectedCallback();
  }

  classSelector() {
    debugger;
    if (this.value == null || this.value == undefined) {
      return 'notdefnied';
    } else if (this.value == true) {
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
