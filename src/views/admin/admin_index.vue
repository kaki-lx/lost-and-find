<template>
    <div class="container">
        <div class="ONE">
            <div class="one" @click="toUserInfoManage">
                <div class="center">
                    <div class="left">
                        <el-image
                        style="width: 80px; height: 80px"
                        :src="require('../../assets/user.png')"></el-image>
                    </div>
                    <div class="right">
                        <p class="count">{{ userList.length }}</p>
                        <p class="title">普通用户人数</p>
                    </div>
                </div>
            </div>

            <div class="two" @click="toManagerInfoManage">
                <div class="center">
                    <div class="left">
                        <el-image
                        style="width: 80px; height: 80px"
                        :src="require('../../assets/manager.png')"></el-image>
                    </div>
                    <div class="right">
                        <p class="count">{{ managerList.length }}</p>
                        <p class="title">保管员人数</p>
                    </div>
                </div>
            </div>

            <div class="three" @click="toClaimManage">
                <div class="center">
                    <div class="left">
                        <el-image
                        style="width: 80px; height: 80px"
                        :src="require('../../assets/list.png')"></el-image>
                    </div>
                    <div class="right">
                        <p class="count">{{ claimList.length }}</p>
                        <p class="title">失物招领条数</p>
                    </div>
                </div>
            </div>

            <div class="four" @click="toRevertManage">
                <div class="center">
                    <div class="left">
                        <el-image
                        style="width: 80px; height: 80px"
                        :src="require('../../assets/list.png')"></el-image>
                    </div>
                    <div class="right">
                        <p class="count">{{ revertList.length }}</p>
                        <p class="title">寻物启事条数</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="TWO">
            <div class="left">
                <!-- 输入数据统计图 -->
                <div class="lineEcharts" ref="lineEcharts"></div>
            </div>

            <div class="right">
                <!-- 失物招领信息状态 -->
                <div class="claimPieEcharts" ref="claimPieEcharts"></div>
                <!-- 寻物启事信息状态 -->
                <div class="revertPieEcharts" ref="revertPieEcharts"></div>
            </div>
        </div>

        <div class="THREE">
            <div class="left">
                <!-- 新注册用户 -->
                <div class="newUser">
                    <div class="newUser_title">
                        <p>平</p> <p>台</p> <p>新</p>  <p>用</p>  <p>户</p>
                    </div>
                    <div class="newUser_data">
                        <div class="item" v-for="item in newUserList.slice(0,3)" :key="item.id">
                            <div class="item_container">
                                <div class="avatar">
                                    <el-avatar
                                        v-if="item.user_pic"
                                        :size="50"
                                        :src="require('../../../public/user_pic/' + item.user_pic)"
                                        style="border: solid 1px black;"
                                    ></el-avatar>
                                    <el-avatar
                                        v-if="!item.user_pic"
                                        :size="50"
                                        :src="require('../../../public/no_pic/noAvatar.png')"
                                        style="border: solid 1px black;"
                                    ></el-avatar>
                                </div>
                                <div class="nickname">{{ item.nickname }}</div>
                                <div class="phone">{{ item.phone }}</div>
                                <div class="createDate">{{ item.createDate.slice(0,10) }}</div>
                                <div class="createTime">{{ item.createDate.slice(11,19) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 近一月 完成率统计 饼图 -->
                <div class="finishRate" ref="finishRate"> </div>
            </div>

            <div class="right">
                <!-- 管理员最近登陆 -->
                <div class="login_title">
                    <p>后</p> <p>台</p> <p>最</p>  <p>近</p>  <p>登</p>  <p>陆</p>
                </div>
                <div class="login_data">
                    <div class="item" v-for="item in loginHistory.slice(0,3)" :key="item.id">
                        <div class="item_container">
                            <div class="avatar">
                                <el-avatar
                                    v-if="item.user_pic"
                                    :size="50"
                                    :src="require('../../../public/user_pic/' + item.user_pic)"
                                    style="border: solid 1px black;"
                                ></el-avatar>
                                <el-avatar
                                    v-if="!item.user_pic"
                                    :size="50"
                                    :src="require('../../../public/no_pic/noAvatar.png')"
                                    style="border: solid 1px black;"
                                ></el-avatar>
                            </div>
                            <div class="nickname">{{ item.nickname }}</div>
                            <div class="identity">{{ item.identity == 0 ? '平台管理员':'保管员' }}</div>
                            <div class="loginDate">{{ item.loginDate.slice(0,10) }}</div>
                            <div class="loginTime">{{ item.loginDate.slice(11,19) }}</div>
                            <div class="onlineTime">在线{{ calOnlineTime(item) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import http from "../../utils/request"
import * as echarts from 'echarts'
import vue from 'vue'
vue.prototype.$echarts = echarts
export default {
    data() {
        return {
            userList: [],
            managerList: [],
            claimList: [],
            revertList: [],
            newUserList: [],
            loginHistory: []
        }
    },
    methods: {
        getUserList() {
            http({
                method: "get",
                url: "http://127.0.0.1:3007/admin/getUserList",
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
            }).then((res) => {
                if (res.data.status === 1) {
                console.log(res.data.message, "执行失败");
                } else if (res.data.status === 0) {
                this.userList = [...res.data.data];
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            });
        },
        getManagerList() {
            http({
                method: "get",
                url: "http://127.0.0.1:3007/admin/getManagerList",
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
            }).then((res) => {
                if (res.data.status === 1) {
                console.log(res.data.message, "执行失败");
                } else if (res.data.status === 0) {
                this.managerList = [...res.data.data];
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            });
        },
        getClaimList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getClaimList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    this.claimList = [...res.data.data]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        getRevertList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getRevertList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    this.revertList = [...res.data.data]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        toUserInfoManage() {
            this.$router.push('/adminUserInfoManage')
        },
        toManagerInfoManage() {
            if(this.$store.getters.getUserInfo.identity === 0){
                this.$router.push('/adminManagerInfoManage')
            }else{
                this.$message.warning('您没有管理员权限！')
            }
        },
        toClaimManage() {
            this.$router.push('/adminClaimManage')
        },
        toRevertManage() {
            this.$router.push('/adminRevertManage')
        },

        // 第二行
        // 绘制折线图
        drawLineEcharts() {
            var userCount = []
            var claimCount = []
            var revertCount = []
            var commentsCount = []

            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getUserCount',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    for (var i in res.data.data) {
                        userCount.push({'value': res.data.data[i]})
                    }
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })

            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getClaimCount',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    for (var i in res.data.data) {
                        claimCount.push({'value': res.data.data[i]})
                    }
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })

            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getRevertCount',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    for (var i in res.data.data) {
                        revertCount.push({'value': res.data.data[i]})
                    }
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })

            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getCommentsCount',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    for (var i in res.data.data) {
                        commentsCount.push({'name': i, 'value': res.data.data[i]})
                    }
                    const lineEcharts = echarts.init(this.$refs.lineEcharts)
                    var lineEchartsOption = {
                        title: {
                            text: '上半年输入数据统计',
                            top: '5%',
                            left: '6%'
                        },
                        tooltip: {trigger: 'axis'},
                        legend: {
                            data:['新用户', '失物招领', '寻物启事', '留言'],
                            top: '6%',
                            right: '4%'
                        },
                        xAxis: {
                            data: commentsCount.map(item => item.name)
                        },
                        yAxis: {},
                        grid:{
                            show:false,
                            top:'22%',
                            right:'5%',
                            bottom:'10%',
                            left:'10%'
                        },
                        series: [
                            {
                                name: '新用户',
                                type: 'line',
                                // smooth: true,
                                data: userCount.map(item => item.value),
                            },
                            {
                                name: '失物招领',
                                type: 'line',
                                // smooth: true,
                                data: claimCount.map(item => item.value),
                            },
                            {
                                name: '寻物启事',
                                type: 'line',
                                // smooth: true,
                                data: revertCount.map(item => item.value),
                            },
                            {
                                name: '留言',
                                type: 'line',
                                // smooth: true,
                                data: commentsCount.map(item => item.value),
                            }
                        ]
                    }
                    lineEcharts.setOption(lineEchartsOption);
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 绘制饼图
        drawPieEcharts() {
            var claimStatus = []
            var revertStatus = []
            // 绘制失物招领状态饼图
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getClaimStatus',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    for (var i in res.data.data) {
                        claimStatus.push({'value': res.data.data[i], 'name': i})
                    }

                    const claimPieEcharts = echarts.init(this.$refs.claimPieEcharts)
                    var claimPieEchartsOption = {
                        title: {
                            text: '失物招领',
                            top: '5%',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            top: '15%',
                            left: 'center'
                        },
                        color: ['#67C23A', '#409EFF', '#FFD700'],
                        series: [
                            {
                                name: '失物招领 状态',
                                type: 'pie',
                                radius: ['40%', '70%'],
                                center: ['50%', '60%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    borderRadius: 10,
                                    borderColor: '#fff',
                                    borderWidth: 2
                                },
                                label: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        fontSize: 20,
                                        fontWeight: 'bold'
                                    }
                                },
                                labelLine: {
                                    show: false
                                },
                                data: claimStatus
                            }
                        ]
                    }
                    claimPieEcharts.setOption(claimPieEchartsOption)
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
            // 绘制寻物启事状态饼图
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getRevertStatus',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    for (var i in res.data.data) {
                        revertStatus.push({'value': res.data.data[i], 'name': i})
                    }
                    const revertPieEcharts = echarts.init(this.$refs.revertPieEcharts)
                    var revertPieEchartsOption = {
                        title: {
                            text: '寻物启事',
                            top: '5%',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            top: '15%',
                            left: 'center'
                        },
                        color: ['#67C23A', '#409EFF', '#FFD700'],
                        series: [
                            {
                                name: '失物招领 状态',
                                type: 'pie',
                                radius: ['40%', '70%'],
                                center: ['50%', '60%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    borderRadius: 10,
                                    borderColor: '#fff',
                                    borderWidth: 2
                                },
                                label: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    label: {
                                    show: true,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                    }
                                },
                                labelLine: {
                                    show: false
                                },
                                data: revertStatus
                            }
                        ]
                    }
                    revertPieEcharts.setOption(revertPieEchartsOption)
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },

        // 第三行
        getNewUserList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getNewUserList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    this.newUserList = [...res.data.data]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 绘制 近一月 完成率统计 饼图
        getFinishRate() {
            var finishClaim = []
            var finishRevert = []
            var finishRate = []

            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getClaimNearMonth',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    finishClaim = [...res.data.data]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })

            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getRevertNearMonth',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    finishRevert = [...res.data.data]
                    finishRate.push({'value': finishClaim.length, 'name': '失物招领'})
                    finishRate.push({'value': finishRevert.length, 'name': '寻物启事'})
                    // console.log(finishRate, 'finishRate')

                    const finishRatePie = echarts.init(this.$refs.finishRate)
                    var finishRateOption = {
                        title: {
                            text: '近一月 完成率统计',
                            top: '2%',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            top: '13%',
                            left: 'center'
                        },
                        color: ['#67C23A', '#409EFF'],
                        series: [
                            {
                                name: '完成率统计',
                                type: 'pie',
                                radius: ['40%', '70%'],
                                center: ['50%', '62%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    borderRadius: 10,
                                    borderColor: '#fff',
                                    borderWidth: 2
                                },
                                label: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                    }
                                },
                                labelLine: {
                                    show: false
                                },
                                data: finishRate
                            }
                        ]
                    }
                    finishRatePie.setOption(finishRateOption)
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        getLoginHistory() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getLoginHistory',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    this.loginHistory = [...res.data.data]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        calOnlineTime(item) {
            var login = new Date(item.loginDate)
            var logout = new Date(item.logoutDate)
            var second = parseInt(logout - login) / 1000
            if( 0 < second && second < 60){
                return second + '秒'
            }else if( 60 <= second && second < 3600) {
                return parseInt(second/60) + '分' + second%60 + '秒'
            }else if( 3600 <= second ){
                return parseInt(second/3600) + '时' + parseInt(parseInt(second%3600)/60) + '分' + parseInt(parseInt(second%3600)%60) + '秒'
            }
        },
    },
    mounted() {
        this.getUserList()
        this.getManagerList()
        this.getClaimList()
        this.getRevertList()
        this.drawLineEcharts()
        this.getNewUserList()
        this.drawPieEcharts()
        this.getLoginHistory()
        this.getFinishRate()
    },
}
</script>

