// 导入数据库操作模块
const db = require('../db/index')

// ----------------------------------------------------------------通  用----------------------------------------------------------

// 1 登陆后台 添加历史数据
exports.addHistory = (req, res) => {
    const sql = 'insert into t_adminHistory set ?'
    db.query(sql, req.query, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('添加历史数据失败！')
        res.cc('添加历史数据成功！', 0)
    })
}

// ----------------------------------------------------------------首  页----------------------------------------------------------


// 1.1 获取用户录入数据（按月）
exports.getUserCount = (req, res) => {
    const sql = `select
                sum(case month(createDate) when '1' then 1 else 0 end) as 一月份,
                sum(case month(createDate) when '2' then 1 else 0 end) as 二月份,
                sum(case month(createDate) when '3' then 1 else 0 end) as 三月份,
                sum(case month(createDate) when '4' then 1 else 0 end) as 四月份,
                sum(case month(createDate) when '5' then 1 else 0 end) as 五月份,
                sum(case month(createDate) when '6' then 1 else 0 end) as 六月份
                from t_users`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results[0]
        })
    })
}
// 1.2 获取失物招领录入数据（按月）
exports.getClaimCount = (req, res) => {
    const sql = `select
                sum(case month(createDate) when '1' then 1 else 0 end) as 一月份,
                sum(case month(createDate) when '2' then 1 else 0 end) as 二月份,
                sum(case month(createDate) when '3' then 1 else 0 end) as 三月份,
                sum(case month(createDate) when '4' then 1 else 0 end) as 四月份,
                sum(case month(createDate) when '5' then 1 else 0 end) as 五月份,
                sum(case month(createDate) when '6' then 1 else 0 end) as 六月份
                from t_claim`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results[0]
        })
    })
}
// 1.3 获取寻物启事录入数据（按月）
exports.getRevertCount = (req, res) => {
    const sql = `select
                sum(case month(createDate) when '1' then 1 else 0 end) as 一月份,
                sum(case month(createDate) when '2' then 1 else 0 end) as 二月份,
                sum(case month(createDate) when '3' then 1 else 0 end) as 三月份,
                sum(case month(createDate) when '4' then 1 else 0 end) as 四月份,
                sum(case month(createDate) when '5' then 1 else 0 end) as 五月份,
                sum(case month(createDate) when '6' then 1 else 0 end) as 六月份
                from t_revert`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results[0]
        })
    })
}
// 1.4 获取留言录入数据（按月）
exports.getCommentsCount = (req, res) => {
    const sql = `select
                sum(case month(date) when '1' then 1 else 0 end) as 一月份,
                sum(case month(date) when '2' then 1 else 0 end) as 二月份,
                sum(case month(date) when '3' then 1 else 0 end) as 三月份,
                sum(case month(date) when '4' then 1 else 0 end) as 四月份,
                sum(case month(date) when '5' then 1 else 0 end) as 五月份,
                sum(case month(date) when '6' then 1 else 0 end) as 六月份
                from t_comments`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results[0]
        })
    })
}

// 1.5 获取失物招领信息状态构成
exports.getClaimStatus = (req, res) => {
    const sql = `select
                sum(case isFound when '0' then 1 else 0 end) as 已认领,
                sum(case isFound when '1' then 1 else 0 end) as 待认领,
                sum(case isFound when '2' then 1 else 0 end) as 处理中
                from t_claim`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results[0]
        })
    })
}

// 1.6 获取寻物启事信息状态构成
exports.getRevertStatus = (req, res) => {
    const sql = `select
                sum(case isFound when '0' then 1 else 0 end) as 已认领,
                sum(case isFound when '1' then 1 else 0 end) as 待认领,
                sum(case isFound when '2' then 1 else 0 end) as 处理中
                from t_revert`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results[0]
        })
    })
}

// 1.7 获取失物招领 近一个月 完成 的列表
exports.getClaimNearMonth = (req, res) => {
    const sql = 'select * from t_claim where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= finishDate'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 1.8 获取寻物启事 近一个月 完成 的列表
exports.getRevertNearMonth = (req, res) => {
    const sql = 'select * from t_revert where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= finishDate'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 1.9 获取最新注册的用户列表
exports.getNewUserList = (req, res) => {
    const sql = 'select * from t_users where identity=2 order by createDate desc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 1.10 获取登录历史记录
exports.getLoginHistory = (req, res) => {
    const sql = `select id,max(loginDate) as loginDate,max(logoutDate) as logoutDate,userId,user_pic,nickname,identity 
                from t_adminHistory
                group by userId
                order by loginDate desc`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取数据成功！',
            data: results
        })
    })
}

