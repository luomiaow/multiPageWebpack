const webpackMerge=require('webpack-merge')
const baseConf=require('./webpack.base.conf')
const path=require('path')
const webpack=require('webpack')
const devConf={
    mode:'development',
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        compress: true,
        port: 8000,
        hotOnly: true, // 模块热更新
        overlay: { // 错误、警告展示设置（页面全屏显示信息，默认关闭）
          errors: true,
          warnings: true
        },
        liveReload: true, // 检测到文件更改时重新加载
        open: true, // 自动打开浏览器
        writeToDisk: true, // 将生成的文件写入磁盘
        watchContentBase: true// 监控编译生成的文件
      },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 启用webpack热模块更新
    ]
}
module.exports = webpackMerge(baseConf,devConf)