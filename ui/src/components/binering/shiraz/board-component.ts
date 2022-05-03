import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './section-component';
import { GameStore } from '../store';
import gcss from '../globalcss';
import { Game } from '../../../types/binering/Game';
import { derived, Writable } from 'svelte/store';
import { StoreSubscriber } from 'lit-svelte-stores';
@customElement('board-component')
export class BoardComponent extends LitElement {
  render() {
    return html`
      <div class="container">
        <section-component .playerId=${1}></section-component>
        <section-component .playerId=${2}></section-component>
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
