const { merge } = require('webpack-merge') //可用于数组连接和对象合并
const prodEnv = require('./prod.env')

module.exports = function() {
    return merge(prodEnv, {
        NODE_ENV: '"development"'
    })
}