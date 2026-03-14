const express = require('express')
const router = express.Router()

// 挂载路由

// 导入路由处理函数模块
const public_handler = require('../router_handler/public')

// 1.获取招领列表的路由
router.get('/getClaim', public_handler.getClaim)

// 2.获取寻物列表的路由
router.get('/getRevert', public_handler.getRevert)

// 3.获取已认领信息的路由
router.get('/getFoundClaim', public_handler.getFoundClaim)

// 4.获取已归还信息的路由
router.get('/getFoundRevert', public_handler.getFoundRevert)

// 5.获取 近三天 待招领 招领列表的路由
router.get('/getThreeClaim', public_handler.getThreeClaim)

// 6.获取 近三天 待归还 寻物列表的路由
router.get('/getThreeRevert', public_handler.getThreeRevert)

// 7.获取留言板评论列表的路由
router.get('/getCommentsList', public_handler.getCommentsList)

// 8.获取留言板回复列表的路由
router.get('/getReplyList', public_handler.getReplyList)

// 9.留言板点赞+1的路由
router.post('/support', public_handler.support)

// 10.留言板回复+1的路由
router.post('/reply', public_handler.reply)

// 11.获取保管员信息列表
router.get('/getManagerList', public_handler.getManagerList)

// 12.获取用户密保问题
router.get('/getPswProtect', public_handler.getPswProtect)

// 13.验证用户密保问题
router.post('/verifyPswProtect',public_handler.verifyPswProtect)

// 14.修改用户密码
router.post('/updatePassword', public_handler.updatePassword)

// 15.图片验证码
router.get('/checkCode', public_handler.checkCode)

// 16.提交举报
router.post('/report', public_handler.report)

// 将路由对象共享出去
module.exports = router