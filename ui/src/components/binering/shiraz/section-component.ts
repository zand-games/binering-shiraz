import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './deck-component';
import './trash-component';
const cards = [1, 1, 1, 1, 0, 0, 0, 0];
import gcss from '../globalcss';
import { Player } from '../../../types/binering/Player';
import { GameStore } from '../store';
@customElement('section-component')
export class SectionComponent extends LitElement {
  @state()
  playerId?: number;

  @property()
  private player?: Player;
  connectedCallback() {
    super.connectedCallback();
    GameStore.subscribe(value => (this.player = value.players[this.playerId!]));
  }
  render() {
    return html`
      <div class="section">
        <div class="trash">
          <trash-component .playerId=${this.playerId!}></trash-component>
        </div>
        <div class="decks">
          ${this.player!.decks.map(
            deck =>
              html` <deck-component
                .deckId=${deck.id}
                .playerId=${this.playerId}
              ></deck-component>`
          )}
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      gcss,
      css`
        div.decks {
          display: grid;
          grid-template-columns: repeat(4, auto);
          column-gap: 0.3em;
        }

        div.section {
          display: flex;
          justify-content: space-around;
          align-items: center;
          align-content: center;
        }
        /* div.trash {
          background-color: gray;
        } */
      `,
    ];
  }
}
