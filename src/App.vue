<template>
    <div id="app">
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染到这里 -->
        <router-view></router-view>
    </div>
</template>


<script>
// document.documentElement.style.filter = 'grayscale(100%)'  // 界面添加灰色滤镜（哀悼）
export default {
    name: 'App',
    // 防止刷新页面导致 vuex 数据消失
    mounted() {
      window.addEventListener('unload', this.saveState);
    },
    methods: {
      saveState() {
        window.sessionStorage.setItem('state', JSON.stringify(this.$store.state.user))
        window.sessionStorage.setItem('claim', JSON.stringify(this.$store.state.claim))
        window.sessionStorage.setItem('admin', JSON.stringify(this.$store.state.admin))
        window.sessionStorage.setItem('general', JSON.stringify(this.$store.state.general))
      },
    },
}
</script>


<style lang="less" scope>
html,body,p {
    margin: 0;
    padding: 0;
}
html,body {
    height: 100%;
    width: 100%;
    min-width: 1200px;
    min-height: 500px;
    background-color: rgb(244,244,244);
}
#app {
    height: 100%;
    width: 100%;
}
.el-notification {
    width: 300px;
}
.v-modal{
    opacity: 0.5;
    z-index: 1;
}

</style>
