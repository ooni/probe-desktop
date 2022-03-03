import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Text } from 'ooni-components'
import { IconButton } from 'ooni-components/dist/atoms/IconButton'
import { FormattedMessage } from 'react-intl'
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdVerticalAlignBottom } from 'react-icons/md'

import NoRTLFlip from '../NoRTLFlip'

const CodeLogContainer = styled(NoRTLFlip)`
  margin: 0 auto;
  width: 100%;
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  overflow-wrap: break-word;
  background-color: black;
`

const Lines = styled(Text)`
  padding-block-start: 20px;
  padding-inline-start: 20px;
  color: white;
  font-family: monospace;
  white-space: pre;
  text-align: start;
`

const ToggleButtonContainer = styled(Flex)`
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.gray4};
  }
`

export const ToggleLogButton = ({open, onClick}) => {
  if (open) {
    return <ToggleButtonContainer onClick={onClick} data-testid='toggle-log-button'>
      <Box>
        <FormattedMessage id='Dashboard.Running.CloseLog' />
      </Box>
      <Box>
        <MdKeyboardArrowDown size={30} />
      </Box>
    </ToggleButtonContainer>
  }
  return <ToggleButtonContainer onClick={onClick} data-testid='toggle-log-button'>
    <Box>
      <FormattedMessage id='Dashboard.Running.ShowLog' />
    </Box>
    <Box>
      <MdKeyboardArrowUp size={30} />
    </Box>
  </ToggleButtonContainer>
}

ToggleLogButton.propTypes = {
  open: PropTypes.bool,
  onClick: PropTypes.func
}

const CodeLog = ({lines}) => {
  return (
    <CodeLogContainer>
      <Lines>{lines.join('\n')}</Lines>
    </CodeLogContainer>
  )
}

CodeLog.propTypes = {
  lines: PropTypes.array,
}

export const AutoScrollContainer = ({ lines }) => {
  const bottomRef = useRef()
  const [autoscroll, setAutoscroll] = useState(true)

  const enableAutoscroll = () => setAutoscroll(true)
  const disableAutoscroll = () => setAutoscroll(false)

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  useEffect(() => {
    autoscroll && scrollToBottom()
  }, [autoscroll, lines])

  return (
    <CodeLogContainer onWheel={disableAutoscroll}>
      <Lines>
        {lines &&
          lines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        <div ref={bottomRef}></div>
      </Lines>
      
      <Box p={3} sx={{ position: 'fixed', bottom: 0, right: 0, color: 'white' }}>
        <IconButton icon={<MdVerticalAlignBottom size={24} />} onClick={enableAutoscroll} />
      </Box>
    </CodeLogContainer>
  )
}

AutoScrollContainer.propTypes = {
  lines: PropTypes.array
}

const LogContainer = styled(Box)`
  margin-top: auto;
`

export const Logs = ({lines, onToggleLog, open}) => (
  <LogContainer>
    <ToggleLogButton onClick={onToggleLog} open={open} />
    {open && <AutoScrollContainer lines={lines} />}
  </LogContainer>
)

Logs.propTypes = {
  lines: PropTypes.array,
  onToggleLog: PropTypes.func,
  open: PropTypes.bool
}