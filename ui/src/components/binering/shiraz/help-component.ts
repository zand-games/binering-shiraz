import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('help-component')
export class HelpComponent extends LitElement {
  @property()
  show?: boolean;
  closeme() {
    this.show = false;
  }

  constructor() {
    super();
    this.show = false;
  }

  helpStatus() {
    return this.show == true ? 'show' : '';
  }
  click() {
    this.show = !this.show;
  }
  render() {
    return html`
      <span class="nonselectable" style="cursor: pointer;" @click=${this.click}
        ><img
          class="question"
          width="30px"
          height="35px"
          src="data:image/png;base64,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"
        />
        <span>
          <div class="winning-message ${this.helpStatus()}" id="winningmessage">
            <div data-winning-message-text>
              <!-- Content -->
              <main>
                <ol class="gradient-list">
                  <li>
                    <h2>How to play:</h2>
                    <p>
                      A) Each player has a <b>deck of 32 cards</b> that splits
                      to <b>4 columns of 8</b>. (each column is equivalent to
                      one byte in the computer science). Columns can not have
                      more than 8 cards.
                    </p>
                    <p>
                      B) You can start the game by Drag&Drap-ing a card (0|1) to
                      your <b>CollectBox</b>.
                      <br />
                      If you select Zero, your opponent will be One and vice
                      versa.
                    </p>
                    <p>
                      C) The goal is to <b>collect your card sooner</b>. If you
                      collect all your selected card from your deck sooner, your
                      opponent will <b>lose</b> the round.
                    </p>
                    <p>
                      D) The only <b>Movable Cards</b> are the ones at the
                      bottom of each column. Other cards are not movable.
                    </p>
                    <p>E) When it is your turn, You <b>must</b> move a card.</p>
                    <p>
                      F) In single-player mode you play with computer, if you
                      want to play with a friend on the same computer, you need
                      to switch to multiple-player.
                    </p>
                  </li>

                  <li>
                    <h2>How to move a card.</h2>
                    <p>
                      Let's imagine you selected
                      <span class="red">0</span> card. So your opponent will be
                      <span class="blue">1</span>
                    </p>
                    <p>
                      A) If you have at least one Movable
                      <span class="red">0</span> Card, You can collect it. (By
                      drag&drop to your CollectBox or double click on it)
                    </p>
                    <p>
                      B) If all your Movable Cards are
                      <span class="blue">1</span>, which means your have no card
                      to collect, so you are able to transfer one of them to
                      your opponent columns that has less than 8 cards. This
                      card will be added to the beginning of the column.
                    </p>
                    <p>
                      C) You can also move one of your movable card from one
                      column to another in your deck.(you may need this move
                      because of your strategy)
                    </p>
                    <p>
                      D) When one of your columns is empty, you should fill it
                      out first. You can not collect your card or transfer a
                      card to your opponent while you have an empty column.
                    </p>
                  </li>
                  <li>
                    <h2>Scoring:</h2>
                    <p>
                      A) If you lose a total score of -21 points in all rounds,
                      you lost the game.
                    </p>
                    <p>
                      B) All the cards left at the end of each round become the
                      negative points of the loser.
                    </p>
                    <p>
                      C) The number of rounds goes on until one player loses.
                    </p>
                  </li>
                  <li>
                    <h2>More about the game</h2>
                    <p>
                      A) at the top of each column there is a number, which is
                      the Decimal conversion of the column which is in byte.
                      More story will be added based on this number.
                    </p>
                    <p>
                      B) Player who selected <b>0 provides Latitude</b> and the
                      opponent with <b> 1 provides Longitude</b>. These are the
                      geographical coordinates for map. On any move of each
                      player, the value of each column is changed, and
                      consequently the coordination of location on the map is
                      changed. More story will be added to the game based on
                      this topic later.
                    </p>
                  </li>
                  <li>
                    <h2>Contact</h2>
                    <p>
                      I would love to hear your feedback and opinion about this
                      game.
                      <br />
                      contact@zand.games
                      <br />
                      <a href="https://www.zand.games/" target="_blank"
                        >Zand.Games</a
                      >
                    </p>
                  </li>
                </ol>
              </main>
              <!-- End of Content -->
            </div>
          </div>
        </span></span
      >
    `;
  }
  static get styles() {
    return [
      css`
        /*** FONTS ***/
        @import url(https://fonts.googleapis.com/css?family=Montserrat:900|Raleway:400,400i,700,700i);
        /*** VARIABLES ***/
        /* Colors */
        /*** EXTEND ***/
        /* box-shadow */
        ol.gradient-list > li::before,
        ol.gradient-list > li {
          box-shadow: 0.25rem 0.25rem 0.6rem rgba(0, 0, 0, 0.05),
            0 0.5rem 1.125rem rgba(75, 0, 0, 0.05);
        }

        /*** STYLE ***/
        *,
        *:before,
        *:after {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        body {
          background-color: #fafafa;
          color: #1d1f20;
          /* font-family: 'Raleway', sans-serif; */
        }

        main {
          display: block;
          margin: 0 auto;
          max-width: 40rem;
          padding: 1rem;
          font-family: 'courier', 'sans-serif', 'Serif';
          font-weight: normal;
          /* font-family: 'Sans-serif,Serif'; */
        }

        ol.gradient-list {
          counter-reset: gradient-counter;
          list-style: none;
          margin: 1.75rem 0;
          padding-left: 1rem;
        }
        ol.gradient-list > li {
          background: white;
          border-radius: 0 0.5rem 0.5rem 0.5rem;
          counter-increment: gradient-counter;
          margin-top: 1rem;
          min-height: 3rem;
          padding: 1rem 1rem 0.5rem 3rem;
          position: relative;
          text-align: left;
          line-height: 1.7em;
        }
        ol.gradient-list > li::before,
        ol.gradient-list > li::after {
          background: linear-gradient(135deg, #83e4e2 0%, #a2ed56 100%);
          border-radius: 1rem 1rem 0 1rem;
          content: '';
          height: 3rem;
          left: -1rem;
          overflow: hidden;
          position: absolute;
          top: -1rem;
          width: 3rem;
        }
        ol.gradient-list > li::before {
          align-items: flex-end;
          content: counter(gradient-counter);
          color: #1d1f20;
          display: flex;
          font: 900 2.5em/1 'Montserrat';
          justify-content: flex-end;
          padding: 0.125em 0.25em;
          z-index: 10;
        }
        ol.gradient-list > li:nth-child(10n + 1):before {
          background: linear-gradient(
            135deg,
            rgba(162, 237, 86, 0.2) 0%,
            rgba(253, 220, 50, 0.2) 100%
          );
        }
        ol.gradient-list > li:nth-child(10n + 2):before {
          background: linear-gradient(
            135deg,
            rgba(162, 237, 86, 0.4) 0%,
            rgba(253, 220, 50, 0.4) 100%
          );
        }
        .red {
          color: red;
        }
        .blue {
          color: blue;
        }
        ol.gradient-list > li:nth-child(10n + 3):before {
          background: linear-gradient(
            135deg,
            rgba(162, 237, 86, 0.6) 0%,
            rgba(253, 220, 50, 0.6) 100%
          );
        }
        ol.gradient-list > li:nth-child(10n + 4):before {
          background: linear-gradient(
            135deg,
            rgba(162, 237, 86, 0.8) 0%,
            rgba(253, 220, 50, 0.8) 100%
          );
        }
        ol.gradient-list > li:nth-child(10n + 5):before {
          background: linear-gradient(135deg, #a2ed56 0%, #fddc32 100%);
        }
        ol.gradient-list > li:nth-child(10n + 6):before {
          background: linear-gradient(
            135deg,
            rgba(162, 237, 86, 0.8) 0%,
            rgba(253, 220, 50, 0.8) 100%
          );
        }
        ol.gradient-list > li:nth-child(10n + 7):before {
          background: linear-gradient(
            135deg,
            rgba(162, 237, 86, 0.6) 0%,
            rgba(253, 220, 50, 0.6) 100%
          );
        }
        ol.gradient-list > li:nth-child(10n + 8):before {
          background: linear-gradient(
            135deg,
            rgba(162, 237, 86, 0.4) 0%,
            rgba(253, 220, 50, 0.4) 100%
          );
        }
        ol.gradient-list > li:nth-child(10n + 9):before {
          background: linear-gradient(
            135deg,
            rgba(162, 237, 86, 0.2) 0%,
            rgba(253, 220, 50, 0.2) 100%
          );
        }
        ol.gradient-list > li:nth-child(10n + 10):before {
          background: linear-gradient(
            135deg,
            rgba(162, 237, 86, 0) 0%,
            rgba(253, 220, 50, 0) 100%
          );
        }
        ol.gradient-list > li + li {
          margin-top: 2rem;
        }

        .winning-message {
          position: fixed;
          display: none;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.9);
          /* justify-content: left;
          align-items: flex-start; */
          /* color: white; */
          font-size: 1rem;
          flex-direction: column;
          /* z-index: 2147483647; */
          overflow: scroll;
        }

        .winning-message.show {
          display: flex;
        }
        .bold {
          font-weight: bold;
        }
        .question {
          cursor: pointer;
          color: red;
        }
      `,
    ];
  }
}
