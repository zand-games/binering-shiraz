import { LitElement, html, css } from 'lit';
import { state, customElement } from 'lit/decorators.js';

import cssg from '../globalcss';

@customElement('card-comp')
export class Card extends LitElement {
  @state()
  value: boolean = false;

  @state()
  draggable: boolean = false;
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  render() {
    return html`<div
      draggable=${this.draggable ? true : false}
      @dragstart=${this.dragstarted}
      @dragend=${this.dragended}
      class="card"
    >
      ${this.value ? 1 : 0}
    </div> `;
  }
  dragstarted(e: any) {
    this.style.opacity = '0.2';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(this.value ? 'one' : 'zero', this.value);
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