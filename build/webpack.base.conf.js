'use strict';

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: [
            path.resolve(__dirname,'../src/main.js')
        ]
    },
    output: {
        path: path.resolve(__dirname,'../dist/static'),
        filename: '[name].[hash:8].js',
        publicPath: './static'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions:['.js','.vue'],
        alias:{
            'vue$':'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename:'../index.html',
            template:path.resolve(__dirname,'../index.html')
        })
    ]
}