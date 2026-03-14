const express = require('express')
const router = express.Router()

// 挂载路由
// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// --------------------------------------------------------------userInfo---------------------------------------------------------

// 1.1 获取用户基本信息的路由
router.get('/getUserInfo', userinfo_handler.getUserInfo)

// 1.2 更新用户基本信息的路由
router.post('/updateUserInfo', userinfo_handler.updateUserInfo)

// 1.3 修改密码的路由
router.post('/updatePassword', userinfo_handler.updatePassword)

// 1.4 上传头像的路由
router.post('/uploadAvatar', userinfo_handler.uploadAvatar)

// 1.4.1 更新用户头像信息
router.post('/updateAvatar', userinfo_handler.updateAvatar)

// 1.5 获取密保问题的路由
router.get('/getPswProtect', userinfo_handler.getPswProtect)

// 1.6 更新密保问题的路由
router.post('/updatePswProtect', userinfo_handler.updatePswProtect)

// 1.7 清除密保问题的路由
router.post('/deletePswProtect', userinfo_handler.deletePswProtect)

// --------------------------------------------------------------claim---------------------------------------------------------
// 2.1 获取个人相关的招领信息的路由
router.get('/getUserClaim', userinfo_handler.getUserClaim)

// 2.2 添加一条招领信息的路由
router.post('/addClaim', userinfo_handler.addClaim)

// 2.2.1 上传招领信息的图片
router.post('/uploadClaimPic', userinfo_handler.uploadClaimPic)

// 2.3 认领一条招领信息的路由
router.post('/handleClaim', userinfo_handler.handleClaim)

// 2.4 修改一条招领信息的路由
router.post('/editClaim', userinfo_handler.editClaim)

// 2.5 删除一条招领信息的路由
router.post('/deleteClaim', userinfo_handler.deleteClaim)

// 2.5.1 删除一条招领信息的图片
router.post('/deleteClaimPic', userinfo_handler.deleteClaimPic)

// --------------------------------------------------------------revert---------------------------------------------------------
// 3.1 获取个人相关寻物信息的路由
router.get('/getUserRevert', userinfo_handler.getUserRevert)

// 3.2 添加一条寻物信息的路由
router.post('/addRevert', userinfo_handler.addRevert)

// 3.2.1 上传寻物信息的图片
router.post('/uploadRevertPic', userinfo_handler.uploadRevertPic)

// 3.3 归还一条寻物信息的路由
router.post('/handleRevert', userinfo_handler.handleRevert)

// 3.4 修改一条寻物信息的路由
router.post('/editRevert', userinfo_handler.editRevert)

// 3.5 删除一条寻物信息的路由
router.post('/deleteRevert', userinfo_handler.deleteRevert)

// 3.5.1 删除一条寻物信息的图片
router.post('/deleteRevertPic', userinfo_handler.deleteRevertPic)
// -------------------------------------------------------handle  claim---------------------------------------------------------
// 4.1 获取个人相关认领任务的路由
router.get('/getUserHandleClaim', userinfo_handler.getUserHandleClaim)

// 修改 和 确认完成 均使用了 2.4 修改一条招领信息的路由

// 4.2 取消一条认领任务的路由
router.post('/cancelHandleClaim', userinfo_handler.cancelHandleClaim)

// -------------------------------------------------------handle  revert---------------------------------------------------------
// 5.1 获取个人相关归还任务的路由
router.get('/getUserHandleRevert', userinfo_handler.getUserHandleRevert)

// 修改 和 确认完成 均使用了 3.4 修改一条寻物信息的路由

// 5.2 取消一条还物任务的路由
router.post('/cancelHandleRevert', userinfo_handler.cancelHandleRevert)
// -------------------------------------------------------comments----------------------------------------------------------------
// 6.1 发布一条留言的路由
router.post('/publishComment', userinfo_handler.publishComment)

// 6.1 删除一条留言的路由
router.post('/deleteComment', userinfo_handler.deleteComment)

// 6.1 发布一条留言回复的路由
router.post('/publishCommentsReply', userinfo_handler.publishCommentsReply)

// 6.4 删除一条留言回复后一级评论的评论数-1的路由
router.post('/deleteReply', userinfo_handler.deleteReply)
// -------------------------------------------------------public----------------------------------------------------------------

// 7.1 获取用户认领任务
router.get('/getUserClaimTask', userinfo_handler.getUserClaimTask)

// 7.2 获取用户归还任务
router.get('/getUserRevertTask', userinfo_handler.getUserRevertTask)

// 7.3 获取用户 申请认领 的 审核通过 的结果
router.get('/getUserClaimNotice', userinfo_handler.getUserClaimNotice)

// 7.4 获取用户 申请归还 的 审核通过 的结果
router.get('/getUserRevertNotice', userinfo_handler.getUserRevertNotice)

// 7.5 修改 isNotice 的值为 1（已通知） 
router.post('/updateNotice', userinfo_handler.updateNotice)

module.exports = router