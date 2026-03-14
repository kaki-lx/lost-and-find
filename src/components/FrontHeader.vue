<template>
    <div class="header">
        <div class="container">
            <!-- <h1>我是Header</h1> -->
            <div class="logo-container" >
                <div class="img" @click="toIndex"><img src="../assets/logo.png" alt=""></div>
                <div class="text" @click="toIndex">
                    <p class="title">校园</p> <p class="describe">失物招领平台</p>
                </div> 
            </div>

            <div class="menu-container">
                <el-menu
                    router
                    :default-active="this.$route.path"
                    class="el-menu-demo"
                    mode="horizontal"
                    background-color="rgb(104,205,190,0.8)"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item v-for="item in menuData" :key="item.name" :index="item.index">{{ item.label }}</el-menu-item>
                </el-menu>
            </div>

            <div class="login-container" v-if=" isLogin ">
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link" style="color: white">
                        欢迎使用本平台，
                        <el-avatar v-if="userInfo.user_pic" :size="40" :src="require('../../public/user_pic/' + userInfo.user_pic)"></el-avatar>
                        <el-avatar v-if="!userInfo.user_pic" :size="40" :src="require('../../public/no_pic/noAvatar.png')"></el-avatar>
                        {{ this.$store.getters.getUserInfo.nickname }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-badge :value="taskCount" class="item" :hidden="taskCount==0"> -->
                        <el-dropdown-item icon="el-icon-user" command="my">个人中心</el-dropdown-item>
                        <!-- </el-badge> -->
                        <el-dropdown-item icon="el-icon-monitor" command="admin" v-if="this.$store.getters.getUserInfo.identity != 2">后台管理系统</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-switch-button" command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

            <div class="noLogin-container" v-if=" !isLogin ">
                <p>游客浏览模式</p>
                <el-button plain @click="goLoginRegister">登陆</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import http from "../utils/request"
import { getCurrentDate } from "../utils/methods"
export default {
    data() {
      return {
        userInfo: {},
        isLogin: false,

        taskCount: 0,
        menuData: [
            {
                path: "/",
                name: "frontIndex",
                label: "首  页",
                index: "/frontIndex",
            },
            {
                path: "/",
                name: "frontClaim",
                label: "失物招领",
                index: "/frontClaim",
            },
            {
                path: "/",
                name: "frontRevert",
                label: "寻物启事",
                index: "/frontRevert",
            },

            {
                path: "/",
                name: "frontComments",
                label: "留言板",
                index: "/frontComments",
            },
        ]
      };
    },
    methods: {
        getUserInfo() {
            this.userInfo = { ...this.$store.getters.getUserInfo}
        },
        toIndex() {
            this.$router.push('/frontIndex')
        },
        handleCommand(command) {
            // 用户个人中心
            if (command === 'my') {
                // 跳转用户个人中心页
                this.$router.push('/user/userInfo')
            }
            // 用户退出
            if (command === 'logout') {
                if(this.$store.getters.getLoginDate){
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/admin/addHistory',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            loginDate: this.$store.getters.getLoginDate,
                            logoutDate: getCurrentDate(),
                            userId: this.userInfo.id,
                            user_pic: this.userInfo.user_pic,
                            nickname: this.userInfo.nickname,
                            identity: this.userInfo.identity,
                            onlineTime: this.calOnlineTime( this.$store.getters.getLoginDate, getCurrentDate())
                        }
                    }).then((res) => {
                        if(res.data.status === 0){
                            console.log('添加历史数据成功！')
                        }
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })
                }
                // 清除 store 中的 loginDate
                this.$store.dispatch('asyncUpdateLoginDate', "")
                // 清除 store 中的 Token
                this.$store.dispatch('asyncUpdateUserToken', "")
                // 清除 store 中的 userInfo 的值(初始值为Object对象)
                this.$store.dispatch('asyncUpdateUserInfo', {})
                // 清除 sessionStorage 中的 Token
                sessionStorage.removeItem('Token')
                // 修改 登录状态 this.isLogin 的值为 false
                this.isLogin = false
                // 路由跳出 如果当前页面不是首页 则跳转首页
                if (this.$route.path !== '/frontIndex'){
                    this.$router.push('/')
                } 
            }
            // 进入后台
            if (command === 'admin') {
                if (this.$store.getters.getUserInfo.adminLOA === '1'){
                    if (this.$store.getters.getLoginDate == '') {
                        this.$store.dispatch('asyncUpdateLoginDate', getCurrentDate())
                    }
                    this.$router.push('/adminMain')
                    this.getVerifyTask()
                }else{
                    this.$message.warning('您没有后台权限！')
                }
            }
        },
        // 登录按钮 跳转登陆注册页面
        goLoginRegister() {
            this.$router.push('/loginRegister')
        },
        calOnlineTime(loginDate, logoutDate) {
            var login = new Date(loginDate)
            var logout = new Date(logoutDate)
            var second = parseInt(logout - login) / 1000
            if( 0 < second && second < 60){
                if( second < 10){
                    return '00:00:0' + second
                }else{
                    return '00:00:' + second
                }
            }else if( 60 <= second && second < 3600) {
                if( parseInt(second/60) < 10 ){
                    if( second%60 < 10 ){
                        return '00:0' + parseInt(second/60) + ':0' + second%60
                    }else{
                        return '00:0' + parseInt(second/60) + ':' + second%60
                    }
                }else{
                    if( second%60 < 10 ){
                        return '00:' + parseInt(second/60) + ':0' + second%60
                    }else{
                        return '00:' + parseInt(second/60) + ':' + second%60
                    }
                }
                // return parseInt(second/60) + '分' + second%60 + '秒'
            }else if( 3600 <= second ){
                if( parseInt(second/3600) < 10){
                    if( parseInt(parseInt(second%3600)/60) < 10 ){
                        if( parseInt(parseInt(second%3600)%60) < 10 ){
                            return '0' + parseInt(second/3600) + ':0' + parseInt(parseInt(second%3600)/60) + ':0' + parseInt(parseInt(second%3600)%60)
                        }else{
                            return '0' + parseInt(second/3600) + ':0' + parseInt(parseInt(second%3600)/60) + ':' + parseInt(parseInt(second%3600)%60)
                        }
                    }else{
                        if( parseInt(parseInt(second%3600)%60) < 10 ){
                            return '0' + parseInt(second/3600) + ':' + parseInt(parseInt(second%3600)/60) + ':0' + parseInt(parseInt(second%3600)%60)
                        }else{
                            return '0' + parseInt(second/3600) + ':' + parseInt(parseInt(second%3600)/60) + ':' + parseInt(parseInt(second%3600)%60)
                        }
                    }
                }else{
                    if( parseInt(parseInt(second%3600)/60) < 10 ){
                        if( parseInt(parseInt(second%3600)%60) < 10 ){
                            return parseInt(second/3600) + ':0' + parseInt(parseInt(second%3600)/60) + ':0' + parseInt(parseInt(second%3600)%60)
                        }else{
                            return parseInt(second/3600) + ':0' + parseInt(parseInt(second%3600)/60) + ':' + parseInt(parseInt(second%3600)%60)
                        }
                    }else{
                        if( parseInt(parseInt(second%3600)%60) < 10 ){
                            return parseInt(second/3600) + ':' + parseInt(parseInt(second%3600)/60) + ':0' + parseInt(parseInt(second%3600)%60)
                        }else{
                            return parseInt(second/3600) + ':' + parseInt(parseInt(second%3600)/60) + ':' + parseInt(parseInt(second%3600)%60)
                        }
                    }
                }
                // return parseInt(second/3600) + '时' + parseInt(parseInt(second%3600)/60) + '分' + parseInt(parseInt(second%3600)%60) + '秒'
            }
        },
        getVerifyTask() {
            let claimTask = []
            let revertTask = []
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getClaimVerifyList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    claimTask = [...res.data.data]
                    http({
                        method: 'get',
                        url: 'http://127.0.0.1:3007/admin/getRevertVerifyList',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        }
                    }).then((res) => {
                        if(res.data.status === 0){
                            revertTask = [...res.data.data]
                            if(claimTask.length !=0 || revertTask != 0){
                                this.$notify.info({
                                    title: '待处理申请',
                                    dangerouslyUseHTMLString: true,
                                    duration: 5000, // 显示时间 毫秒 1000ms == 1s
                                    message: claimTask.length + ' 个认领任务申请，</p><p>' + revertTask.length + ' 个归还任务申请。</p><p>请在下方【申请处理】中处理</P>',
                                    offset: 78,
                                    position: 'top-left'
                                })
                            }
                        }
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        }
    },
    mounted() {
        this.getUserInfo()
        this.activeIndex = this.$route.path
        // 判断当前是否为登录状态
        if( this.$store.getters.getUserInfo.nickname != "" && this.$store.getters.getUserToken ) {
            this.isLogin = true
        }
    }
  }
