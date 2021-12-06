/* global require */

const path = require('path')
const process = require('process')
const { execSync } = require('child_process')
const { existsSync, ensureDirSync } = require('fs-extra')

const baseURL = 'https://dist.torproject.org/torbrowser/11.0.1/'

const appRoot = path.resolve(path.join(__dirname, '..'))
const dstDir = path.join(appRoot, 'build', 'tor')

const extractWin = (pkgName) => {
  execSync(`cd ${dstDir}/windows_amd64 && unzip ../${pkgName} -d ${pkgName.replace('.zip', '')}`)
  execSync(`mv ${dstDir}/windows_amd64/${pkgName.replace('.zip', '')}/Tor/* ${dstDir}/windows_amd64/`)
  execSync(`rm -rf ${dstDir}/windows_amd64/${pkgName.replace('.zip', '')}`)
}

const extractMac = (pkgName) => {
  const ret = execSync(`hdiutil attach "${dstDir}/${pkgName}"`)
  const mountPoint = ret.toString().split('\t')[2].trim()
  execSync(`cp "${mountPoint}/Tor Browser.app/Contents/MacOS/Tor/tor.real" ${dstDir}/darwin_amd64/tor`)
  execSync(`cp "${mountPoint}/Tor Browser.app/Contents/MacOS/Tor/libevent-2.1.7.dylib" ${dstDir}/darwin_amd64/`)
  execSync(`hdiutil detach "${mountPoint}"`)
}

const platformMap = {
  'windows_amd64': {
    'pkgName': 'tor-win64-0.4.6.8.zip',
    'extractor': extractWin
  },
  'darwin_amd64': {
    'pkgName': 'TorBrowser-11.0.1-osx64_en-US.dmg',
    'extractor': extractMac
  }
}


const download = () => {
  ensureDirSync(dstDir)
  let platform
  for (platform of Object.keys(platformMap)) {
    if (platform == 'darwin_amd64' && process.platform !== 'darwin') {
      console.log('Downloading macOS assets is only supported on macOS')
      continue
    }
    const extractor = platformMap[platform]['extractor']
    const pkgName = platformMap[platform]['pkgName']
    const pkgURL = `${baseURL}/${pkgName}`
    const sig = `${pkgName}.asc`
    const sigURL = `${pkgURL}.asc`
    if (existsSync(`${dstDir}/${pkgName}`) === false) {
      console.log(`Downloading ${pkgName}`)
      execSync(`curl -#f -L -o ${dstDir}/${pkgName} ${pkgURL}`)
    }
    if (existsSync(`${dstDir}/${sig}`) === false) {
      console.log(`Downloading ${sig}`)
      execSync(`curl -#f -L -o ${dstDir}/${sig} ${sigURL}`)
    }
    try {
      execSync(`gpg --quiet --verify ${dstDir}/${sig} ${dstDir}/${pkgName}`)
    } catch (e) {
      console.error(`Signature verification failure: ${e}`)
    }
    ensureDirSync(`${dstDir}/${platform}`)
    extractor(pkgName)
  }
}

download()
