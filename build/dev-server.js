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