// ---------------------------------------------------------------人员  管理------------------------------------------------------

// 1.1 获取普通用户列表的处理函数
exports.getUserList = (req, res) => {
    const sql = 'select * from t_users where identity=2'
    db.query(sql, req.query, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取用户列表数据成功！',
            data: results,
        })
    })
}
// 1.2 删除用户的处理函数
exports.deleteUser = (req, res) => {
    const sql = 'delete from t_users where id=?'
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('删除失败！')
        res.send({
            status: 0,
            message: '删除成功！'
        })
    })
}

// 1.3 升级为保管员的处理函数
exports.setIdentity = (req, res) => {
    const sql = 'update t_users set ? where id=?'
    db.query(sql, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.send({
            status: 0,
            message: '修改成功！'
        })
    })
}

// 1.4 获取保管员列表的处理函数
exports.getManagerList = (req, res) => {
    const sql = 'select * from t_users where identity=1'
    db.query(sql, req.query, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取保管员列表数据成功！',
            data: results,
        })
    })
}

// 1.5 关键词查找用户信息的处理函数
exports.getKeywordUserList = (req, res) => {
    const keyword = `'%` + req.query.keyword + `%'`
    const sql = 'select * from t_users where identity=2 and ( username like' + keyword + 'or `nickname` like' + keyword + ')'
    db.query(sql, req.query, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取用户列表数据成功！',
            data: results,
        })
    })
}

// 1.6 关键词查找保管员信息的处理函数
exports.getKeywordManagerList = (req, res) => {
    const keyword = `'%` + req.query.keyword + `%'`
    const sql = 'select * from t_users where identity=1 and ( username like' + keyword + 'or `nickname` like' + keyword + ')'
    db.query(sql, req.query, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取保管员列表数据成功！',
            data: results,
        })
    })
}

// 1.7 编辑用户信息的处理函数
exports.updateUserInfo = (req, res) => {
    // 检查手机号是否变更
    const sql = ' select phone from t_users where id=?'
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        // 调用results中的phone的值 需要 results[0].phone
        console.log(results[0].phone != req.query.phone, '对比结果')
        // 如果是输入的新的手机号 -> 检测是否被占用 -> 被占用 返回
        //                                       -> 未被占用 修改
        if (results[0].phone !== req.query.phone) {
            // 检查 phone 是否被占用
            const sql = 'select * from t_users where phone=?'
            db.query(sql, req.query.phone, (err, results) => {
                // 执行 SQL 语句失败
                if (err) return res.cc(err)
                // 返回结果大于等于 1，则表示手机号已被占用
                if (results.length >= 1) return res.cc('该手机号已被使用！')
                // 更新用户信息
                const sql = 'update t_users set ? where id=?'
                db.query(sql, [req.query, req.query.id], (err, results) => {
                    // 执行 SQL 语句失败
                    if (err) return res.cc(err)
                    // 执行 SQL 语句成功，但是受影响结果不是1
                    if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
                    return res.cc('修改用户信息成功！', 0)
                })
            })
        } else {
            // 更新用户信息
            const sql = 'update t_users set ? where id=?'
            db.query(sql, [req.query, req.query.id], (err, results) => {
                // 执行 SQL 语句失败
                if (err) return res.cc(err)
                // 执行 SQL 语句成功，但是受影响结果不是1
                if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
                return res.cc('修改用户信息成功！', 0)
            })
        }
    })
}

// 1.8 修改用户头像的处理函数
exports.updateAvatar = (req, res) => {
    const sqlStr = ' update t_users set ? where id= ? '
    db.query(sqlStr, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新用户头像信息失败！')
        return res.cc('更新用户头像信息成功！', 0)
    })
}

// ---------------------------------------------------------------权限  管理------------------------------------------------------

// 2.1 修改权限的路由
exports.editUserLOA = (req, res) => {
    const sql = 'update t_users set ? where id=?'
    db.query(sql, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.send({
            status: 0,
            message: '修改成功！'
        })
    })
}

