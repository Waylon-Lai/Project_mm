// vue.config.js
module.exports = {
    // 选项...
    lintOnSave: false,//不使用eslint
    publicPath: './' // 更改访问打包资源的路径，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径
};


