<template>
  <!-- <h1>我是AdminAside</h1> -->
  <div class="container">
    <el-menu
      router
      :unique-opened="true"
      :default-active="this.$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <div class="userInfo">
        <div class="background">
          <el-avatar
            v-if="userInfo.user_pic"
            :size="80"
            :src="require('../../public/user_pic/' + userInfo.user_pic)"
            style="margin-right: 10px;"
          ></el-avatar>
          <el-avatar
            v-if="!userInfo.user_pic"
            :size="80"
            :src="require('../../public/no_pic/noAvatar.png')"
            style="margin-right: 10px;"
          ></el-avatar>
          <div style="padding: 10px 0;">{{ userInfo.identity ? '校园失物招领平台保管员' : '校园失物招领平台管理员' }}</div>
        </div>
      </div>
      

      <el-menu-item index="/adminIndex">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span>申请处理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/claimVerify">认领申请</el-menu-item>
          <el-menu-item index="/revertVerify">归还申请</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>信息管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/adminUserInfoManage">用户信息管理</el-menu-item>
          <el-menu-item index="/adminManagerInfoManage" v-if="userInfo.identity===0">保管员信息管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-connection"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/adminUserLOAManage">用户权限管理</el-menu-item>
          <el-menu-item index="/adminManagerLOAManage" v-if="userInfo.identity===0">保管员权限管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span>数据管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/adminClaimManage">招领信息管理</el-menu-item>
          <el-menu-item index="/adminRevertManage">寻物信息管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-menu-item index="/adminCommentsManage" v-if="userInfo.identity===0">
        <i class="el-icon-chat-dot-square"></i>
        <span slot="title">留言管理</span>
      </el-menu-item>
      
      <el-menu-item index="/adminReportManage" v-if="userInfo.identity===0">
        <i class="el-icon-warning-outline"></i>
        <span slot="title">举报管理</span>
      </el-menu-item>
      
      <el-menu-item index="/adminLoginHistory" v-if="userInfo.identity===0">
        <i class="el-icon-time"></i>
        <span slot="title">登陆历史</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>



<script>
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  methods: {
    getUserInfo() {
      this.userInfo = { ...this.$store.getters.getUserInfo };
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  mounted() {
    this.getUserInfo()
  },
};
</script>





<style lang="less" scoped>
.container {
  height: 100%;
  .el-menu {
    height: 100%;
    .userInfo {
      height: 20%;
      .background{
        color: white;
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>