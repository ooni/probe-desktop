/* global require, module */
//const withProgressBar = require('next-progressbar')
const withSourceMaps = require('@zeit/next-source-maps')

module.exports = withSourceMaps({
  webpack: (config, options) => {
    config.target = 'electron-renderer'

    config.node = {
      __dirname: false,
      __filename: false
    }

    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2|otf)$/,
      use: [
        {
          loader: 'url-loader'
        }
      ]
    })
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }
    return config
  },

  exportPathMap: () => {
    // Let Next.js know where to find the entry page
    // when it's exporting the static bundle for the use
    // in the production version of your app
    return {
      '/about': { page: '/about' },
      '/home': { page: '/home' },
      '/test-results': { page: '/test-results' },
      '/result': { page: '/result' },
      '/measurement': { page: '/measurement' },
      '/settings': { page: '/settings' },
      '/onboard': { page: '/onboard' }
    }
  }
})
