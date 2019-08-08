import React from 'react'
import { Text } from 'ooni-components'

import MdArrowUpward from 'react-icons/lib/md/arrow-upward'
import formatSpeed from './formatSpeed'

const UploadSpeed = ({bits}) => {
  const speed = formatSpeed(bits)
  return (
    <Text><MdArrowUpward /> {speed.value} {speed.unit}</Text>
  )
}

export default UploadSpeed
