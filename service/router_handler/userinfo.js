// 导入数据库操作模块
const db = require('../db/index')
// 导入   （更换头像用）
const multiparty = require('multiparty')

const fs = require('fs')

// --------------------------------------------------------------userInfo---------------------------------------------------------
// 1.1 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 定义查询用户信息的 SQL 语句 （根据用户的id，查询用户的基本信息）
    const sql = 'select * from t_users where id=?'
    // 调用 db.query() 执行 SQL 语句
    // 在新版本的express-jwt中，用户信息可能存储在req.auth中而不是req.user中
    const userId = req.user?.id || req.auth?.id;
    if (!userId) {
        return res.cc('获取用户ID失败！')
    }
    db.query(sql, userId, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length !== 1) return res.cc('获取用户基本信息失败！')
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0],
        })
    })
}

// 1.2 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    // 检查 phone 是否被占用
    const sql = 'select * from t_users where phone=? and id!=?'
    db.query(sql, [req.query.phone, req.user?.id || req.auth?.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 返回结果大于等于 1，则表示手机号已被占用
        if (results.length >= 1) return res.cc('该手机号已被使用！')
        // 更新用户信息
        const sql = 'update t_users set ? where id=?'
        db.query(sql, [req.query, req.user?.id || req.auth?.id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)
            // 执行 SQL 语句成功，但是受影响结果不是1
            if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
            return res.cc('修改用户信息成功！', 0)
        })
    })
    // 定义修改用户信息的 SQL 语句 （根据用户的id，修改用户的基本信息）
}

// 1.3 修改密码的处理函数
exports.updatePassword = (req, res) => {
    if (!req.query.oldPwd || !req.query.newPwd) return res.cc('密码不能为空！')
    if (req.query.oldPwd == req.query.newPwd) return res.cc('新旧密码不能相同！')
    // 根据 id 查询用户是否存在
    const sql = 'select * from t_users where id=?'
    db.query(sql, req.user?.id || req.auth?.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 检查指定 id 的用户是否存在
        if (results.length !== 1) return res.cc('用户不存在！')
        // 判断提交的旧密码是否正确
        if (results[0].password !== req.query.oldPwd) return res.cc('旧密码错误！')
        // 修改用户密码
        const updateSql = 'update t_users set password=? where id=?'
        db.query(updateSql, [req.query.newPwd, req.user?.id || req.auth?.id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)
            // 执行 SQL 语句成功，但是受影响结果不是1
            if (results.affectedRows !== 1) return res.cc('修改用户密码失败！')
            // 修改成功
            res.cc('修改用户密码成功！', 0)
        })
    })
}

// 1.4 上传头像的处理函数
exports.uploadAvatar = (req, res) => {
    let form = new multiparty.Form();
    form.uploadDir = "../public/user_pic";  //图片存储地址
    form.parse(req, function (err, fields, files) {
        try {
            // 文件为files.file[0]
            let upfile = files.file[0]
            // 为文件进行命名,修改upfile文件中的path,否则会随机生成文件名
            let newpath = form.uploadDir + '/' + upfile.originalFilename  //文件名
            // 重命名
            // console.log(newpath,"newpath")
            fs.renameSync(upfile.path, newpath);
            // 返回信息,((upfile.size)/1048576).toFixed(2)将文件由B转换为M的单位并进行取小数点后两位进行四舍五入向上取操作

            res.send({
                status: 0,
                message: "图片上传成功！",
                file_name: upfile.originalFilename,
            })
        } catch {
            res.cc("图片上传失败！" + err)
        }
    })
}

// 1.4.1 更新用户头像信息
exports.updateAvatar = (req, res) => {
    const sqlStr = ' update t_users set ? where id= ? '
    db.query(sqlStr, [req.query, req.user?.id || req.auth?.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新用户头像信息失败！')
        return res.cc('更新用户头像信息成功！', 0)
    })
}

// 1.5 获取密保问题的路由
exports.getPswProtect = (req, res) => {
    const sqlStr = ' select * from t_protect where uid = ? '
    db.query(sqlStr, req.user?.id || req.auth?.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            data: results
        })
    })
}

// 1.6 更新密保问题的路由
exports.updatePswProtect = (req, res) => {
    const sqlStr = ' select * from t_protect where uid= ? '
    db.query(sqlStr, req.user?.id || req.auth?.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length < 1) {
            const sqlStr = ' insert into t_protect set uid=?, username=?, ? '
            db.query(sqlStr, [req.user?.id || req.auth?.id, (req.user?.username || req.auth?.username), req.query], (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1) return res.cc('创建密保信息失败！')
                res.cc('创建密保信息成功！', 0)
            })
        } else {
            const sqlStr = ' update t_protect set ? where uid = ? '
            db.query(sqlStr, [req.query, req.user?.id || req.auth?.id], (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1) return res.cc('更新密保信息失败！')
                res.cc('更新密保信息成功！', 0)
            })
        }
    })
}

