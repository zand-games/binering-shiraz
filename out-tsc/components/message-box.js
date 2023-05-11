import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let Messagebox = class Messagebox extends LitElement {
    constructor() {
        super(...arguments);
        this.msgBox = document.getElementById('msg');
        this.container = document.getElementById('container');
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('msg-event', e => {
            this.message = 'hi there';
            this.requestUpdate();
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('msg-event', this.showMessage);
    }
    showMessage(e) {
        // // var div = document.getElementById('msg');
        // // // ✅ Change (replace) the text of the element
        // // div!.innerHTML = e.detail;
        this.message = e.detail;
        //console.log(this.message);
        var self = this;
        this.requestUpdate();
        //this.container?.classList.remove('hide');
        setInterval(function () {
            //self.container?.classList.add('hide');
        }, 2000);
    }
    render() {
        return html `<div id="container " class="container hide">
      <!-- <div class="arrow">
        <div class="outer"></div>
        <div class="inner"></div>
      </div> -->
      <div class="message-body">
        <p id="msg">${this.message}</p>
      </div>
    </div>`;
    }
    static get styles() {
        return [
            css `
        .hide {
          display: none;
        }
        /* body {
          margin: 80px 200px;
          background-color: #cccccc;
        } */

        /* Message box starts here */
        .container {
          position: absolute;
          height: 40px;
          align-items: center;
          align-content: center;
          /* z-index: 101; */
          top: 0;
          left: 0;
          right: 0;
          background: #88dddb;
          text-align: center;
          line-height: 1;
          overflow: hidden;
          -webkit-box-shadow: 0 0 5px black;
          -moz-box-shadow: 0 0 5px black;
          box-shadow: 0 0 5px black;
          font-size: 0.8em;
          /* clear: both;
          position: relative; */
        }

        /* .container .arrow {
          width: 12px;
          height: 20px;
          overflow: hidden;
          position: relative;
          float: left;
          top: 6px;
          right: -1px;
        }

        .container .arrow .outer {
          width: 0;
          height: 0;
          border-right: 20px solid #000000;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          position: absolute;
          top: 0;
          left: 0;
        }

        .container .arrow .inner {
          width: 0;
          height: 0;
          border-right: 20px solid #ffffff;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          position: absolute;
          top: 0;
          left: 2px;
        } */

        /* .container .message-body {
          float: left;
          width: 300px;
          height: auto;
          border: 1px solid #ccc;
          background-color: #ffffff;
          border: 1px solid #000000;
          padding: 6px 8px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          -o-border-radius: 5px;
          border-radius: 5px;
        } */

        .container .message-body p {
          margin: 0;
        }
      `,
        ];
    }
};
__decorate([
    property()
], Messagebox.prototype, "message", void 0);
Messagebox = __decorate([
    customElement('msg-component')
], Messagebox);
export { Messagebox };
//# sourceMappingURL=message-box.js.map