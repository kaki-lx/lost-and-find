<template>
  <div class="container">
    <!-- <h1>我是userMain页（用户中心）</h1> -->

      <el-container>
        <!-- 引用UserAside.vue组件 -->
        <el-aside width="180px">
          <user-aside />
        </el-aside>

        <!-- 引用UserMain.vue组件 -->
        <el-main>
          <user-main />
          <!-- 路由出口 -->
          <!-- 路由匹配到的组件将渲染到这里 -->
          <router-view></router-view>
          </el-main>
      </el-container>
      
  </div>
</template>

<script>
import UserAside from '../../components/UserAside.vue'
import UserMain from "../../components/UserMain.vue"
export default {
  data() {
    return {

    }
  },
  components: { UserAside, UserMain },
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

    .el-container {
      height: 100%;

      .el-main {
        padding: 0 20px;
      }
    }

    // 去除 menu 菜单 二级菜单 打开后出现的竖向滑动条
    .el-aside::-webkit-scrollbar {
      display: none;
    }
}
</style>