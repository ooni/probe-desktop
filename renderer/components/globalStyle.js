import { injectGlobal } from 'styled-components'

const CharterRegular = '/static/fonts/Charter-Regular.woff'
const CharterBold = '/static/fonts/Charter-Bold.woff'

const FiraSansLight = '/static/fonts/FiraSans-Light.woff'
const FiraSansRegular = '/static/fonts/FiraSans-Regular.woff'
const FiraSansItalic = '/static/fonts/FiraSans-Italic.woff'
const FiraSansBold = '/static/fonts/FiraSans-Bold.woff'
const FiraSansSemiBold = '/static/fonts/FiraSans-SemiBold.woff'

const SourceCodeProBold = '/static/fonts/SourceCodePro-Bold.woff'
const SourceCodeProRegular = '/static/fonts/SourceCodePro-Regular.woff'

injectGlobal`
  body, html {
    margin: 0;
    font-family: "Fira Sans";
    -webkit-font-smoothing: antialiased;
  }

  main, main > div {
    height: 100%;
  }

  @font-face {
    font-family: "Fira Sans";
    src: url('${FiraSansLight}') format('woff');
    font-style: normal;
    font-weight: 300;
  }

  @font-face {
    font-family: "Fira Sans";
    src: url('${FiraSansRegular}') format('woff');
    font-style: normal;
    font-weight: 400;
  }

  @font-face {
    font-family: "Fira Sans";
    src: url('${FiraSansItalic}') format('woff');
    font-style: italic;
    font-weight: 400;
  }

  @font-face {
    font-family: "Fira Sans";
    src: url('${FiraSansSemiBold}') format('woff');
    font-style: normal;
    font-weight: 600;
  }

  @font-face {
    font-family: "Fira Sans";
    src: url('${FiraSansBold}') format('woff');
    font-style: normal;
    font-weight: 700;
  }

  @font-face {
    font-family: "Source Code Pro";
    src: url('${SourceCodeProRegular}') format('woff');
    font-style: normal;
    font-weight: 400;
  }

  @font-face {
    font-family: "Source Code Pro";
    src: url('${SourceCodeProBold}') format('woff');
    font-style: normal;
    font-weight: 700;
  }

  @font-face {
    font-family: "Charter";
    src: url('${CharterRegular}') format('woff');
    font-style: normal;
    font-weight: 300;
  }

  @font-face {
    font-family: "Charter";
    src: url('${CharterBold}') format('woff');
    font-style: normal;
    font-weight: 700;
  }
`
