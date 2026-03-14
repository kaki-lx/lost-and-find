<template>
    <div class="container">
        <!-- 第一排 banner dataShow -->
        <el-row :gutter="20" class="ONE">
            <el-col :span="14" class="banner">
                <img src="../../assets/logo1.png" alt="">
            </el-col>

            <el-col :span="10">
                <div class="dataShow">
                    <p class="title">校园失物招领平台</p>
                    <p class="newText">最新动态：</p>
                    <ol>
                        <li>目前有<font>{{ count.claimCount }}</font>条失物招领信息，<br />
                            &emsp;&emsp;&emsp;&emsp;近3天有<font>{{ count.threeClaimCount }}</font>件物品正在寻找它的主人！</li>
                        <li>目前有<font>{{ count.revertCount }}</font>条寻物启事信息，<br />
                            &emsp;&emsp;&emsp;&emsp;近3天有<font>{{ count.threeRevertCount }}</font>件物品不小心遗失！</li>
                        <li>已累计找回<font>{{ count.foundCount }}</font>件物品，
                            认领<font>{{ count.foundClaimCount }}</font>件，
                            归还<font>{{ count.foundRevertCount }}</font>件。</li>
                        <li>
                            <p style="color: red;"> 注：骗子可能利用本站信息进行诈骗，谨防上当受骗！</p>
                        </li>
                    </ol>
                </div>
            </el-col>
        </el-row>

        <!-- 第二排  -->
        <el-row :gutter="20" class="TWO">
            <el-col :span="12">
                <div class="newList">
                    <div class="title">失物招领 · 最新信息</div>
                    <div class="data">
                        <span v-for="item in claimList.slice(0, 4)" :key="item.id">
                            ▶{{ item.date }}：【{{ item.initiatorNickname }}】捡到的【{{ item.resume }}】正在等待认领。
                        </span>
                        <span class="nodata" v-if="claimList.length == 0">暂无数据</span>
                        <div class="updata-more" v-if="claimList.length != 0">
                            <p>{{ getCurrentDate() }}</p>
                            <el-button type="text" @click="toFrontClaim">查看更多</el-button>
                        </div>
                    </div>
                </div>
            </el-col>

            <el-col :span="12">
                <div class="newList">
                    <div class="title">寻物启事 · 最新信息</div>
                    <div class="data">
                        <span v-for="item in revertList.slice(0, 4)" :key="item.id">
                            ▶{{ item.date }}：【{{ item.initiatorNickname }}】丢失的【{{ item.resume }}】正在等待归还。
                        </span>
                        <span class="nodata" v-if="revertList.length == 0">暂无数据</span>
                        <div class="updata-more" v-if="revertList.length != 0">
                            <p>{{ getCurrentDate() }}</p>
                            <el-button type="text" @click="toFrontRevert">查看更多</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 第三排 -->
        <el-row :gutter="20" class="THREE">
            <el-col :span="12">
                <div class="successCase">
                    <div class="title">成功案例 · 认领/归还</div>
                    <div class="data">
                        <span v-for="item in foundClaimList.slice(0, 4)" :key="item.id">
                            ✔【{{ item.initiatorNickname }}】捡到并归还了【{{ item.handlerNickname }}】的【{{ item.resume }}】。
                        </span>
                        <span v-for="item in foundRevertList.slice(0, 2)" :key="item.id">
                            ✔【{{ item.handlerNickname }}】捡到并归还了【{{ item.initiatorNickname }}】的【{{ item.resume }}】。
                        </span>
                        <span class="nodata"
                            v-if="foundClaimList.length == 0 && foundRevertList.length == 0">暂无数据</span>
                        <div class="updata" v-if="foundClaimList.length != 0 || foundRevertList.length != 0">
                            <p>{{ getCurrentDate() }}</p>
                        </div>
                    </div>
                </div>
            </el-col>

            <el-col :span="12">
                <div class="seekHelp">
                    <div class="title">寻求帮助</div>
                    <div class="managerList">
                        <div class="item" v-for="item in managerList" :key="item.id">
                            <div class="avatar">
                                <el-avatar v-if="item.user_pic" :size="50"
                                    :src="require('../../../public/user_pic/' + item.user_pic)"
                                    style="border: solid 1px black;"></el-avatar>
                                <el-avatar v-if="!item.user_pic" :size="50"
                                    :src="require('../../../public/no_pic/noAvatar.png')"
                                    style="border: solid 1px black;"></el-avatar>
                            </div>
                            <div class="info">
                                <p>{{ item.nickname }}</p>
                                <p>{{ item.identity === 1 ? '保管员' : '平台管理员' }}</p>
                                <p>{{ item.phone }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>



<script>
import { } from 'vue'
import http from "../../utils/request"
export default {
    data() {
        return {
            count: {
                claimCount: 0,
                threeClaimCount: 0,
                threeRevertCount: 0,
                revertCount: 0,
                foundCount: 0,
                foundClaimCount: 0,
                foundRevertCount: 0,
            },
            claimList: [],
            revertList: [],
            foundClaimList: [],
            foundRevertList: [],
            managerList: []
        }
    },
    methods: {
        getClaimList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getClaim',
            }).then((res) => {
                // this.count.claimCount = res.data.data.length
                this.claimList = [...res.data.data]
                this.count.claimCount = this.claimList.length
            }).catch((err) => {
                console.log(err, "#获取claimList失败")
            })
        },
        getThreeClaimList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getThreeClaim',
            }).then((res) => {
                this.count.threeClaimCount = res.data.data.length
            }).catch((err) => {
                console.log(err, "#获取threeClaimList失败")
            })
        },
        getRevertList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getRevert',
            }).then((res) => {
                // this.count.revertCount = res.data.data.length
                this.revertList = [...res.data.data]
                this.count.revertCount = this.revertList.length
            }).catch((err) => {
                console.log(err, "#获取revertList失败")
            })
        },
        getThreeRevertList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getThreeRevert',
            }).then((res) => {
                this.count.threeRevertCount = res.data.data.length
            }).catch((err) => {
                console.log(err, "#获取threeClaimRevert失败")
            })
        },
        getFoundClaimList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getFoundClaim',
            }).then((res) => {
                this.count.foundClaimCount = res.data.data.length
                this.count.foundCount = this.count.foundCount + res.data.data.length
                this.foundClaimList = [...res.data.data]
            }).catch((err) => {
                console.log(err, "#获取foundClaimList失败")
            })
        },
        getFoundRevertList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getFoundRevert',
            }).then((res) => {
                this.count.foundRevertCount = res.data.data.length
                this.count.foundCount = this.count.foundCount + res.data.data.length
                this.foundRevertList = [...res.data.data]
            }).catch((err) => {
                console.log(err, "#获取foundClaimList失败")
            })
        },
        toFrontClaim() {
            this.$router.push('/frontClaim')
        },
        toFrontRevert() {
            this.$router.push('/frontRevert')
        },
        getManagerList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getManagerList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.managerList = [...res.data.data]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 获取当前时间
        getCurrentDate() {
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hour = date.getHours(); // 时
            let minutes = date.getMinutes(); // 分
            if (month >= 1 && month <= 9) {
                month = "0" + month
            }
            if (day >= 0 && day <= 9) {
                day = "0" + day
            }
            if (hour >= 0 && hour <= 9) {
                hour = "0" + hour
            }
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes
            }
            const currentDate = year + '-' + month + '-' + day + ' ' + hour + ":" + minutes
            // console.log(currentDate, "日期")
            return currentDate
        }
    },
    mounted() {
        this.getClaimList()
        this.getThreeClaimList()
        this.getRevertList()
        this.getThreeRevertList()
        this.getFoundClaimList()
        this.getFoundRevertList()
        this.getManagerList()
    }
}
</script>



