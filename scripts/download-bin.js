/* global require */

const { execSync } = require('child_process')
const { readFileSync } = require('fs')
const pkgJson = require('../package.json')

const probeVersion = pkgJson['probeVersion']
const baseURL = `https://github.com/ooni/probe-cli/releases/download/v${probeVersion}`
const download = () => {
  let checksums = {}

  const dists = [
    'windows_amd64',
    'linux_amd64',
    'darwin_amd64'
  ]
  execSync(`curl -L -o ./bin/ooniprobe_checksums.txt ${baseURL}/ooniprobe_checksums.txt`)
  const checksumsData = readFileSync('./bin/ooniprobe_checksums.txt')
  checksumsData.toString().split('\n').forEach(line => {
    const [sum, pkg] = line.split('  ')
    checksums[pkg] = sum
  })
  dists.forEach(d => {
    const tarPath = `ooniprobe_${probeVersion}_${d}.tar.gz`
    const downloadURL = `${baseURL}/${tarPath}`
    console.log(`Downloading ${downloadURL}`)
    execSync(`mkdir -p bin/${d}`)
    execSync(`curl -L -o ./bin/${tarPath} ${downloadURL}`)
    execSync(`cd ./bin/${d} && tar xzf ../${tarPath}`)
    const shasum = execSync(`shasum -a 256 ./bin/${tarPath}`).toString().split(' ')[0]
    if (shasum !== checksums[tarPath]) {
      throw Error(`Invalid checksum ${shasum} ${checksums[tarPath]}`)
    }
    execSync(`rm ./bin/${tarPath}`)
  })
  execSync('cp /etc/ssl/cert.pem ./bin/cert.pem')
}

download()
