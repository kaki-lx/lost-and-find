<template>
    <div class="container">
        <!-- <h1>我是Footer</h1> -->
        <div class="footer">
            <div class="left">
                <el-popover
                    placement="top-start"
                    width="100"
                    trigger="hover">
                    <div class="content" style="padding: 0; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <div class="title">微信二维码</div>
                        <el-image
                            style="width: 100px; height: 100px"
                            :src="require('../assets/vx.jpg')"
                            fit="fill"></el-image>
                    </div>
                    <el-button slot="reference" size="mini"><i class="el-icon-service" style="margin-right: 5px;"></i>联系管理员</el-button>
                </el-popover>
            </div>
    
            <div class="middle">
                <p>切勿相信虚假信息!如遇网络诈骗或存在诱导信息等情况，请第一时间联系平台管理员进行处理！</p>
            </div>
    
            <div class="right">
                <el-popover
                    placement="top-start"
                    width="100"
                    trigger="hover">
                    <div class="content" style="padding: 0; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <p>管理员邮箱</p>
                        <p>2312111811@qq.com</p>
                    </div>
                    <el-button slot="reference" size="mini"><i class="el-icon-document" style="margin-right: 5px;"></i>意见反馈邮箱</el-button>
                </el-popover>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {

    },
}
</script>

<style lang="less" scoped>
.container {
    height: 40px;
    background-color: rgb(156, 156, 156);
    display: flex;
    align-items: center;
    justify-content: center;
    .footer{
        width: 95%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .middle{
            .select{
                // color: rgb(131, 255, 236);
                cursor: pointer;
            }
        }
    }
}
</style>