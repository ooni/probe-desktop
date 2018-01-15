module.exports = {
  webpack(config) {
    config.target = 'electron-renderer'
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
  exportPathMap() {
    // Let Next.js know where to find the entry page
    // when it's exporting the static bundle for the use
    // in the production version of your app
    return {
      '/dashboard': { page: '/dashboard' },
      '/results': { page: '/results' },
      '/settings': { page: '/settings' },
      '/onboard': { page: '/onboard' }
    }
  }
}