<style lang="less" scoped>
.container {
    animation: scale 0.5s linear 1 forwards;

    @keyframes scale {
        0% {
            // transform: scale(0);  // 大小
            opacity: 0;
        }

        100% {
            // transform: scale(1);  // 大小
            opacity: 1;
        }
    }

    // 第一排
    .ONE {
        height: 38%;
        padding: 5px 0;
        display: flex;
        // border: solid 1px black;

        .el-col {
            height: 100%;

            // banner图
            img {
                width: 100%;
                height: 100%;
            }

            // 数据展示
            .dataShow {
                height: 100%;
                width: 100%;
                overflow: hidden;
                background-color: white;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

                p {
                    height: 10%;
                }

                .title {
                    color: #666;
                    font-weight: bold;
                    font-size: 20px;
                    text-align: center;
                }

                .newText {
                    font-size: 17px;
                    padding: 0 0 0 10px;
                }

                ol {
                    width: 100%;
                    height: 80%;
                    font-size: 16px;
                    margin: 0;
                    padding-left: 60px; // 原40px

                    li {
                        margin-bottom: 10px;

                        font {
                            font-size: 18px;
                            color: red;
                        }
                    }
                }
            }
        }
    }

    // 第二排
    .TWO {
        height: 31%;
        padding: 5px 0;
        // border: solid 1px black;

        .el-col {
            height: 100%;

            .newList {
                height: 92%;
                padding: 5px;
                border: solid 1px #ccc;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

                .title {
                    height: 20%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.2em;
                    font-weight: bolder;
                    color: white;
                    background-color: rgb(104, 205, 190);
                }

                .data {
                    height: 80%;
                    padding: 5px 0 0 0;
                    display: flex;
                    flex-direction: column;
                    position: relative;

                    span {
                        font-size: 1em;
                        height: 20%;
                    }

                    .nodata {
                        text-align: center;
                        font-weight: bolder;
                        color: #666;
                    }

                    .updata-more {
                        width: 100%;
                        color: #409EFF;
                        font-size: 0.9em;
                        height: 30px;
                        line-height: 30px;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        position: absolute;
                        bottom: 0;
                    }
                }
            }
        }
    }


    // 第三排
    .THREE {
        height: 31%;
        padding: 5px 0;
        // border: solid 1px black;

        .el-col {
            height: 100%;
            // border: solid 1px black;

            // 成功案例
            .successCase {
                height: 92%;
                padding: 5px;
                border: solid 1px #ccc;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

                .title {
                    height: 20%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.2em;
                    font-weight: bolder;
                    color: white;
                    background-color: rgb(104, 205, 190);
                }

                .data {
                    height: 80%;
                    padding: 5px 0 0 0;
                    display: flex;
                    flex-direction: column;
                    position: relative;

                    span {
                        font-size: 1em;
                        height: 20%;
                    }

                    .nodata {
                        text-align: center;
                        font-weight: bolder;
                        color: #666;
                    }

                    .updata {
                        color: #409EFF;
                        font-size: 0.9em;
                        height: 30px;
                        line-height: 30px;
                        position: absolute;
                        bottom: 0;
                    }
                }
            }

            // 寻求帮助
            .seekHelp {
                height: 92%;
                padding: 5px;
                border: solid 1px #ccc;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

                .title {
                    height: 20%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.2em;
                    font-weight: bolder;
                    color: white;
                    background-color: rgb(104, 205, 190);
                }

                .managerList {
                    width: 100%;
                    height: 80%;
                    display: flex;
                    align-items: center;

                    .item {
                        width: 25%;
                        // height: 100%;
                        text-align: center;
                        border-right: solid 2px #EEEEEE;
                        box-sizing: border-box;
                        display: inline-block;

                        .avatar {
                            padding: 5px 0;
                        }

                        .info {
                            line-height: 22px;
                        }
                    }
                }
            }
        }
    }

}
</style>