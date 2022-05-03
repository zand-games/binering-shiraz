import { LitElement, html, css } from 'lit';
import { state, customElement } from 'lit/decorators.js';
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
    var background = this.value == true ? `blue` : 'red';
    var border = this.value == true ? `#075ac1` : '#b31414d6';
    return html`<div
      style="background-color:${background}; border-color:${border}"
      draggable=${this.draggable ? true : false}
      @dragstart=${this.dragstarted}
      @dragend=${this.dragended}
      @dblclick=${this.doubleClick}
      class="card ${this.draggableClass()}"
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
    console.log('for later');
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

  private getCharValue() {
    if (this.value) return 'one';
    else return 'zero';
  }

  private draggableClass() {
    if (this.draggable) return 'draggable';
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
      `,
    ];
  }
}
