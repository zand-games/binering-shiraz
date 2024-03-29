import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './deck-component';
import './trash-component';
import { GameStore } from '../store';
import { StoreSubscriber } from 'lit-svelte-stores';
import { PlayeType } from '../../../types/binering/Game';
let PlayerTypeComponent = class PlayerTypeComponent extends LitElement {
    get Single() {
        return this.game.value.playType;
    }
    constructor() {
        super();
        //countries?: Array<Item>;
        this.game = new StoreSubscriber(this, () => GameStore);
    }
    render() {
        return html `
      <div class="container">
        <label for="single" class="l-radio">
          <input
            type="radio"
            id="single"
            name="playType"
            value="1"
            ?checked=${this.game.value.playType.toString() === '1'}
            @click=${this.onChange}
          />
          <span>Single-Player</span></label
        >
        <label for="multi" class="l-radio">
          <input
            type="radio"
            id="multi"
            name="playType"
            value="2"
            ?checked=${this.game.value.playType.toString() === '2'}
            @click=${this.onChange}
          />
          <span>Multi-Player</span>
        </label>
      </div>
    `;
    }
    async onChange(event) {
        this.game.value.playType =
            event.target.value == '1' ? PlayeType.Single : PlayeType.MultiPlayer;
        await this.game.value.startNewGame();
        GameStore.update(val => {
            val = this.game.value;
            return val;
        });
    }
    static get styles() {
        return [
            css `
        .container {
          font-family: sans-serif;
          /* min-height: 100vh; */
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1em;
        }

        * {
          box-sizing: border-box;
        }

        .l-radio {
          padding: 6px;
          border-radius: 50px;
          display: inline-flex;
          cursor: pointer;
          background-color: #ddce98;
          transition: background 0.2s ease;
          margin: 8px 0;
          -webkit-tap-highlight-color: transparent;
          font-size: 0.7em;
          margin: 0;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
          border-radius: 25px;
          border: 1px solid #656a5e;
        }
        .l-radio:hover,
        .l-radio:focus-within {
          background: rgba(159, 159, 159, 0.1);
        }
        .l-radio input {
          vertical-align: middle;
          width: 20px;
          height: 20px;
          border-radius: 10px;
          background: none;
          border: 0;
          box-shadow: inset 0 0 0 1px #9f9f9f;
          box-shadow: inset 0 0 0 1.5px #9f9f9f;
          appearance: none;
          padding: 0;
          margin: 0;
          transition: box-shadow 150ms cubic-bezier(0.95, 0.15, 0.5, 1.25);
          pointer-events: none;
        }
        .l-radio input:focus {
          outline: none;
        }
        .l-radio input:checked {
          box-shadow: inset 0 0 0 6px #6743ee;
        }
        .l-radio span {
          vertical-align: middle;
          display: inline-block;
          line-height: 20px;
          padding: 0 8px;
        }
        /* .container {
          border: 2px solid #656a5e;
          padding: 10px;
          width: 100px;
        } */
      `,
        ];
    }
};
PlayerTypeComponent = __decorate([
    customElement('playertype-component')
], PlayerTypeComponent);
export { PlayerTypeComponent };
//# sourceMappingURL=playertype-component.js.map