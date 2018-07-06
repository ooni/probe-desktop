const withProgressBar = require('next-progressbar')
const withSourceMaps = require('@zeit/next-source-maps')

module.exports = withSourceMaps(withProgressBar({
  webpack: (config) => {
    config.target = 'electron-renderer'

    config.node = {
      __dirname: false,
      __filename: false
    }

    config.externals = config.externals || {}
    config.externals['react'] = 'React'

    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2|otf)$/,
      use: [
        {
          loader: 'url-loader'
        }
      ]
    })
    return config
  },

  exportPathMap: () => {
    // Let Next.js know where to find the entry page
    // when it's exporting the static bundle for the use
    // in the production version of your app
    return {
      '/home': { page: '/home' },
      '/results': { page: '/results' },
      '/settings': { page: '/settings' },
      '/onboard': { page: '/onboard' }
    }
  }
}))
