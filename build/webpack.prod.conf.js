const webpackMerge = require('webpack-merge')
const baseConf = require('./webpack.base.conf')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 清理dist文件夹
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const prodConf = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  optimization: {
    minimize: true,
    splitChunks: {// 配置提取公共代码
      chunks: 'all',
      minSize: 30000, // 配置提取块的最小大小（即不同页面之间公用代码的大小）
      minChunks: 3, // 最小共享块数，即公共代码最少的重复次数一般设为3
      automaticNameDelimiter: '.', // 生成的名称指定要使用的分隔符
      cacheGroups: {// 设置缓存组
        vendors: {
          name: 'vendors',
          test (module) {
            let path = module.resource
            return /[\\/]node_modules[\\/]/.test(path) || /[\\/]lib[\\/]/.test(path)
          },
          priority: 30
        },
        commons: {
          name: 'commons',
          test: /\.js$/,
          enforce: true,
          priority: 20
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'source/css/[name].[hash].css' // 文件
    })
  ]
}


module.exports = webpackMerge(baseConf, prodConf)