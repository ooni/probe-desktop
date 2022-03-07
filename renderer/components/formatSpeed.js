const formatSpeed = (speed) => {
  // Returns human readable speed values kbps, mbps, gbps etc

  // For invalid speed values, return null
  if (typeof speed !== 'number') {
    return {
      value: null,
      unit: 'kbps'
    }
  }
  if (speed < 1000) {
    return {
      value: speed.toFixed(1),
      unit: 'kbps'
    }
  }
  if (speed < 1000*1000) {
    return {
      value: (speed / 1000).toFixed(1),
      unit: 'mbps'
    }
  }
  return {
    value: (speed / (1000*1000)).toFixed(1),
    unit: 'gbps'
  }
}

export default formatSpeed
