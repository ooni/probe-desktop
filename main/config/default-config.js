// Autogenerted code. Do not edit
const fs = require('fs-extra')
const path = require('path')
const { homedir } = require('os')

const oldOoniHomePath = path.join(homedir(), '.ooni')
const oldOoniHomeExists = () => (fs.pathExists(path.join(oldOoniHomePath, 'ooniprobe.conf')))
const backupLegacyHome = async () => {
  const legacyPath = path.join(homedir(),
                               '.ooni-legacy')
  err = await fs.move(oldOoniHomePath, legacyPath)
  if (err) {
    console.error(`Failed to rename ${oldOoniHomePath} to ${legacyPath}`)
    console.error(err)
    await exit(1)
    return
  }
  console.log(`Renamed ${oldOoniHomePath} to ${legacyPath}`)
}

const CONFIG_VERSION = '0.0.1'

const defaultConfig = {
  '_': 'This is your OONI Probe config file. See https://ooni.io/help/ooniprobe-cli for help',
  'auto_update': true,
  'sharing': {
    'include_ip': false,
    'include_asn': true,
    'include_gps': true,
    'upload_results': true,
    'send_crash_reports': true
  },
  'notifications': {
    'enabled': true,
    'notify_on_test_completion': true,
    'notify_on_news': false
  },
  'automated_testing': {
    'enabled': false,
    'enabled_tests': [
      'web-connectivity',
      'facebook-messenger',
      'whatsapp',
      'telegram',
      'dash',
      'ndt',
      'http-invalid-request-line',
      'http-header-field-manipulation'
    ],
    'monthly_allowance': '300MB'
  },
  'test_settings': {
    'websites': {
      'enabled_categories': []
    },
    'instant_messaging': {
      'enabled_tests': [
        'facebook-messenger',
        'whatsapp',
        'telegram'
      ]
    },
    'performance': {
      'enabled_tests': [
        'ndt'
      ],
      'ndt_server': 'auto',
      'ndt_server_port': 'auto',
      'dash_server': 'auto',
      'dash_server_port': 'auto'
    },
    'middlebox': {
      'enabled_tests': [
        'http-invalid-request-line',
        'http-header-field-manipulation'
      ]
    }
  },
  'advanced': {
    'include_country': true,
    'use_domain_fronting': true,
  },
  '_config_version': CONFIG_VERSION,
  '_informed_consent': false
}

module.exports = {
  oldOoniHomePath,
  oldOoniHomeExists,
  backupLegacyHome,
  CONFIG_VERSION,
  defaultConfig
}
