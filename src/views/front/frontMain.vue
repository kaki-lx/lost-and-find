<template>
    <div class="container">
        <el-container>
            <!-- 引用FrontHeader.vue组件 -->
            <el-header>
                <front-header />
            </el-header>


            <!-- 引用FrontMain.vue组件 -->
            <el-main>
                <div class="main">
                    <front-main />
                    <!-- 路由出口 -->
                    <!-- 路由匹配到的组件将渲染到这里 -->
                    <router-view></router-view>
                </div>
            </el-main>

            
            <!-- 引用FrontFooter.vue组件 -->
            <el-footer height="40px">
                <front-footer />
            </el-footer>
        </el-container>
    </div>
</template>



<script>
import FrontHeader from "../../components/FrontHeader.vue"
import FrontMain from "../../components/FrontMain.vue"
import FrontFooter from "../../components/FrontFooter.vue"
export default {
    data() {
        return {

        }
    },
    components: { FrontHeader, FrontMain, FrontFooter },
}
</script>



<style lang="less" scoped>
html,body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
}
.container {
    height: 100%;
    width: 100%;
    // border: solid 1px skyblue;
    // background-color: aqua;
    .el-container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        .el-header {
            padding: 0;
            // border: solid 1px black;
        }

        .el-main {
            padding: 0;
            display: flex;
            justify-content: center;
            // background-color: aquamarine;

            .main {
                width: 80%;
                height: 100%;
                // border: solid 1px black;
                // animation: scale 1s linear 1 forwards;
            }
            
            // @keyframes scale {
            //     0% {
            //         // transform: scale(0);  // 大小
            //         opacity:0;
            //     }
            //     100%{
            //         // transform: scale(1);  // 大小
            //         opacity:1;
            //     }
            // }
        }

        .el-footer {
            padding: 0;
            // border: solid 1px green;
        }
    }
    
}

</style>