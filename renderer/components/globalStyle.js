import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body, html {
    direction: ltr; /* this is flipped by stylis-plugin-rtl */
    margin: 0;
    font-family: "Fira Sans", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`

export default GlobalStyle
