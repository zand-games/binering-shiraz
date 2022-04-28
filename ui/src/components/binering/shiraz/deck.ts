import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './zero';
import './one';
import cssg from '../globalcss';

@customElement('deck-com')
export class Deck extends LitElement {
  @property()
  cards!: number[];

  render() {
    return html` <div class="deck">
      ${this.cards.map(card =>
        card == 1 ? html`<zero-card></zero-card>` : html`<one-card></one-card>`
      )}
    </div>`;
  }

  static get styles() {
    return [
      cssg,
      css`
        div.deck {
          display: flex;
          height: 200px;
          flex-direction: column;
          /* grid-row-gap: 5em; */
        }
      `,
    ];
  }
}
