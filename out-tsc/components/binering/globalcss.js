import { css } from 'lit-element';
export default css `
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  *:not(#bg) {
    z-index: 1;
    position: relative;
  }

  .nonselectable {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }
`;
//# sourceMappingURL=globalcss.js.map