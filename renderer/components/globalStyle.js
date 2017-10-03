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
  /* CSS reset */
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed, 
	figure, figcaption, footer, header, hgroup, 
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
    font-family: "Fira Sans";
		vertical-align: baseline;
	}

	/* HTML5 display-role reset for older browsers */
	article, aside, details, figcaption, figure, 
	footer, header, hgroup, menu, nav, section {
		display: block;
	}

	body {
    /* This is required to make the window draggable when hidden-inset is set to window style:
     * See: https://github.com/electron/electron/blob/master/docs/api/frameless-window.md#draggable-region
     */
    //-webkit-app-region: drag;
		line-height: 1;
	}
	ol, ul {
		list-style: none;
	}
	blockquote, q {
		quotes: none;
	}
	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
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