// ---------------------------------------------------------------数据  管理------------------------------------------------------

// 3.1 获取所有招领信息列表的处理函数
exports.getClaimList = (req, res) => {
    const sql = 'select * from t_claim order by createDate desc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 3.2 获取所有寻物信息列表的处理函数
exports.getRevertList = (req, res) => {
    const sql = 'select * from t_revert order by createDate desc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 3.3 关键词查找招领信息的路由
exports.getKeywordClaimList = (req, res) => {
    const keyword = '%' + req.query.keyword + '%'
    const sql = 'select * from t_claim where resume like ? or `describe` like ?'
    db.query(sql, [keyword, keyword], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 3.4 关键词查找寻物信息的路由
exports.getKeywordRevertList = (req, res) => {
    const keyword = '%' + req.query.keyword + '%'
    const sql = 'select * from t_revert where resume like ? or `describe` like ?'
    db.query(sql, [keyword, keyword], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 3.5 修改招领信息的处理函数
exports.editClaim = (req, res) => {
    const sql = 'update t_claim set ? where id=?'
    db.query(sql, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}

// 3.6 状态修改 待认领 -> 处理中
exports.statusClaimToProcessing = (req, res) => {
    const sql = 'select * from t_users where id=? or username=?'
    db.query(sql, [req.query.input, req.query.input], (err, results) => {
        if (err) return res.cc(err)
        if (results.length != 1) return res.cc('该用户不存在！')
        const sql = `update t_claim set claimDate = ?, 
                        handlerId = ?, 
                        handlerNickname = ?, 
                        handlerPhone = ?, 
                        handlerWechat = ?, 
                        handlerQQ = ?, 
                        isFound = 2 
                        where id=?`
        db.query(sql, [req.query.date, results[0].id, results[0].nickname, results[0].phone, results[0].wechat, results[0].qq, req.query.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows != 1) return res.cc('修改失败！')
            res.cc('修改成功！', 0)
        })
    })
}

// 3.7 状态修改 处理中 -> 待认领
exports.statusProcessingToClaim = (req, res) => {
    const sql = 'update t_claim set claimDate = null, handlerId = null, handlerNickname = null, handlerPhone = null, handlerWechat = null, handlerQQ = null, isFound = 1 where id=?'
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}

// 3.8 状态修改 处理中 -> 已认领
exports.statusProcessingToClaimed = (req, res) => {
    const sql = 'update t_claim set finishDate=?, isFound = 0 where id=?'
    db.query(sql, [req.query.date, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}

// 3.9 状态修改 已认领 -> 待认领
exports.statusClaimedToClaim = (req, res) => {
    const sql = `update t_claim set claimDate = null, finishDate = null, handlerId = null, handlerNickname = null, handlerPhone = null, handlerWechat = null,
                handlerQQ = null, isFound = 1 where id=?`
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}

// 3.10 状态修改 已认领 -> 处理中
exports.statusClaimedToProcessing = (req, res) => {
    const sql = `update t_claim set finishDate = null, isFound = 2 where id=?`
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}


// 3.11 修改寻物信息的处理函数
exports.editRevert = (req, res) => {
    const sql = 'update t_revert set ? where id=?'
    db.query(sql, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}

// 3.12 状态修改 待归还 -> 处理中
exports.statusRevertToProcessing = (req, res) => {
    const sql = 'select * from t_users where id=? or username=?'
    db.query(sql, [req.query.input, req.query.input], (err, results) => {
        if (err) return res.cc(err)
        if (results.length != 1) return res.cc('该用户不存在！')
        const sql = `update t_revert set revertDate = ?, 
                        handlerId = ?, 
                        handlerNickname = ?, 
                        handlerPhone = ?, 
                        handlerWechat = ?, 
                        handlerQQ = ?, 
                        isFound = 2 
                        where id=?`
        db.query(sql, [req.query.date, results[0].id, results[0].nickname, results[0].phone, results[0].wechat, results[0].qq, req.query.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows != 1) return res.cc('修改失败！')
            res.cc('修改成功！', 0)
        })
    })
}

// 3.13 状态修改 处理中 -> 待归还
exports.statusProcessingToRevert = (req, res) => {
    const sql = 'update t_revert set revertDate = null, handlerId = null, handlerNickname = null, handlerPhone = null, handlerWechat = null, handlerQQ = null, isFound = 1 where id=?'
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}
// 3.14 状态修改 处理中 -> 已归还
exports.statusProcessingToReverted = (req, res) => {
    const sql = 'update t_revert set finishDate=?, isFound = 0 where id=?'
    db.query(sql, [req.query.date, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}

// 3.15 状态修改 已归还 -> 待归还
exports.statusRevertedToRevert = (req, res) => {
    const sql = `update t_revert set revertDate = null, finishDate = null, handlerId = null, handlerNickname = null, handlerPhone = null, handlerWechat = null,
                handlerQQ = null, isFound = 1 where id=?`
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}

// 3.16 状态修改 已归还 -> 处理中
exports.statusRevertedToProcessing = (req, res) => {
    const sql = `update t_revert set finishDate = null, isFound = 2 where id=?`
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}

// ---------------------------------------------------------------留言  管理------------------------------------------------------
// 4.1 关键词查找留言的处理函数
exports.getKeywordCommentList = (req, res) => {
    const keyword = `'%` + req.query.keyword + `%'`
    const sql = ' select * from t_comments where level=1 and comments like' + keyword + 'order by date desc '
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '查找留言成功！',
            data: results
        })
    })
}
// 4.2 关键词查找回复的处理函数
exports.getKeywordReplyList = (req, res) => {
    const keyword = `'%` + req.query.keyword + `%'`
    const sql = ' select * from t_comments where level=2 and higherLevelId=? and comments like ' + keyword
    db.query(sql, req.query.higherLevelId, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '查找回复成功！',
            data: results
        })
    })
}




// 5.1 获取登录历史记录
exports.getHistoryList = (req, res) => {
    const sql = 'select * from t_adminHistory order by loginDate desc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 5.2 修改备注
exports.updatePS = (req, res) => {
    const sql = 'update t_adminHistory set ps=? where id=?'
    db.query(sql, [req.query.ps, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.send({
            status: 0,
            message: '修改成功！'
        })
    })
}

// 5.3 删除一条历史记录
exports.deleteHistory = (req, res) => {
    const sql = 'delete from t_adminHistory where id=?'
    db.query(sql, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('删除失败！')
        res.send({
            status: 0,
            message: '删除成功！'
        })
    })
}

// ------------------------------------------------------------------申请处理------------------------------------------------------

// 6.1 获取失物招领 认领申请列表
exports.getClaimVerifyList = (req, res) => {
    const sql = 'select * from t_claim where isFound=3 order by claimDate asc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 6.2 失物招领申请 不符
exports.failClaim = (req, res) => {
    const sql = 'update t_claim set isFound=1, handlerDescribe=null, handlerId=null, handlerNickname=null, handlerPhone=null, handlerWechat=null, handlerQQ=null, ? where id=?'
    db.query(sql, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}

// 6.3 获取寻物启事 归还申请列表
exports.getRevertVerifyList = (req, res) => {
    const sql = 'select * from t_revert where isFound=3 order by revertDate asc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 6.4 寻物启事申请 不符
exports.failRevert = (req, res) => {
    const sql = 'update t_revert set isFound=1, handlerDescribe=null, handlerId=null, handlerNickname=null, handlerPhone=null, handlerWechat=null, handlerQQ=null, ? where id=?'
    db.query(sql, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows != 1) return res.cc('修改失败！')
        res.cc('修改成功！', 0)
    })
}

// 6.5 添加审核结果
exports.addResults = (req, res) => {
    const sql = 'insert into t_results set ?'
    db.query(sql, req.query, (err) => {
        if (err) return res.cc(err)
        res.cc('添加成功！', 0)
    })
}

// 6.6 获取举报列表
exports.getReportList = (req, res) => {
    const sql = 'select * from t_report order by create_date desc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            data: results
        })
    })
}

// 6.7 处理举报
exports.handleReport = (req, res) => {
    const sql = 'update t_report set status = ?, handle_date = ?, handler_id = ?, handler_nickname = ? where id = ?'
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    db.query(sql, [req.body.status, now, req.body.handler_id, req.body.handler_nickname, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('处理失败！')
        res.send({
            status: 0,
            message: '处理成功！'
        })
    })
}