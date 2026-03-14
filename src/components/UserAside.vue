<template>
    <div class="container">
        <el-menu
            router
            :default-active="this.$route.path"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="rgb(106,203,189)"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="/user/userInfo">
                <i class="el-icon-user"></i>
                <span slot="title">基本信息</span>
            </el-menu-item>
            <el-menu-item index="/user/userPwdEdit">
                <i class="el-icon-edit"></i>
                <span slot="title">修改密码</span>
            </el-menu-item>
            <!-- <el-menu-item index="userAboutMe">
                <i class="el-icon-s-claim"></i>
                <span slot="title">与我有关</span>
            </el-menu-item> -->
            <el-submenu index="3">
                <template slot="title" >
                    <i class="el-icon-s-claim"></i>
                    <span>发布管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/user/userClaim">招领信息</el-menu-item>
                    <el-menu-item index="/user/userRevert">寻物信息</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-s-claim"></i>
                    <span>任务管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/user/userHandleClaim">认领任务</el-menu-item>
                    <el-menu-item index="/user/userHandleRevert">归还任务</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      }
    }
  }
</script>

<style lang="less" scoped>
.container {
    .el-menu {
        width: 100%;
        height: 100%;
    }
}
</style>