<style lang="less" scoped>
.container {
    // background-color: white;
    animation: scale 1s linear 1 forwards;

    @keyframes scale {
        0% {
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }
    .ONE {
        width: 100%;
        height: 25%;
        display: flex;
        flex-direction: row;
        .one{
            width: 25%;
            height: 95%;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(45deg,#E0C4FD, #8FC6FD);
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            .center {
                width: 75%;
                height: 50%;
                display: flex;
                flex-direction: row;
                .left{
                    width: 40%;
                }
                .right{
                    width: 60%;
                    .count{
                        text-align: center;
                        font-size: 2.4em;
                    }
                    .title{
                        text-align: center;
                        font-size: 1.2em;
                    }
                }
            }
        }
        .one:hover { 
            cursor: pointer;
        }
        .two{
            width: 25%;
            height: 95%;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(45deg,#46D5FB, #41F0D1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            .center {
                width: 75%;
                height: 50%;
                display: flex;
                flex-direction: row;
                .left{
                    width: 40%;
                }
                .right{
                    width: 60%;
                    .count{
                        text-align: center;
                        font-size: 2.4em;
                    }
                    .title{
                        text-align: center;
                        font-size: 1.2em;
                    }
                }
            }
        }
        .two:hover { 
            cursor: pointer;
        }
        .three{
            width: 25%;
            height: 95%;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(45deg,#C0EDFF, #FBBED8);
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            .center {
                width: 75%;
                height: 50%;
                display: flex;
                flex-direction: row;
                .left{
                    width: 40%;
                }
                .right{
                    width: 60%;
                    .count{
                        text-align: center;
                        font-size: 2.4em;
                    }
                    .title{
                        text-align: center;
                        font-size: 1.2em;
                    }
                }
            }
        }
        .three:hover { 
            cursor: pointer;
        }
        .four{
            width: 25%;
            height: 95%;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(45deg,#C5FFF3, #FAF1BD);
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            .center {
                width: 75%;
                height: 50%;
                display: flex;
                flex-direction: row;
                .left{
                    width: 40%;
                }
                .right{
                    width: 60%;
                    .count{
                        text-align: center;
                        font-size: 2.4em;
                    }
                    .title{
                        text-align: center;
                        font-size: 1.2em;
                    }
                }
            }
        }
        .four:hover { 
            cursor: pointer;
        }
    }
    .TWO {
        width: 100%;
        height: 45%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        // background: pink;
        .left{
            width: 49%;
            height: 95%;
            margin: 15px 0px 0 6px;
            background: white;
            overflow: hidden;
            // background: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            // border:  solid 1px saddlebrown;
            .lineEcharts {
                height: 100%;
                width: 100%;

            }
        }
        .right{
            width: 49%;
            height: 95%;
            margin: 15px 6px 0 0px;
            display: flex;
            flex-direction: row;
            background: white;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            // border:  solid 1px saddlebrown;
            .claimPieEcharts {
                width: 50%;
                height: 100%;
            }
            .revertPieEcharts {
                width: 50%;
                height: 100%;
            }
            
        }
    }
    .THREE {
        width: 100%;
        height: 30%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .left{
            width: 59%;
            height: 90%;
            margin: 15px 0px 0 6px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            
            .newUser {
                width: 68%;
                height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: row;
                background: linear-gradient(8deg,#428aff, #77d2ff);
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                .newUser_title {
                    width: 9%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border-right: solid 2px #EEEEEE;
                    box-sizing: border-box;
                    p {
                        color: white;
                        height: 18%;
                        font-size: 1.2em;
                    }
                }
                .newUser_data {
                    width: 91%;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    .item {
                        width: 33.33%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        color: white;
                        .item_container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            .avatar {

                            }
                            .nickname{ 
                                font-size: 1em;
                                letter-spacing: 1px;
                            }
                            .phone {
                                margin-top: 5px;
                                font-size: 0.9em;
                            }
                            .createDate {
                                margin-top: 5px;
                            }
                            .createTime {
                                margin-top: 1px;
                            }
                        }
                    }
                }
            }
            .finishRate {
                width: 30%;
                height: 100%;
                background: white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            }
        }
        .right{
            width: 39%;
            height: 90%;
            margin: 15px 6px 0 0px;
            display: flex;
            flex-direction: row;
            overflow: hidden;
            background: linear-gradient(8deg,#428aff, #77d2ff);
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            .login_title {
                width: 10%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-right: solid 2px #EEEEEE;
                box-sizing: border-box;
                p {
                    color: white;
                    height: 15%;
                    font-size: 1.2em;
                }
            }
            .login_data {
                width: 90%;
                height: 100%;
                display: flex;
                flex-direction: row;
                .item{
                    width: 33.33%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    // background: rebeccapurple;
                    .item_container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        .avatar {

                        }
                        .nickname{ 
                            font-size: 1em;
                            letter-spacing: 1px;
                        }
                        .identity {
                            margin-top: 1px;
                            font-size: 0.8em;
                        }
                        .loginDate {
                            margin-top: 8px;
                            font-size: 0.8em;
                        }
                        .loginTime {
                            margin-top: 1px;
                            font-size: 0.8em;
                        }
                        .onlineTime {
                            margin-top: 8px;
                            font-size: 0.9em;
                        }
                    }
                }
            }
        }
    }
}
</style>