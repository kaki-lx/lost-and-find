// 导入 mysql2 模块
const mysql = require('mysql2')

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '2805565248',
    port: "3306",
    database: 'lost',//库名
    timezone: 'Asia/Chongqing'//时区信息
})

// 向外共享 db 数据库连接对象
module.exports = db