import { LitElement, html, css } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import cssg from '../globalcss';
const mainColor = css`red`;
@customElement('zero-card')
export class Zero extends LitElement {
  render() {
    return html` <div class="card">0</div> `;
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
          background-color: ${mainColor};
          box-shadow: 3px 3px 3px gray;
          color: white;
          font-size: 2em;
          border: 3px solid #b31414d6;
        }
      `,
    ];
  }
}
