<template>
    <!-- <h1>我是保管员权限管理页</h1> -->
    <div class="container">
        <div class="ONE">
            <div class="left">
                <p><span class="link" @click="toIndex">首页</span> > 权限管理 > 保管员权限管理</p>
            </div>
            <div class="right">
                <el-input v-model.trim="keyword" clearable @keyup.enter.native="search()"></el-input>
                <el-button plain type="primary" @click="search()">搜索</el-button>
            </div>
        </div>

        <div class="TWO">
            <el-table :data="viewList" border highlight-current-row style="width: 100%; text-align: center;">
                <el-table-column prop="id" label="ID" width="80" sortable header-align="center" align="center"
                    fixed="left"></el-table-column>

                <el-table-column prop="nickname" label="昵称" width="140" header-align="center" align="center"
                    fixed="left"> </el-table-column>

                <el-table-column prop="username" label="账号" width="140" header-align="center" align="center">
                </el-table-column>

                <el-table-column prop="identity" label="身份" width="100" header-align="center"
                    align="center">保管员</el-table-column>

                <el-table-column label="身份变更" width="130" header-align="center" align="center"
                    v-if="this.$store.getters.getUserInfo.identity === 0">
                    <template slot-scope="scope">
                        <el-button size="mini" type="warning"
                            @click="handleSet(scope.$index, scope.row)">设为普通用户</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="loginLOA" label="登陆权限" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.loginLOA" active-color="#13ce66" inactive-color="#ff4949"
                            active-value="1" inactive-value="0" @change="switchLoginLOA($event, scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="publishLOA" label="发布权限" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.publishLOA" active-color="#13ce66" inactive-color="#ff4949"
                            active-value="1" inactive-value="0" @change="switchPublishLOA($event, scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="claimLOA" label="认领权限" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.claimLOA" active-color="#13ce66" inactive-color="#ff4949"
                            active-value="1" inactive-value="0" @change="switchClaimLOA($event, scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="revertLOA" label="归还权限" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.revertLOA" active-color="#13ce66" inactive-color="#ff4949"
                            active-value="1" inactive-value="0" @change="switchRevertLOA($event, scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="commentsLOA" label="留言权限" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.commentsLOA" active-color="#13ce66" inactive-color="#ff4949"
                            active-value="1" inactive-value="0" @change="switchCommentsLOA($event, scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="adminLOA" label="后台登陆权限" width="120" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.adminLOA" active-color="#E6A23C" inactive-color="#ff4949"
                            active-value="1" inactive-value="0" @change="switchAdminLOA($event, scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="adminVerifyLOA" label="审核权限" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.adminVerifyLOA" active-color="#E6A23C" inactive-color="#ff4949"
                            active-value="1" inactive-value="0" @change="switchAdminVerifyLOA($event, scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="adminUserLOA" label="用户管理权限（信息/权限）" width="120" header-align="center"
                    align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.adminUserLOA" active-color="#E6A23C" inactive-color="#ff4949"
                            active-value="1" inactive-value="0" @change="switchAdminUserLOA($event, scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="adminDataLOA" label="数据管理权限" width="120" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.adminDataLOA" active-color="#E6A23C" inactive-color="#ff4949"
                            active-value="1" inactive-value="0" @change="switchAdminDataLOA($event, scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="adminCommentLOA" label="评论管理权限" width="120" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.adminCommentLOA" active-color="#E6A23C" inactive-color="#ff4949"
                            active-value="1" inactive-value="0" @change="switchAdminCommentLOA($event, scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="" label="操作" width="150" header-align="center" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary"
                            @click="handleOpen(scope.$index, scope.row)">开启</el-button>
                        <el-button size="mini" type="danger"
                            @click="handleClose(scope.$index, scope.row)">关闭</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="THREE">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                layout="total, prev, pager, next, jumper" :total="managerList.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import http from "../../utils/request"
