import * as fs from 'fs-extra'

export const getBinarySuffix = () => (process.platform === 'win32' ? '.exe' : '')

export const getDirectory = () => {
  if (process.platform === 'win32') {
    const path = `${process.env.LOCALAPPDATA}\\ooniprobe-cli`
    // XXX not sure if this is actually what the sync function is called
    fs.syncEnsureDir(path)
    return path
  }
  const paths = process.env.PATH.split(':')
  // On unix we prefer to store out binary in ~/bin if it's in the users path,
  // other we will go for /usr/local/bin if that is in the path. Otherwise just
  // /usr/bin, though this is sub-optimal as it can conflict with system-wide
  // installs
  const firstCandidate = path.join(process.env.HOME, 'bin')
  const secondCandidate = path.join('/usr/local/bin')
  if (paths.includes(firstCandidate)) {
    return firstCandidate
  } else if (paths.includes(secondCandidate)) {
    return secondCandidate
  }
  return '/usr/bin'
}

export const getFile = () => {
  const directoryPath = getDirectory()
  const suffix = getBinarySuffix()
  return path.join(directoryPath, 'ooni' + suffix)
}
