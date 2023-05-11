import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './card-component';
import cssg from '../globalcss';
import { GameStore } from '../store';
import { StoreSubscriber } from 'lit-svelte-stores';
let DeckComponent = class DeckComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.game = new StoreSubscriber(this, () => GameStore);
    }
    get deck() {
        return this.game.value.players[this.playerId].getDeck(this.deckId);
    }
    connectedCallback() {
        super.connectedCallback();
    }
    render() {
        var _a;
        return html ` <div class="tooltip">
        <span class="tooltiptext">${(_a = this.deck) === null || _a === void 0 ? void 0 : _a.getDecimal()}</span>
      </div>
      <div
        class="deck"
        @drop=${this.droped}
        @dragover=${this.dragovered}
        @dragenter=${this.dragEntered}
        @dragend=${this.dragended}
        @dragleave=${this.dragleaved}
      >
        ${this.deck.cards.length > 0
            ? this.deck.cards.map((card, i, arr) => html `<card-component
                  .playerId=${this.playerId}
                  .value=${card}
                  .deckId=${this.deckId}
                  .draggable=${this.isdraggable(i, arr)}
                >
                </card-component>`)
            : html `<div class="empty">${this.deckId.toUpperCase()}</div>`}
      </div>`;
    }
    isdraggable(index, arr) {
        const iscardIsLastIndex = arr.length - 1 === index ? true : false;
        if (iscardIsLastIndex == false)
            return false;
        // Game is not strated
        if (this.game.value.players[this.playerId].turn == null ||
            this.game.value.players[this.playerId].turn == undefined)
            return true;
        if (this.game.value.players[this.playerId].turn == true)
            return true;
        return false;
    }
    dragended() {
        this.style.opacity = '1';
    }
    dragleaved() {
        this.style.opacity = '1';
    }
    dragEntered(e) { }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    async droped(e) {
        await this.game.value.transfer_card(e.dataTransfer.types, this.playerId, this.deckId);
        GameStore.update(val => {
            val = this.game.value;
            return val;
        });
        this.style.opacity = '1';
    }
    dragovered(e) {
        var _a;
        this.style.opacity = '.5';
        if ((_a = this.deck) === null || _a === void 0 ? void 0 : _a.acceptNewCard(e.dataTransfer.types, this.game.value
            .getOponent(this.playerId)
            .can_Card_Transfer_To_Oponent())) {
            e.preventDefault();
        }
    }
    static get styles() {
        return [
            cssg,
            css `
        div.deck {
          display: flex;
          height: 200px;
          flex-direction: column;
        }

        div.empty {
          height: 100px;
          width: 60px;
          flex: 100px 1 0;
          border-radius: 5px;

          background-color: var(--background-color);
          box-shadow: 3px 3px 3px gray;
          color: white;
          /* font-size: 0.5em; */
          border: 3px solid;
          border-color: gray;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
        }

        .tooltip {
          position: relative;
          display: inline-block;
          border-bottom: 1px dotted black;
        }

        .tooltip .tooltiptext {
          visibility: visible;
          width: 40px;
          background-color: black;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px 0;
          position: absolute !important;
          /* z-index: 1; */
          bottom: 150%;
          left: 50%;
          margin-left: -20px;
          font-size: 0.6em;
        }

        .tooltip .tooltiptext::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: black transparent transparent transparent;
          visibility: visible;
        }

        .tooltip:hover .tooltiptext {
          visibility: visible;
        }
      `,
        ];
    }
};
__decorate([
    state()
], DeckComponent.prototype, "playerId", void 0);
__decorate([
    state()
], DeckComponent.prototype, "deckId", void 0);
DeckComponent = __decorate([
    customElement('deck-component')
], DeckComponent);
export { DeckComponent };
//# sourceMappingURL=deck-component.js.map