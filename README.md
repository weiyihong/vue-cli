# Vue-cli 脚手架搭建
---
[TOC]

---
## 新建一个目录(vue-demo)
### 生成`package.json`
```
npm init -y
```
### 安装依赖包
```
npm install vue webpack webpack-dev-server vue-loader vue-html-loader css-loader vue-style-loader vue-hot-reload-api babel-loader babel-core babel-plugin-transform-runtime babel-preset-es2015 babel-runtime@5 html-webpack-plugin vue-template-compiler --save-dev
```
### 在根目录下新建文件`index.html`
```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>vue-cli</title>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
```
### 在根目录下新建文件夹`src`
* 在`src`文件夹中新建文件`App.vue`
```
<template>
    <div class="demo">
        <div>欢迎！！</div>
    </div>
</template>

<script>
export default {
    name: 'app',
    data () {
        return {

        }
    },
    components: {

    },
    mounted () {

    },
    methods: {

    },
    computed: {

    }
}
</script>

<style lang="css">

</style>
```
* 在`src`文件夹中新建文件`main.js`
```javascript
import Vue from 'vue'
import App from './App'

new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})
```
* 也可以在`src`文件夹中新建文件`components`
## 配置webpack
### 在根目录下新建一个文件夹`build`
### 在`build`文件夹下新建文件`webpack.base.conf.js`
```
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
```
### 编译文件
```
webpack --config .\build\webpack.base.conf.js
```
即在`dist`目录下生成静态文件。
## 实时编译文件
### 安装中间件
```
npm install webpack-dev-middleware --save-dev
npm install express --save-dev
```
### 在`build`下创建文件`dev-server.js`
```
// 引入一些依赖模块
const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.base.conf')
const port = 8888

// 创建一个express的实例
const app = express()

const compiler = webpack(config)

const devMiddleware = require('webpack-dev-middleware')(compiler,{
    pulicPath:config.output.publicPath,
    stats:{
        color: true,
        chunks: false
    }
})

app.use(devMiddleware)

app.listen(port,function(err){
    if(err){
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port)
})
```
### 编译实时执行命令
```
node .\build\dev-server.js
```
### 修改文件
发现无法正确访问，此时需要对`webpack.base.conf.js`的部分位置进行修改，为不影响元文件，在`build`目录下新建文件`webpack.dev.conf`
```
const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')

const conf = require('./webpack.base.conf')

conf.output.publicPath = './'

conf.plugins = [
    new HtmlWebpackPlugin({
        filename: './index.html',
        template: path.resolve(__dirname,'../index.html'),
        inject: true
    })
]

module.exports = conf
```
同时修改文件`dev-server.js`
```
// 引入一些依赖模块
const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.dev.conf') //修改引入文件为更改后的文件
const port = 8888

// 创建一个express的实例
const app = express()

const compiler = webpack(config)

const devMiddleware = require('webpack-dev-middleware')(compiler,{
    pulicPath:config.output.publicPath,
    stats:{
        color: true,
        chunks: false
    }
})

app.use(devMiddleware)

app.listen(port,function(err){
    if(err){
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port)
})
```
### 再次编译实时执行命令
```
node .\build\dev-server.js
```
在浏览器访问
```
http://localhost:8888/
```
即可正常访问。
## 热加载，自动刷新浏览器
### 添加插件[地址](https://github.com/webpack-contrib/webpack-hot-middleware)
```
npm install webpack-hot-middleware --save-dev
```
### 修改文件`webpack.dev.conf.js`
```
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

const devClient = 'webpack-hot-middleware/client'

Object.keys(conf.entry).forEach(function(name,i){
    const extras = [devClient]
    conf.entry[name] = extras.concat(conf.entry[name])
})

module.exports = conf
```
### 修改文件`dev-server.js`
```
// 引入一些依赖模块
const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.dev.conf')
const port = 8888

// 创建一个express的实例
const app = express()

const compiler = webpack(config)

const devMiddleware = require('webpack-dev-middleware')(compiler,{
    pulicPath:config.output.publicPath,
    stats:{
        color: true,
        chunks: false
    }
})
//修改
const hotMiddleware = require('webpack-hot-middleware')(compiler)

app.use(devMiddleware)
//修改
app.use(hotMiddleware)

app.listen(port,function(err){
    if(err){
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port)
})
```
### 编译实时执行命令
```
node .\build\dev-server.js
```
### 在浏览器访问
```
http://localhost:8888/
```
## 监听HTML文件变化
### 修改文件`dev-server.js`
```
// 引入一些依赖模块
const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.dev.conf')
const port = 8888

// 创建一个express的实例
const app = express()

const compiler = webpack(config)

const devMiddleware = require('webpack-dev-middleware')(compiler,{
    pulicPath:config.output.publicPath,
    stats:{
        color: true,
        chunks: false
    }
})

const hotMiddleware = require('webpack-hot-middleware')(compiler)

//添加部分
compiler.plugin('compilation',function(compilation){
    compilation.plugin('html-webpack-plugin-after-emit',function(data,cb){
        hotMiddleware.publish({action:'reload'})
        ab()
    })
})
//添加部分

app.use(devMiddleware)
app.use(hotMiddleware)

app.listen(port,function(err){
    if(err){
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port)
})
```
### 在`build`目录下新建文件`dev-client.js`
```
const hotClient = require('webpack-hot-middleware/client')

hotClient.subscribe(function(event){
    if(event.action === 'reload'){
        window.location.reload(true)
    }
})
```
### 修改文件`webpack.dev.conf.js`
```

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
```
### 编译实时执行命令
```
node .\build\dev-server.js
```
### 在浏览器访问
```
http://localhost:8888/
```