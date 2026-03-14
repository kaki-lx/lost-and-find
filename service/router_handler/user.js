// 导入数据库操作模块
const db = require('../db/index')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局配置文件
const config = require('../config')

// 注册新用户的处理函数
exports.register = (req, res) => {
    // 同时从 query 和 body 中获取参数，确保兼容性
    const userinfo = { ...req.query, ...req.body }
    // 对表单中的数据 进行合法性的校验
    if (!userinfo.username || !userinfo.password || !userinfo.phone || !userinfo.nickname) {
        return res.send({ status: 1, message: '请填写必要信息！' })
    }
    // console.log(userinfo, "#userinfo")

    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr = 'select * from t_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // 判断用户名是否被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message:'用户名被占用，请更换其他用户名！' })
            return res.cc('账号被占用，请更换其他账号！')
        }
        // 定义 SQL 语句，查询联系方式是否被占用
        const sqlStr = 'select * from t_users where phone=?'
        db.query(sqlStr, userinfo.phone, (err, results) => {
            // 执行 SQL 语句失败
            if (err) {
                // return res.send({ status: 1, message: err.message })
                return res.cc(err)
            }
            // 判断联系方式是否被占用
            if (results.length >= 1) {
                // return res.send({ status: 1, message:'用户名被占用，请更换其他用户名！' })
                return res.cc('该联系方式已注册，请直接登陆！', 0)
            }

            // 准备插入数据，移除可能导致问题的createDate字段
            const userData = { ...userinfo }
            // 让MySQL自动处理createDate，或者使用正确的日期格式
            if (userData.createDate) {
                // 转换为MySQL datetime格式：YYYY-MM-DD HH:MM:SS
                const date = new Date(userData.createDate)
                userData.createDate = date.toISOString().slice(0, 19).replace('T', ' ')
            }

            // 注册用户
            const addUserSql = 'insert into t_users set ?'
            db.query(addUserSql, userData, (err, results) => {
                // 判断 SQL 语句是否执行成功
                if (err) {
                    console.error('插入用户失败:', err)
                    return res.cc(err)
                }
                // 判断影响行数是否为1
                if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
                // 注册用户成功
                // res.send({ status: 0, message: '注册用户成功！' })
                res.cc('用户注册成功！', 0)
            })
        })
        return;
    })
    return;
    // res.send('register OK')
}

// 登陆的处理函数
exports.login = (req, res) => {
    // 同时从 query 和 body 中获取参数，确保兼容性
    const userinfo = { ...req.query, ...req.body }
    // 添加调试信息
    console.log('登录请求参数:', req.query, req.body)
    console.log('合并后的参数:', userinfo)
    // 对表单中的数据 进行合法性的校验
    if (!userinfo.username || !userinfo.password) {
        return res.send({ status: 1, message: '用户名或密码不能为空！' })
    }
    // 
    const sqlStr = 'select * from t_users where username=?'
    db.query(sqlStr, userinfo.username, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 判断用户名是否存在
        if (results.length !== 1) return res.cc('用户不存在！')
        // 判断用户密码是否正确
        if (userinfo.password !== results[0].password) return res.cc('密码错误！')
        // 登陆成功的操作
        const user = { ...results[0], password: '' }
        // console.log(user, '#user')
        // 对用户信息进行加密，生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        // 调用 res.send() 将Token 响应给客户端
        res.send({
            status: 0,
            message: '登陆成功!',
            token: 'Bearer ' + tokenStr,
        })
        // return res.cc('登陆成功！', 0)
    })
    // res.send('login OK')
    return;
}

