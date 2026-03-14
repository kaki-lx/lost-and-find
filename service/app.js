// 导入 express
const express = require('express')
// 创建服务器的实例对象
const app = express()


// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())
// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))
// 配置解析 JSON 格式请求体的中间件
app.use(express.json())


// 一定要在路由之前，封装 res.cc 函数（中间件） ps:优化失败返回代码 -> res.send({ status: 1,message:... })
app.use((req, res, next) => {
    // status 默认值为 1，表示失败的情况
    // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function (err, status = 1) {
        res.send({
            status,
            // 如果 err 是Error构造函数实例的话返回err.message，否则返回err字符串
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

// 一定要在路由之前配置 解析 Token 的中间件
// 导入全局配置文件
const config = require('./config')
// 导入 token 的中间件
const { expressjwt: expressJWT } = require('express-jwt')
// 使用 .unless({ path: [/^/api/] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'], requestProperty: 'user' }).unless({ path: [/^\/api\//] }))


// 导入验证数据的中间件
const joi = require('joi')

// 导入并使用 用户 路由模块---------------------------------------------------------------------------------------------
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入并使用 公共 路由模块---------------------------------------------------------------------------------------------
const publicRouter = require('./router/public')
app.use('/api/public', publicRouter)

// 导入并使用 用户信息 路由模块-----------------------------------------------------------------------------------------
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// 导入并使用 管理员 路由模块-----------------------------------------------------------------------------------------
const adminRouter = require('./router/admin')
app.use('/admin', adminRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc('认证失败！')
    // 身份认证失败后的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知的错误
    res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})