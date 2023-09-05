// const withSourceMaps = require('@zeit/next-source-maps')
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true'
// })

// module.exports = withBundleAnalyzer(withSourceMaps({
//   webpack: (config, options) => {
//     config.target = 'electron-renderer'

//     config.node = {
//       __dirname: false,
//       __filename: false
//     }

//     config.plugins.push(
//       new options.webpack.DefinePlugin({
//         'process.env.NEXT_IS_SERVER': JSON.stringify(
//           options.isServer.toString()
//         )
//       })
//     )

//     config.module.rules.push({
//       test: /\.(eot|ttf|woff|woff2|otf)$/,
//       use: [
//         {
//           loader: 'url-loader'
//         }
//       ]
//     })
//     // if (!options.isServer) {
//     //   config.resolve.alias['@sentry/node'] = '@sentry/browser'
//     // }
//     return config
//   },
// }))

const nextConfig = {
  output: 'export',
}

module.exports = nextConfig
