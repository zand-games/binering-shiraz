import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './deck';
const cards = [1, 1, 1, 1, 0, 0, 0, 0];
import gcss from '../globalcss';
@customElement('section-com')
export class Section extends LitElement {
  render() {
    return html`
      <div class="container">
        <deck-com .cards=${this.shuffle([...cards])}></deck-com>
        <deck-com .cards=${this.shuffle([...cards])}></deck-com>
        <deck-com .cards=${this.shuffle([...cards])}></deck-com>
        <deck-com .cards=${this.shuffle([...cards])}></deck-com>
      </div>
    `;
  }

  shuffle(array: number[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
  static get styles() {
    return [
      gcss,
      css`
        div.container {
          display: grid;
          grid-template-columns: repeat(4, auto);
          column-gap: 0.3em;
        }
      `,
    ];
  }
}
