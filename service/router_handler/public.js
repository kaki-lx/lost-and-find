// 导入数据库操作模块
const db = require('../db/index')
// 导入图片验证码组件
const svgCaptcha = require('svg-captcha')

// 1.获取招领列表的处理函数
exports.getClaim = (req, res) => {
    // 定义查询用户信息的 SQL 语句
    const sql = 'select * from t_claim where isFound=1 order by date desc'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, req.query, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length === 0) return res.cc('获取招领列表数据失败！')
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取招领列表数据成功！',
            data: results,
        })
    })
}

// 2.获取寻物列表的处理函数
exports.getRevert = (req, res) => {
    // 定义查询用户信息的 SQL 语句
    const sql = 'select * from t_revert where isFound=1 order by date desc'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, req.query, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length === 0) return res.cc('获取寻物列表数据失败！')
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取寻物列表数据成功！',
            data: results,
        })
    })
}

// 3.获取已认领信息的路由
exports.getFoundClaim = (req, res) => {
    const sql = ' select * from t_claim where isFound=0 order by date desc '
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取已认领信息列表成功！',
            data: results
        })
    })
}

// 4.获取已归还信息的路由
exports.getFoundRevert = (req, res) => {
    const sql = ' select * from t_revert where isFound=0 order by date desc '
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取已归还信息列表成功！',
            data: results
        })
    })
}

// 5.获取 近三天 待招领 招领列表的路由
exports.getThreeClaim = (req, res) => {
    const sql = ' SELECT * FROM t_claim where date > DATE_SUB(now(),INTERVAL 3 DAY) and isFound=1 '
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取近三天招领列表成功！',
            data: results
        })
    })
}

// 6.获取 近三天 待归还 寻物列表的路由
exports.getThreeRevert = (req, res) => {
    const sql = ' SELECT * FROM t_revert where date > DATE_SUB(now(),INTERVAL 3 DAY) and isFound=1 '
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取近三天寻物列表成功！',
            data: results
        })
    })
}


// 7.获取留言板评论列表的路由
exports.getCommentsList = (req, res) => {
    const sql = ' select * from t_comments where level=1 order by date desc '
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取留言板评论列表成功！',
            data: results
        })
    })
}

// 8.获取留言板回复列表的路由
exports.getReplyList = (req, res) => {
    const sql = ' select * from t_comments where level=2 and higherLevelId=? '
    db.query(sql, req.query.higherLevelId, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取留言板回复列表成功！',
            data: results
        })
    })
}

// 9.留言板点赞+1的路由
exports.support = (req, res) => {
    const sql = ' update t_comments set support=support+1 where id=? '
    db.query(sql, req.query.id, (err/*, results*/) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '点赞成功！'
        })
    })
}

// 10.留言板回复+1的路由
exports.reply = (req, res) => {
    const sql = ' update t_comments set ? where id=? '
    db.query(sql, [req.query, req.query.id], (err/*, results*/) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '成功！'
        })
    })
}

// 11.获取保管员信息列表
exports.getManagerList = (req, res) => {
    const sql = ' select * from t_users where identity=1 or identity=0 '
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取保管员信息列表成功！',
            data: results
        })
    })
}

// 12.获取用户密保问题
exports.getPswProtect = (req, res) => {
    const sql = ' select question_1, question_2, question_3 from t_protect where username=? '
    db.query(sql, req.query.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('该用户没有设置密保问题！')
        res.send({
            status: 0,
            data: results
        })
    })
}

// 13.验证用户密保问题
exports.verifyPswProtect = (req, res) => {
    const sql = ' select answer_1, answer_2, answer_3 from t_protect where username=? '
    db.query(sql, req.query.username, (err, results) => {
        if (err) return res.cc(err)
        if (req.query.answer_1 === results[0].answer_1 && req.query.answer_2 === results[0].answer_2 && req.query.answer_3 === results[0].answer_3) {
            res.send({ status: 0 })
        } else {
            res.send({
                status: 1,
                message: '回答错误！'
            })
        }
    })
}

// 14.修改用户密码
exports.updatePassword = (req, res) => {
    const sql = ' update t_users set password=? where username=? '
    db.query(sql, [req.query.password, req.query.username], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('修改失败！')
        res.send({
            status: 0,
            message: '修改成功！'
        })
    })
}

// 15.图片验证码
exports.checkCode = (req, res) => {
    const img = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1l',
        color: true,
        noise: 1,
        background: '#666',
        height: 40,
        width: 100
    })
    // console.log(img.text);
    res.send({
        status: 0,
        data: img
    })
}

// 16.提交举报
exports.report = (req, res) => {
    const sql = 'INSERT INTO t_report (report_type, target_id, reporter_id, reporter_nickname, reason, create_date) VALUES (?, ?, ?, ?, ?, ?)'
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    db.query(sql, [req.body.report_type, req.body.target_id, req.body.reporter_id, req.body.reporter_nickname, req.body.reason, now], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('举报失败！')
        res.send({
            status: 0,
            message: '举报成功，管理员将尽快处理！'
        })
    })
}