// 1.7 清除密保问题的路由
exports.deletePswProtect = (req, res) => {
    const sqlStr = ` update t_protect set 
                    question_1=null, answer_1=null, 
                    question_2=null, answer_2=null, 
                    question_3=null, answer_3=null,
                    lastEditDate=?  where uid = ? `
    db.query(sqlStr, [req.query.lastEditDate, req.user?.id || req.auth?.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('清除密保信息失败！')
        res.cc('清除密保信息成功！', 0)
    })
}
// --------------------------------------------------------------claim---------------------------------------------------------
// 2.1 获取个人相关的招领信息的处理函数
exports.getUserClaim = (req, res) => {
    const sqlStr = ' select * from t_claim where initiatorId=? '
    db.query(sqlStr, req.user?.id || req.auth?.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取用户招领信息成功！',
            data: results
        })
    })
}

// 2.2 添加一条招领信息的处理函数
exports.addClaim = (req, res) => {
    const sqlStr = ' insert into t_claim set ? '
    db.query(sqlStr, req.query, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('发布招领信息失败，请稍后再试！')
        res.cc('发布招领信息成功！', 0)
    })
}

// 2.2.1 上传招领信息的图片
exports.uploadClaimPic = (req, res) => {
    let form = new multiparty.Form();
    form.uploadDir = "../public/claim_pic";  //图片存储地址
    form.parse(req, function (err, fields, files) {
        try {
            // 文件为files.file[0]
            let upfile = files.file[0]
            // 为文件进行命名,修改upfile文件中的path,否则会随机生成文件名
            let newpath = form.uploadDir + '/' + upfile.originalFilename  //文件名
            // 重命名
            // console.log(newpath,"newpath")
            fs.renameSync(upfile.path, newpath);
            // 返回信息,((upfile.size)/1048576).toFixed(2)将文件由B转换为M的单位并进行取小数点后两位进行四舍五入向上取操作

            res.send({
                status: 0,
                message: "图片上传成功！",
                file_name: upfile.originalFilename,
            })
        } catch {
            res.cc("图片上传失败！" + err)
        }
    })
}

// 2.3 认领一条招领信息的处理函数
exports.handleClaim = (req, res) => {
    const sqlStr = ' update t_claim set ? , isFound=3 where id=? '
    db.query(sqlStr, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('申请认领失败，请稍后再试！')
        res.cc('申请认领成功！', 0)
    })
}

// 2.4 修改一条招领信息的处理函数
exports.editClaim = (req, res) => {
    const sqlStr = ' update t_claim set ? where id=? '
    db.query(sqlStr, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('修改信息失败，请稍后再试！')
        res.cc('修改信息成功！', 0)
    })
}

// 2.5 删除一条招领信息
exports.deleteClaim = (req, res) => {
    const sqlStr = ' delete from t_claim where id=? '
    db.query(sqlStr, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('删除信息失败，请稍后再试！')
        res.cc('删除信息成功！', 0)
        return
    })
}

// 2.5.1 删除一条招领信息的图片
exports.deleteClaimPic = (req, res) => {
    const sql = 'select * from t_claim where article_pic=? and id!=?'
    db.query(sql, [req.query.article_pic, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 0) res.cc('图片资源占用，未执行删除')
        if (results.length = 0) {
            const path = '../public/claim_pic/' + req.query.article_pic
            fs.unlink(path, (err) => {
                if (err) res.cc(err)
                // res.cc("文件删除成功！", 0)
            })
        }
    })
}
// --------------------------------------------------------------revert---------------------------------------------------------
// 3.1 获取个人相关的寻物任务的处理函数
exports.getUserRevert = (req, res) => {
    const sqlStr = ' select * from t_revert where initiatorId=? '
    db.query(sqlStr, req.user?.id || req.auth?.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取用户寻物信息成功！',
            data: results
        })
    })
}

// 3.2 添加一条寻物信息的处理函数
exports.addRevert = (req, res) => {
    const sqlStr = ' insert into t_revert set ? '
    db.query(sqlStr, req.query, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('发布寻物信息失败，请稍后再试！')
        res.cc('发布寻物信息成功！', 0)
    })
}

// 3.2.1 上传寻物信息的图片
exports.uploadRevertPic = (req, res) => {
    let form = new multiparty.Form();
    form.uploadDir = "../public/revert_pic";  //图片存储地址
    form.parse(req, function (err, fields, files) {
        try {
            // 文件为files.file[0]
            let upfile = files.file[0]
            // 为文件进行命名,修改upfile文件中的path,否则会随机生成文件名
            let newpath = form.uploadDir + '/' + upfile.originalFilename  //文件名
            // 重命名
            // console.log(newpath,"newpath")
            fs.renameSync(upfile.path, newpath);
            // 返回信息,((upfile.size)/1048576).toFixed(2)将文件由B转换为M的单位并进行取小数点后两位进行四舍五入向上取操作

            res.send({
                status: 0,
                message: "图片上传成功！",
                file_name: upfile.originalFilename,
            })
        } catch {
            res.cc("图片上传失败！" + err)
        }
    })
}

// 3.3 归还一条寻物信息的处理函数
exports.handleRevert = (req, res) => {
    const sqlStr = ' update t_revert set ? , isFound=3 where id=? '
    db.query(sqlStr, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('申请归还失败，请稍后再试！')
        res.cc('申请归还成功！', 0)
    })
}

