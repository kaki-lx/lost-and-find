import Vue from "vue"
import VueRouter from "vue-router"

import frontMain from "../views/front/frontMain.vue"
import frontIndex from "../views/front/front_index.vue"
import frontClaim from "../views/front/front_claim.vue"
import frontRevert from "../views/front/front_revert.vue"

import frontComments from "../views/front/front_comments.vue"

import loginRegister from "../views/loginRegister.vue"

import userMain from "../views/user/userMain.vue"
import userInfo from "../views/user/userInfo.vue"
import userPwdEdit from "../views/user/userPwdEdit.vue"
import userClaim from "../views/user/userClaim.vue"
import userRevert from "../views/user/userRevert.vue"
import userHandleClaim from "../views/user/userHandleClaim.vue"
import userHandleRevert from "../views/user/userHandleRevert.vue"

import adminMain from "../views/admin/adminMain.vue"
import adminIndex from "../views/admin/index.vue"
import adminUserInfoManage from "../views/admin/userInfoManage.vue"
import adminManagerInfoManage from "../views/admin/managerInfoManage.vue"
import adminUserLOAManage from "../views/admin/userLOAManage"
import adminManagerLOAManage from "../views/admin/managerLOAManage"
import adminClaimManage from "../views/admin/claimManage.vue"
import adminRevertManage from "../views/admin/revertManage.vue"
import adminCommentsManage from "../views/admin/commentsManage.vue"
import adminLoginHistory from "../views/admin/loginHistory.vue"
import claimVerify from "../views/admin/claimVerify.vue"
import revertVerify from "../views/admin/revertVerify.vue"
import adminReportManage from "../views/admin/reportManage.vue"



Vue.use(VueRouter)

// 1. 创建路由组件
// 2. 将路由与组件进行映射
const routes = [
  // 主路由
  {
    path: '/',
    name: 'frontMain',
    component: frontMain,
    redirect: '/frontIndex',  // 重定向
    children: [
      // { path: 'loginRegister', component: loginRegister}
      { path: '/frontIndex', name: "frontIndex", component: frontIndex },      // 前台首页
      { path: '/frontClaim', name: "frontClaim", component: frontClaim },      // 前台认领页
      { path: '/frontRevert', name: "frontRevert", component: frontRevert },    // 前台归还页

      { path: '/frontComments', name: "frontComments", component: frontComments },           // 导航页
      {
        path: '/user',
        name: 'user',
        component: userMain,
        beforeEnter: (to, from, next) => {
          if (sessionStorage.getItem('Token')) {
            next()
          } else {
            next(false)
          }
        },
        redirect: '/user/userInfo',
        children: [
          { path: '/user/userInfo', name: 'userInfo', component: userInfo },      // 用户个人信息
          { path: '/user/userPwdEdit', name: 'userPwdEdit', component: userPwdEdit },     // 用户修改密码
          { path: '/user/userClaim', name: 'userClaim', component: userClaim },       // 用户发布的招领信息
          { path: '/user/userRevert', name: 'userRevert', component: userRevert },        // 用户发布的寻物信息
          { path: '/user/userHandleClaim', name: 'userHandleClaim', component: userHandleClaim },     // 用户的认领任务
          { path: '/user/userHandleRevert', name: 'userHandleRevert', component: userHandleRevert },      // 用户的归还任务
        ]
      },
    ]
  },

  {
    path: '/adminMain',
    name: 'adminMain',
    component: adminMain,
    beforeEnter: (to, from, next) => {
      const identity = JSON.parse(sessionStorage.getItem('state')).identity
      if (sessionStorage.getItem('Token') && identity != 2) {
        next()
      } else {
        next(false)
      }
    },
    redirect: '/adminIndex',
    children: [
      { path: '/adminIndex', name: "adminIndex", component: adminIndex },    // 首页
      { path: '/adminUserInfoManage', name: "adminUserInfoManage", component: adminUserInfoManage },     // 用户信息管理
      { path: '/adminManagerInfoManage', name: "adminManagerInfoManage", component: adminManagerInfoManage },       // 保管员信息管理
      { path: '/adminUserLOAManage', name: "adminUserLOAManage", component: adminUserLOAManage },        // 用户权限管理
      { path: '/adminManagerLOAManage', name: "adminManagerLOAManage", component: adminManagerLOAManage },       // 保管员权限管理
      { path: '/adminClaimManage', name: "adminClaimManage", component: adminClaimManage },      // 招领信息管理
      { path: '/adminRevertManage', name: "adminRevertManage", component: adminRevertManage },       // 寻物信息管理
      { path: '/adminCommentsManage', name: "adminCommentsManage", component: adminCommentsManage },       // 评论管理
      { path: '/adminLoginHistory', name: "adminLoginHistory", component: adminLoginHistory },       // 登录历史
      { path: '/claimVerify', name: "claimVerify", component: claimVerify },       // 登录历史
      { path: '/revertVerify', name: "revertVerify", component: revertVerify },       // 登录历史
      { path: '/adminReportManage', name: "adminReportManage", component: adminReportManage },       // 举报管理
    ]
  },

  {
    path: '/loginRegister',
    name: 'loginRegister',
    component: loginRegister
  },
]

// 3. 创建router实例
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// 4.将 router 实例对外进行暴露
export default router