</script>



<style lang="less" scoped>
.header {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(156, 156, 156);


    .container {
        width: 98%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .logo-container {
            width: 25%;
            display: flex;
            flex-direction: row;
            // justify-content: center;

            .img{
                width: 50px;
                height: 50px;
                img{
                    width: 50px;
                    height: 50px;
                    border-radius: 10px;
                }
            }
            .img:hover{
                cursor: pointer;
            }
            .text {
                width: 120px;
                color: white;
                text-align: center;
                font-family: 宋体;

                // border: solid 1px black;

                .title {
                    font-size: 28px;
                    letter-spacing: 10px;
                    font-weight: 900;

                }
                .describe {
                    font-size: 14px;
                    letter-spacing: 2px;
                }
            }
            .text:hover{
                cursor: pointer;
            }
            
        }   

        .menu-container{
            width: 50%;
            .el-menu {
                .el-menu-item {
                    width: 20%;
                    text-align: center;
                    font-size: 18px;
                }
            }
        }

        .login-container {
            height: 100%;
            width: 25%;
            padding: 0 10px 0 0;
            display: flex;
            flex-direction: row;
            // justify-content: space-between;
            justify-content: right;
            font-size: 18px;
            // border: solid 1px black;

            .el-dropdown {
                font-size: 16px;
                /deep/.el-avatar{
                    position: relative;
                    top: 10px;
                }
            }
            
            .loginBtn {
                line-height: 60px;
            }
        }

        .noLogin-container {
            width: 25%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            font-size: 16px;

            p {
                padding: 0 20px;
                color: white;
            }
        }
    }
}




</style>