// 3.4 修改一条寻物信息的处理函数
exports.editRevert = (req, res) => {
    const sqlStr = ' update t_revert set ? where id=? '
    db.query(sqlStr, [req.query, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('修改信息失败，请稍后再试！')
        res.cc('修改信息成功！', 0)
    })
}

// 3.5 删除一条寻物信息的处理函数
exports.deleteRevert = (req, res) => {
    const sqlStr = ' delete from t_revert where id=? '
    db.query(sqlStr, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('删除信息失败，请稍后再试！')
        res.cc('删除信息成功！', 0)
    })
}

// 3.5.1 删除一条寻物信息的图片
exports.deleteRevertPic = (req, res) => {

    const sql = 'select * from t_revert where article_pic=? and id!=?'
    db.query(sql, [req.query.article_pic, req.query.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 0) res.cc('图片资源占用，未执行删除')
        if (results.length = 0) {
            const path = '../public/revert_pic/' + req.query.article_pic
            fs.unlink(path, (err) => {
                if (err) res.cc(err)
                // res.cc("文件删除成功！", 0)
            })
        }
    })
}
// -------------------------------------------------------handle  claim---------------------------------------------------------
// 4.1 获取个人相关认领任务的处理函数
exports.getUserHandleClaim = (req, res) => {
    const sqlStr = ' select * from t_claim where handlerId=? '
    db.query(sqlStr, req.user?.id || req.auth?.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取用户认领信息成功！',
            data: results
        })
    })
}

// 4.2 取消一条认领任务
exports.cancelHandleClaim = (req, res) => {
    const sqlStr = ' update t_claim set isFound = 1, handlerId = null, handlerPhone = null, handlerWechat = null, handlerQQ = null where id=? '
    db.query(sqlStr, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('取消认领失败，请稍后再试！')
        res.cc('取消认领成功！', 0)
    })
}

// -------------------------------------------------------handle  revert---------------------------------------------------------
// 5.1 获取个人相关还物任务的处理函数
exports.getUserHandleRevert = (req, res) => {
    const sqlStr = ' select * from t_revert where handlerId=? '
    db.query(sqlStr, req.user?.id || req.auth?.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取用户还物信息成功！',
            data: results
        })
    })
}

// 5.2 取消一条还物任务的处理函数
exports.cancelHandleRevert = (req, res) => {
    const sqlStr = ' update t_revert set isFound = 1, handlerId = null, handlerPhone = null, handlerWechat = null, handlerQQ = null where id=? '
    db.query(sqlStr, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('修改信息失败，请稍后再试！')
        res.cc('修改信息成功！', 0)
    })
}

// -------------------------------------------------------comments----------------------------------------------------------------

// 6.1 发布一条留言的处理函数
exports.publishComment = (req, res) => {
    const sqlStr = ' insert into t_comments set ? '
    db.query(sqlStr, req.query, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('发布留言失败，请稍后再试！')
        res.cc('发布留言成功！', 0)
    })
}

// 6.2 删除一条留言的处理函数
exports.deleteComment = (req, res) => {
    const sqlStr = ' delete from t_comments where id=? or higherLevelId=? '
    db.query(sqlStr, [req.query.id, req.query.higherLevelId], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows < 1) res.cc('删除留言失败，请稍后再试！')
        res.cc('删除留言成功！', 0)
    })
}

// 6.3 发布一条留言回复的处理函数
exports.publishCommentsReply = (req, res) => {
    const sqlStr = ' insert into t_comments set ? '
    db.query(sqlStr, req.query, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('回复留言失败，请稍后再试！')
        res.cc('回复留言成功！', 0)
    })
}


// 6.4 删除一条留言回复后一级评论的评论数-1的处理函数
exports.deleteReply = (req, res) => {
    const sqlStr = ' update t_comments set reply=reply-1 where id=? '
    db.query(sqlStr, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows < 1) res.cc('删除留言失败，请稍后再试！')
        res.cc('删除留言成功！', 0)
    })
}

// -------------------------------------------------------public----------------------------------------------------------------

// 7.1 获取用户认领任务
exports.getUserClaimTask = (req, res) => {
    const sqlStr = ' select * from t_claim where handlerId=? and isFound!=0'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 7.2 获取用户归还任务
exports.getUserRevertTask = (req, res) => {
    const sqlStr = ' select * from t_revert where handlerId=? and isFound!=0'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 7.3 获取用户 申请认领 的 审核结果
exports.getUserClaimNotice = (req, res) => {
    const sqlStr = ' select * from t_results where huid=? and claimId != "" and  isNotice=0 '
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 7.4 获取用户 申请归还 的 审核结果
exports.getUserRevertNotice = (req, res) => {
    const sqlStr = ' select * from t_results where huid=? and revertId != "" and isNotice=0 '
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取成功！',
            data: results
        })
    })
}

// 7.5 修改 isNotice 的值为 1（已通知）
exports.updateNotice = (req, res) => {
    const sqlStr = ' update t_results set isNotice = 1 where id = ? '
    db.query(sqlStr, req.query.id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '修改成功！'
        })
    })
}














