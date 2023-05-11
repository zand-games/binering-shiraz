import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './deck-component';
import './trash-component';
import gcss from '../globalcss';
import { GameStore } from '../store';
import { StoreSubscriber } from 'lit-svelte-stores';
let SectionComponent = class SectionComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.game = new StoreSubscriber(this, () => GameStore);
    }
    render() {
        // this.style.setProperty('--color-highlight', this.getColor());
        if (this.player == undefined || this.player.decks == undefined)
            return html ``;
        return html `
      <div class="section">
        <div class="trash">
          <trash-component .playerId=${this.playerId}></trash-component>
        </div>
        <div class="decks">
          ${this.player.decks.map(deck => html ` <deck-component
                .deckId=${deck.id}
                .playerId=${this.playerId}
              ></deck-component>`)}
        </div>
      </div>
    `;
    }
    async connectedCallback() {
        super.connectedCallback();
        await super.connectedCallback();
        GameStore.subscribe(value => (this.player = value.players[this.playerId]));
    }
    getLocation() {
        const v1 = this.player.decks[0].getDecimal();
        const v2 = this.player.decks[1].getDecimal();
        const v3 = this.player.decks[2].getDecimal();
        const v4 = this.player.decks[3].getDecimal();
        // var result = this.Parse4ByteHexGeoTag(v1 + v2 + v3 + v4);
        // console.log(this.convertBytesToLocaion(v1, v2, v3, v4));
        return;
    }
    convertBytesToLocaion(v1, v2, v3, v4) {
        var step2 = (v4 << 48) | (v3 << 32) | (v2 << 16) | v1;
        const step3 = parseFloat(step2.toString()) / 30000;
        var step4 = Math.trunc(step3) / 60;
        var step5 = step3 - Math.trunc(step4) * 60;
        // return 'lang:' + Math.trunc(lang) + ' long:' + long;
        //return Math.trunc(long) + ', ' + Math.trunc(lang);
        return step4.toFixed(3) + ', ' + step5.toFixed(3);
    }
    // public Parse4ByteHexGeoTag(hex: string) {
    //   debugger;
    //   var deg = parseInt(hex.substring(0, 2));
    //   var time = this.convertTodecimal(hex.substring(3)) / 60;
    //   var min = Math.trunc(time);
    //   var sec = (time % 60) * 60;
    //   return deg + '° ' + Math.trunc(min) + "' " + Math.trunc(sec) + "''";
    //   //  return `${deg + "°" + min +  /"\'/" + }`;
    //   //return [deg, min, sec];
    // }
    convertTodecimal(hexString) {
        return parseInt(hexString, 16);
    }
    static get styles() {
        return [
            gcss,
            css `
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
};
__decorate([
    state()
], SectionComponent.prototype, "playerId", void 0);
__decorate([
    property()
], SectionComponent.prototype, "player", void 0);
SectionComponent = __decorate([
    customElement('section-component')
], SectionComponent);
export { SectionComponent };
//# sourceMappingURL=section-component.js.map