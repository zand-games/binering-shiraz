import { LitElement, html, css } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import cssg from '../globalcss';
const mainColor = css`blue`;
@customElement('one-card')
export class One extends LitElement {
  render() {
    return html` <div class="container">1</div> `;
  }

  static get styles() {
    return [
      cssg,
      css`
        div.container {
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2em;
          height: 100px;
          width: 100px;
          background-color: ${mainColor};
          border: 1px solid black;
        }
      `,
    ];
  }
}
