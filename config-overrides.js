const { resolve } = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const CompressionPlugin = require('compression-webpack-plugin')

module.exports = function override(config, env) {
  config.resolve.alias['@'] = resolve('src')
  //deploy
  config.devtool = false
  config.optimization.minimizer.push(new UglifyJsPlugin())
  // config.plugins.push(
  //   new CompressionPlugin({
  //     filename: '[path].gz[query]',
  //     algorithm: 'gzip',
  //     test: /\.js$|\.css$|\$/,
  //     threshold: 10240,
  //     minRatio: 0.8,
  //   }),
  // )
  // config.module.rules.push({
  //   test: /\.js$/,
  //   exclude: /node_modules/,
  //   use: {
  //     loader: 'babel-loader',
  //     options: {
  //       babelrc: false,
  //       presets: [['@babel/preset-react', { throwIfNamespace: false }]],
  //       plugins: ['react-html-attrs'],
  //       cacheDirectory: true,
  //     },
  //   },
  // })
  // config.externals = {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // }
  return config
}
