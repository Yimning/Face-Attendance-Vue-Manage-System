/*
 * @Author: your name
 * @Date: 2020-08-29 10:36:14
 * @LastEditTime: 2020-12-26 10:14:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-manage-system\vue.config.js
 */
var  path = require( 'path' )
function isPro() {
    return process.env.NODE_ENV === 'production'
  }
  


module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    //如果不需要定位问题，并且不想被看到源码，就把productionSourceMap 置为false，既可以减少包大小，也可以加密源码。
    // All options for webpack-dev-server are supported
    // https://webpack.js.org/configuration/dev-server/

    ...
    publicPath:isPro() ? '/smartclass/' : '/',

    devServer: {
        // https://github.com/chimurai/http-proxy-middleware#proxycontext-config
        // axios跨域代理配置表，在这里可以配置特定的请求代理到对应的API接口
        port: 8088, //本机启动端口
        host: "localhost", //本机主机名
        https: false, //协议
        open: true, //启动服务器时自动打开浏览器访问
        proxy: {
            // 代理所有的以'/api'开头的浏览器请求
            '/api': {
                // 服务端域名和端口
                // target: 'http://localhost:8082',
                 target: 'https://www.yimning.cn:8082', //未上线可用
                // 如果设置成true：请求头中host会设置成target
                changeOrigin: true,   //开启代理
                // 用'/'替换浏览器请求url中的'/api'，例如浏览器请求为http://localhost:8082/api/xxx,
                // 则对应的服务端接口为http://localhost:8082/xxx
                pathRewrite: {
                    '^/api': ''  //如果需要，可以用'^/api': '/'来代替，但是后台的接口需要注意改变 
                },
            }
        }
    }

    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
}

