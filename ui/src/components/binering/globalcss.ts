import { css } from 'lit-element';

export default css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  *:not(#bg) {
    z-index: 1;
    position: relative;
  }
`;
