// copied from https://stackoverflow.com/a/60208623
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const YOUR_FILE_PATH = './dist/OONI Probe Setup 3.9.7-rc.1.exe'

function hashFile(file, algorithm = 'sha512', encoding = 'base64', options) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm)
    hash.on('error', reject).setEncoding(encoding)
    fs.createReadStream(
      file,
      Object.assign({}, options, {
        highWaterMark: 1024 * 1024,
        /* better to use more memory but hash faster */
      })
    )
      .on('error', reject)
      .on('end', () => {
        hash.end()
        console.log('hash done')
        console.log(hash.read())
        resolve(hash.read())
      })
      .pipe(hash, {
        end: false,
      })
  })
}

const installerPath = path.resolve(__dirname, YOUR_FILE_PATH)

hashFile(installerPath)
