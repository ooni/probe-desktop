import React from 'react'
import { Text } from 'ooni-components'

import { MdVideoLibrary } from 'react-icons/md'
import formatBitrate from './formatBitrate'

const VideoQuality = ({bitrate}) => {
  const videoQuality = formatBitrate(bitrate)
  return (
    <Text><MdVideoLibrary /> {videoQuality}</Text>
  )
}

export default VideoQuality
