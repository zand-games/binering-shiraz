import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './deck-component';
import './trash-component';
import gcss from '../globalcss';
import { Player } from '../../../types/binering/Player';
import { GameStore } from '../store';
import { StoreSubscriber } from 'lit-svelte-stores';
@customElement('section-component')
export class SectionComponent extends LitElement {
  @state()
  playerId?: number;

  @property()
  private player?: Player;

  game = new StoreSubscriber(this, () => GameStore);

  render() {
    this.style.setProperty('--color-highlight', this.getColor());

    if (this.player == undefined || this.player!.decks == undefined)
      return html``;
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

  async connectedCallback() {
    super.connectedCallback();
    await super.connectedCallback();
    GameStore.subscribe(value => (this.player = value.players[this.playerId!]));
  }
  getColor() {
    var color: any = [];

    color.push(this.player!.decks[0].getDecimal());
    color.push(this.player!.decks[1].getDecimal());
    color.push(this.player!.decks[3].getDecimal());
    color.push(this.player!.decks[3].getPercentage());

    return `rgba(${color.join()})`;
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

        .dynamic-color {
          background-color: var(--color-highlight);
        }
      `,
    ];
  }
}
