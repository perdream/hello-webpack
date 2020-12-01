//导出环境变量配置
module.exports = {
    getBuildEnv: require('./prod.env'),
    getDevelopEnv: require('./dev.env')
}