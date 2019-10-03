/* global require */

const { execSync } = require('child_process')
const { readFileSync, existsSync } = require('fs')
const pkgJson = require('../package.json')

const probeVersion = pkgJson['probeVersion']
const baseURL = `https://github.com/ooni/probe-cli/releases/download/v${probeVersion}`
const download = () => {
  let checksums = {}

  execSync(`curl -#f -L -o ./bin/ooniprobe_checksums.txt ${baseURL}/ooniprobe_checksums.txt`)
  const checksumsData = readFileSync('./bin/ooniprobe_checksums.txt')
  checksumsData.toString().split('\n').forEach(line => {
    if (line === "") {
      return
    }
    const [sum, tarPath] = line.split('  ')
    checksums[tarPath] = sum
    const re = /^ooniprobe_v[0-9.a-z-]+_((darwin|linux|windows)_amd64).tar.gz$/
    const result = tarPath.match(re)
    if (!result) {
      throw Error(`The path '${tarPath}' does not match our expectations`)
    }
    const d = result[1]
    const downloadURL = `${baseURL}/${tarPath}`
    console.log(`Downloading ${downloadURL}`)
    execSync(`mkdir -p bin/${d}`)
    execSync(`curl -#f -L -o ./bin/${tarPath} ${downloadURL}`)
    execSync(`cd ./bin/${d} && tar xzf ../${tarPath}`)
    const shasum = execSync(`shasum -a 256 ./bin/${tarPath}`).toString().split(' ')[0]
    if (shasum !== checksums[tarPath]) {
      throw Error(`Invalid checksum ${shasum} ${checksums[tarPath]}`)
    }
    execSync(`rm ./bin/${tarPath}`)
  })
}

download()
