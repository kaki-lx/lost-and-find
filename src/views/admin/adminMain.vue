<template>
    <div class="container">
        <el-container>
            <el-aside width="200px">
                <!-- 引用AdminAside.vue组件 -->
                <admin-aside />
            </el-aside>
            <el-container>
                <el-header height="50px">
                    <!-- 引用AdminHeader.vue组件 -->
                    <admin-header />
                </el-header>
                <el-main class="main">
                    <!-- 路由出口 -->
                    <!-- 路由匹配到的组件将渲染到这里 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>



<script>
import AdminAside from "../../components/AdminAside.vue";
import AdminHeader from "../../components/AdminHeader.vue";
export default {
    data() {
        return {};
    },
    components: { AdminAside, AdminHeader },
};
</script>



<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;
    .el-container {
        width: 100%;
        height: 100%;
        .el-header {
            padding: 0;
        }
        .el-main {
            padding: 10px;
            overflow-x: hidden;
        }
    }
}
</style>