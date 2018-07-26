const formatSpeed = (speed) => {
  if (speed < 1000) {
    return {
      value: speed,
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
