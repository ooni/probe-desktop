/* global require */

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
  const osarchlist = ['darwin_amd64', 'linux_amd64', 'windows_amd64']
  for (let i = 0; i < osarchlist.length; i += 1) {
    const osarch = osarchlist[i]
    const tarball = `ooniprobe_${osarch}.tar.gz`
    const tarballURL = `${baseURL}/${tarball}`
    const sig = `${tarball}.asc`
    const sigURL = `${tarballURL}.asc`
    if (existsSync(`${dstDir}/${tarball}`) === false) {
      console.log(`Downloading ${tarball}`)
      execSync(`curl -#f -L -o ${dstDir}/${tarball} ${tarballURL}`)
    }
    if (existsSync(`${dstDir}/${sig}`) === false) {
      console.log(`Downloading ${sig}`)
      execSync(`curl -#f -L -o ${dstDir}/${sig} ${sigURL}`)
    }
    try {
      execSync(`gpg --quiet --verify ${dstDir}/${sig} ${dstDir}/${tarball}`)
    } catch (e) {
      console.error(`Signature verification failure: ${e}`)
    }
    ensureDirSync(`${dstDir}/${osarch}`)
    execSync(`cd ${dstDir}/${osarch} && tar xzf ../${tarball}`)
  }
}

download()
