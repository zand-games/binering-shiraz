import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './section';

import gcss from '../globalcss';
@customElement('board-game')
export class Board extends LitElement {
  render() {
    return html`
      <div class="container">
        <section-com .playerId=${'a'}></section-com>
        <section-com .playerId=${'b'}></section-com>
      </div>
    `;
  }

  static get styles() {
    return [
      gcss,
      css`
        div.container {
          display: grid;
          grid-template-columns: repeat(2, auto);
          column-gap: 10rem;
        }
      `,
    ];
  }
}
