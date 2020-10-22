require('dotenv').config()
const pkg = require('../package.json')
const { notarize } = require('electron-notarize')

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return
  }

  const appName = context.packager.appInfo.productFilename
  const appBundleId = pkg.build.appId
  if (appBundleId.length < 3) {
    throw Error(`Invalid build.appId: ${appBundleId}`)
  }

  console.log(`Notarizing the app "${appBundleId}"`)
  return await notarize({
    appBundleId: appBundleId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.OONI_APPLEID,
    appleIdPassword: process.env.OONI_APPLEIDPASS,
    ascProvider: process.env.OONI_TEAMID,
  })
}
