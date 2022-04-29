import { LitElement, html, css } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import cssg from '../globalcss';
const mainColor = css`blue`;
@customElement('one-card')
export class One extends LitElement {
  render() {
    return html` <div class="card">1</div> `;
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
          border: 3px solid #075ac1;
          color: white;
          font-size: 2em;

          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
        }
      `,
    ];
  }
}
