const express = require('express')
const router = express.Router()

// 导入路由处理函数模块
const admin_handler = require('../router_handler/admin')
// ----------------------------------------------------------------通  用----------------------------------------------------------

// 1.1 登出后台 添加历史数据
router.post('/addHistory', admin_handler.addHistory)

// ----------------------------------------------------------------首  页----------------------------------------------------------

// 1.1 获取用户录入数据（按月）
router.get('/getUserCount', admin_handler.getUserCount)
// 1.2 获取失物招领录入数据（按月）
router.get('/getClaimCount', admin_handler.getClaimCount)
// 1.3 获取寻物启事录入数据（按月）
router.get('/getRevertCount', admin_handler.getRevertCount)
// 1.4 获取留言录入数据（按月）
router.get('/getCommentsCount', admin_handler.getCommentsCount)

// 1.5 获取失物招领信息状态构成
router.get('/getClaimStatus', admin_handler.getClaimStatus)
// 1.6 获取寻物启事信息状态构成
router.get('/getRevertStatus', admin_handler.getRevertStatus)

// 1.7 获取失物招领 近一个月 完成 的列表
router.get('/getClaimNearMonth', admin_handler.getClaimNearMonth)

// 1.8 获取寻物启事 近一个月 完成 的列表
router.get('/getRevertNearMonth', admin_handler.getRevertNearMonth)

// 1.9 获取最新注册的用户列表
router.get('/getNewUserList', admin_handler.getNewUserList)

// 1.10 获取登录历史记录
router.get('/getLoginHistory', admin_handler.getLoginHistory)

// ---------------------------------------------------------------人员  管理------------------------------------------------------
// 1.1 获取普通用户列表的路由
router.get('/getUserList', admin_handler.getUserList)

// 1.2 删除用户的路由
router.post('/deleteUser', admin_handler.deleteUser)

// 1.3 升级为保管员的路由
router.post('/setIdentity', admin_handler.setIdentity)

// 1.4 获取保管员列表的路由
router.get('/getManagerList', admin_handler.getManagerList)

// 1.5 关键词查找用户信息的路由
router.get('/getKeywordUserList', admin_handler.getKeywordUserList)

// 1.6 关键词查找保管员信息的路由
router.get('/getKeywordManagerList', admin_handler.getKeywordManagerList)

// 1.7 编辑用户信息的路由
router.post('/updateUserInfo',admin_handler.updateUserInfo)

// 1.8 修改用户头像的路由
router.post('/updateAvatar', admin_handler.updateAvatar)


// ---------------------------------------------------------------权限  管理------------------------------------------------------

// 2.1 修改权限的路由
router.post('/editUserLOA', admin_handler.editUserLOA)


// ---------------------------------------------------------------数据  管理------------------------------------------------------
// 3.1 获取所有招领信息列表的路由
router.get('/getClaimList', admin_handler.getClaimList)

// 3.2 获取所有寻物信息列表的路由
router.get('/getRevertList', admin_handler.getRevertList)

// 3.3 关键词查找招领信息的路由
router.get('/getKeywordClaimList', admin_handler.getKeywordClaimList)

// 3.4 关键词查找寻物信息的路由
router.get('/getKeywordRevertList', admin_handler.getKeywordRevertList)

// 3.5 修改招领信息的路由
router.post('/editClaim', admin_handler.editClaim)

// 3.6 状态修改 待认领 -> 处理中
router.post('/statusClaimToProcessing', admin_handler.statusClaimToProcessing)

// 3.7 修改状态 处理中 -> 待认领
router.post('/statusProcessingToClaim', admin_handler.statusProcessingToClaim)
// 3.8 状态修改 处理中 -> 已认领
router.post('/statusProcessingToClaimed', admin_handler.statusProcessingToClaimed)

// 3.9 状态修改 已认领 -> 待认领
router.post('/statusClaimedToClaim', admin_handler.statusClaimedToClaim)
// 3.10 状态修改 已认领 -> 处理中
router.post('/statusClaimedToProcessing', admin_handler.statusClaimedToProcessing)

// 3.11 修改寻物信息的路由
router.post('/editRevert', admin_handler.editRevert)

// 3.12 状态修改 待归还 -> 处理中
router.post('/statusRevertToProcessing', admin_handler.statusRevertToProcessing)

// 3.13 修改状态 处理中 -> 待归还
router.post('/statusProcessingToRevert', admin_handler.statusProcessingToRevert)
// 3.14 状态修改 处理中 -> 已归还
router.post('/statusProcessingToReverted', admin_handler.statusProcessingToReverted)

// 3.15 状态修改 已归还 -> 待归还
router.post('/statusRevertedToRevert', admin_handler.statusRevertedToRevert)
// 3.16 状态修改 已归还 -> 处理中
router.post('/statusRevertedToProcessing', admin_handler.statusRevertedToProcessing)

// ---------------------------------------------------------------留言  管理------------------------------------------------------

// 4.1 关键词查找留言的路由
router.get('/getKeywordCommentList', admin_handler.getKeywordCommentList)

// 4.2 关键词查找回复的路由
router.get('/getKeywordReplyList', admin_handler.getKeywordReplyList)

// ---------------------------------------------------------------登陆历史管理------------------------------------------------------

// 5.1 获取登录历史记录
router.get('/getHistoryList', admin_handler.getHistoryList)

// 5.2 修改备注
router.post('/updatePS', admin_handler.updatePS)

// 5.3 删除一条历史记录
router.post('/deleteHistory', admin_handler.deleteHistory)

// ------------------------------------------------------------------申请处理------------------------------------------------------

// 6.1 获取失物招领 认领申请列表
router.get('/getClaimVerifyList', admin_handler.getClaimVerifyList)

// 6.2 失物招领申请 不符
router.post('/failClaim', admin_handler.failClaim)

// 6.3 获取寻物启事 归还申请列表
router.get('/getRevertVerifyList', admin_handler.getRevertVerifyList)

// 6.4 寻物启事申请 不符
router.post('/failRevert', admin_handler.failRevert)

// 6.5 添加审核结果
router.post('/addResults', admin_handler.addResults)

// 6.6 获取举报列表
router.get('/getReportList', admin_handler.getReportList)

// 6.7 处理举报
router.post('/handleReport', admin_handler.handleReport)

// 将路由对象共享出去
module.exports = router