export default {
    data() {
        return {
            managerList: [],
            viewList: [],
            keyword: '',
            pageSize: 10,
            currentPage: 1,
        }
    },
    methods: {
        // 获取保管员信息列表
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
                    this.viewList = [...this.managerList.slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize)]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            });
        },
        toIndex() {
            this.$router.push('/adminIndex')
        },
        // 设置为普通用户
        handleSet(index, row) {
            this.$confirm('确定将此用户升级为普通用户吗?<br>(将关闭后台权限、用户管理权限、数据管理权限等权限)', '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                http({
                    method: 'post',
                    url: 'http://127.0.0.1:3007/admin/setIdentity',
                    headers: {
                        Authorization: this.$store.getters.getUserToken,
                    },
                    params: {
                        identity: 2,
                        adminLOA: 0,
                        adminVerifyLOA: 0,
                        adminUserLOA: 0,
                        adminDataLOA: 0,
                        adminCommentLOA: 0,
                        id: row.id,
                    }
                }).then((res) => {
                    if (res.data.status === 0) {
                        if (this.keyword) {
                            this.$store.dispatch('asyncUpdatePage', this.currentPage)
                            this.$message.success('设置成功！')
                            this.search()
                            this.currentPage = this.$store.getters.getPage
                            this.$store.dispatch('asyncUpdatePage', '')
                            this.viewList = [...this.userList.slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize)]
                        } else {
                            this.$message.success('设置成功！')
                            this.getManagerList()
                        }
                    }
                }).catch((err) => {
                    console.log(err, "http请求失败");
                })
            }).catch(() => {

            })
        },
        // 开关 登陆权限修改
        switchLoginLOA(val, row) {
            // val 修改后的值， row 对象
            console.log(val, row, 'val , row')
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    loginLOA: val,
                    id: row.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success('登录权限修改成功！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 开关 发布权限修改
        switchPublishLOA(val, row) {
            // val 修改后的值， row 对象
            console.log(val, row, 'val , row')
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    publishLOA: val,
                    id: row.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success('发布权限修改成功！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 开关 认领权限修改
        switchClaimLOA(val, row) {
            // val 修改后的值， row 对象
            console.log(val, row, 'val , row')
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    claimLOA: val,
                    id: row.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success('认领权限修改成功！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 开关 归还权限修改
        switchRevertLOA(val, row) {
            // val 修改后的值， row 对象
            console.log(val, row, 'val , row')
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    revertLOA: val,
                    id: row.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success('归还权限修改成功！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 开关 留言权限修改
        switchCommentsLOA(val, row) {
            // val 修改后的值， row 对象
            console.log(val, row, 'val , row')
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    commentsLOA: val,
                    id: row.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success('留言权限修改成功！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 开关 后台权限修改
        switchAdminLOA(val, row) {
            // val 修改后的值， row 对象
            console.log(val, row, 'val , row')
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    adminLOA: val,
                    id: row.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success('后台登陆权限修改成功！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 开关 审核权限修改
        switchAdminVerifyLOA(val, row) {
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    adminVerifyLOA: val,
                    id: row.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success('审核权限修改成功！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 开关 用户管理权限修改
        switchAdminUserLOA(val, row) {
            // val 修改后的值， row 对象
            console.log(val, row, 'val , row')
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    adminUserLOA: val,
                    id: row.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success('用户管理权限修改成功！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 开关 数据管理权限修改
        switchAdminDataLOA(val, row) {
            // val 修改后的值， row 对象
            console.log(val, row, 'val , row')
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    adminDataLOA: val,
                    id: row.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success('数据管理权限修改成功！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 开关 评论管理权限修改
        switchAdminCommentLOA(val, row) {
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    adminCommentLOA: val,
                    id: row.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success('评论管理权限修改成功！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 一键开启所有权限
        handleOpen(index, row) {
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    loginLOA: 1,
                    publishLOA: 1,
                    claimLOA: 1,
                    revertLOA: 1,
                    commentsLOA: 1,
                    adminLOA: 1,
                    adminVerifyLOA: 1,
                    adminUserLOA: 1,
                    adminDataLOA: 1,
                    adminCommentLOA: 1,
                    id: row.id,
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    if (this.keyword) {
                        this.$store.dispatch('asyncUpdatePage', this.currentPage)
                        this.$message.success('权限已全部打开！')
                        this.search()
                        this.currentPage = this.$store.getters.getPage
                        this.$store.dispatch('asyncUpdatePage', '')
                        this.viewList = [...this.userList.slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize)]
                    } else {
                        this.$message.success('权限已全部打开！')
                        this.getManagerList()
                    }
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 一键关闭所有权限
        handleClose(index, row) {
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/editUserLOA',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    loginLOA: 0,
                    publishLOA: 0,
                    claimLOA: 0,
                    revertLOA: 0,
                    commentsLOA: 0,
                    adminLOA: 0,
                    adminVerifyLOA: 0,
                    adminUserLOA: 0,
                    adminDataLOA: 0,
                    adminCommentLOA: 0,
                    id: row.id,
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    if (this.keyword) {
                        this.$store.dispatch('asyncUpdatePage', this.currentPage)
                        this.$message.success('权限已全部关闭！')
                        this.search()
                        this.currentPage = this.$store.getters.getPage
                        this.$store.dispatch('asyncUpdatePage', '')
                        this.viewList = [...this.userList.slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize)]
                    } else {
                        this.$message.success('权限已全部关闭！')
                        this.getManagerList()
                    }
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
            this.currentPage = val
            this.viewList = [...this.managerList.slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize)]
        },
        search() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getKeywordManagerList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    keyword: this.keyword
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.managerList = [...res.data.data]
                    this.viewList = [...this.managerList.slice(0, this.pageSize)]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        }
    },
    mounted() {
        this.getManagerList()
    },
}
</script>


<style lang="less" scoped>
.container {
    background-color: white;
    animation: scale 0.5s linear 1 forwards;

    @keyframes scale {
        0% {
            margin-left: 100px;
        }

        100% {
            margin-left: 0px;
        }
    }

    .ONE {
        height: 6%;
        padding: 2px 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .left {
            height: 100%;
            display: flex;
            align-items: center;
            color: black;

            .link {
                color: black;
            }

            .link:hover {
                cursor: pointer;
                text-decoration: underline;
            }
        }

        .right {
            display: flex;
            flex-direction: row;

            .el-input {
                margin-right: 20px;
            }
        }

        // background: pink;
    }

    .TWO {
        height: 88%;
        overflow-y: scroll;
        // background: firebrick;
    }

    .TWO::-webkit-scrollbar {
        display: none
    }

    .THREE {
        height: 6%;
    }
}
</style>