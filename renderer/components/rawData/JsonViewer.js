import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// We wrap the json viewer so that we can render it only in client side rendering
class JsonViewer extends React.Component {
  render() {
    // eslint-disable-next-line no-undef
    const ReactJson = require('react-json-view').default
    const {
      src
    } = this.props
    const StyledReactJsonContainer = styled.div`
      .string-value {
        text-overflow: ellipsis;
        max-width: 800px;
        overflow: hidden;
        display: inline-block;
      }
    `
    return (
      <StyledReactJsonContainer>
        <ReactJson collapsed={1} src={src} />
      </StyledReactJsonContainer>
    )
  }
}

JsonViewer.propTypes = {
  src: PropTypes.object.isRequired
}

export default JsonViewer
