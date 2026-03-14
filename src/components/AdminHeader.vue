<template>
    <!-- <h1>我是AdminHeader</h1> -->
    <div class="header">
        <div class="left">
          <el-button icon="el-icon-back" circle @click="backBtn"></el-button>
          登陆时间：{{ loginDate }}
        </div>

        <div class="middle">
          校园失物招领平台后台管理系统
        </div>

        <div class="right">
            <el-avatar
              v-if="userInfo.user_pic"
              :size="40"
              :src="require('../../public/user_pic/' + userInfo.user_pic)"
              style="margin-right: 10px; border: solid 1px black;"
            ></el-avatar>
            <el-avatar
              v-if="!userInfo.user_pic"
              :size="40"
              :src="require('../../public/no_pic/noAvatar.png')"
              style="margin-right: 10px; border: solid 1px black;"
            ></el-avatar>
            欢迎你，{{ userInfo.nickname }}
            <el-button icon="el-icon-switch-button" circle @click="quitBtn"></el-button>
        </div>

    </div>
</template>

<script>
import { getCurrentDate } from '../utils/methods'
import http from '../utils/request'
export default {
  data() {
    return {
      userInfo: {},
      loginDate: '',
      data: {}
    };
  },
  methods: {
    getUserInfo() {  
      this.userInfo = { ...this.$store.getters.getUserInfo };
      this.data = {
          loginDate: this.$store.getters.getLoginDate,
          logoutDate: getCurrentDate(),
          userId: this.userInfo.id,
          user_pic: this.userInfo.user_pic,
          nickname: this.userInfo.nickname,
          identity: this.userInfo.identity
      }
    },
    backBtn() {
      this.$router.push('/frontIndex')
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
    quitBtn() {
      // 添加历史数据
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
      // 清除 store 中的 loginDate
      this.$store.dispatch('asyncUpdateLoginDate', "")
      // 清除 store 中的 Token
      this.$store.dispatch('asyncUpdateUserToken', "")
      // 清除 store 中的 userInfo 的值(初始值为Object对象)
      this.$store.dispatch('asyncUpdateUserInfo', {})
      // 清除 sessionStorage 中的 Token
      sessionStorage.removeItem('Token')
      // 路由跳转
      this.$router.push('/loginRegister')
    }
  },
  mounted() {
    this.getUserInfo()
    this.loginDate = this.$store.getters.getLoginDate
  },
};
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ccc;
  // border: solid 1px saddlebrown;
  .left {
    padding-left: 20px;
    display: flex;
    align-items: center;
    .el-button {
      margin-right: 10px;
    }
  }
  .middle {
    font-size: 1.5em;
    font-weight: bolder;
  }
  .right {
    padding-right: 20px;
    display: flex;
    align-items: center;
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>