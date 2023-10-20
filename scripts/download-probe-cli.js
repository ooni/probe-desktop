const path = require('path')
const { execSync } = require('child_process')
const { existsSync, ensureDirSync } = require('fs-extra')
const pkgJson = require('../package.json')

const probeVersion = pkgJson['probeVersion']
const baseURL = `https://github.com/ooni/probe-cli/releases/download/v${probeVersion}`

const appRoot = path.resolve(path.join(__dirname, '..'))
const dstDir = path.join(appRoot, 'build', 'probe-cli')

const download = () => {
  ensureDirSync(dstDir)
  const osarchs = [
    'darwin-amd64',
    'linux-amd64',
    'windows-amd64',
  ]
  var osarch
  for (osarch of osarchs) {
    const extension = osarch.includes('windows') ? '.exe' : ''
    const filename = `ooniprobe-${osarch}${extension}`
    const fileURL = `${baseURL}/${filename}`
    const versionedFilename = `${probeVersion}__${filename}`
    if (existsSync(`${dstDir}/${versionedFilename}`) === false) {
      console.log(`download ${versionedFilename}`)
      execSync(`curl -#f -L -o ${dstDir}/${versionedFilename} ${fileURL}`)
    }
    osarch = osarch.replace('-', '_')
    ensureDirSync(`${dstDir}/${osarch}`)
    execSync(`cp ${dstDir}/${versionedFilename} ${dstDir}/${osarch}/ooniprobe${extension}`)
    execSync(`chmod +x ${dstDir}/${osarch}/ooniprobe${extension}`)
  }
}

download()
