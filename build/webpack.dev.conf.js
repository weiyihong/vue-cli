const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')

const webpack = require('webpack')

const conf = require('./webpack.base.conf')

conf.output.publicPath = './'

conf.plugins = [
    //添加三个插件
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
        filename: './index.html',
        template: path.resolve(__dirname,'../index.html'),
        inject: true
    })
]

// 修改部分
// const devClient = 'webpack-hot-middleware/client'
const devClient = './build/dev-client'

Object.keys(conf.entry).forEach(function(name,i){
    const extras = [devClient]
    conf.entry[name] = extras.concat(conf.entry[name])
})

module.exports = conf