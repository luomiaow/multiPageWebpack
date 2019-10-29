const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Entries = {} //存放入口文件
const HtmlPlugins = []; //存放HtmlWebpackPlugin的实例

(function () {
    let pagePath = path.join(__dirname, '../src/pages')// 定义存放html页面的文件夹路径
    let paths = fs.readdirSync(pagePath) // 获取pagePath路径下的所有文件
    paths.forEach(item => {
        let pageName = item.split('.')[0]
        Entries[pageName] = path.resolve(__dirname, `../src/js/${pageName}.js`)
        HtmlPlugins.push(
            new HtmlWebpackPlugin({
                minify: { // 压缩HTML文件
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: true, // 删除空白符与换行符
                    minifyCSS: true// 压缩内联css
                },
                chunks: [pageName, 'commons', 'vendors', 'manifest'],//指定html引入的js文件
                filename: `${pageName}.html`,
                template: path.resolve(__dirname, `../src/pages/${pageName}.html`)
            })
        )
    })
})()

module.exports = {
    entry: Entries,
    output: {
        filename: 'source/js/[name].bundle.[hash].js',
        path: path.resolve(__dirname, '../dist'), // 输出目录，所有文件的输出路径都基于此路径
    },
    resolve: {
        extensions: ['.js'] // 配置过后，书写该类文件路径的时候可以省略文件后缀
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    process.env.NODE_ENV == 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV == 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    "presets": [["@babel/preset-env", {
                        useBuiltIns: 'usage',
                        "corejs": "2", // 声明corejs版本
                    }]]
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 40960,
                            fallback: { //当文件大小大于limit时使用的loader
                                loader: 'file-loader',
                                options: {
                                    "name": 'source/images/[name].[ext]'
                                }
                            }
                        }
                    }
                ],

            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            fallback: { //当文件大小大于limit时使用的loader
                                loader: 'file-loader',
                                options: {
                                    "name": 'source/video/[name].[ext]'
                                }
                            }
                        }
                    }
                ],

            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'source/fonts/[name].[ext]'
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        ...HtmlPlugins,
        new webpack.ProvidePlugin({ //全局引入jq
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        })
    ]
}