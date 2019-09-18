import React from 'react'
import { Text } from 'ooni-components'

import { MdArrowDownward } from 'react-icons/md'
import formatSpeed from './formatSpeed'

const DownloadSpeed = ({bits}) => {
  const speed = formatSpeed(bits)
  return (
    <Text><MdArrowDownward /> {speed.value} {speed.unit}</Text>
  )
}

export default DownloadSpeed
