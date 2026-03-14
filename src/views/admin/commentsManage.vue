<template>
    <!-- <h1>我是评论管理页</h1> -->
    <div class="container">
        <div class="ONE">
            <div class="left">
                <p><span class="link" @click="toIndex">首页</span>  > 留言管理</p>
            </div>
            <div class="right">
                <el-input v-model.trim="keyword" clearable @keyup.enter.native="search()"></el-input>
                <el-button plain type="primary" @click="search()">搜索</el-button>
            </div>
        </div>

        <div class="TWO">
            <el-table :data="viewList" border highlight-current-row style="width: 100%; text-algin: center;">
                <el-table-column prop="id" label="ID" width="80" sortable header-align="center" align="center"></el-table-column>

                <el-table-column prop="date" label="留言日期" width="200" sortable header-align="center" align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="authorId" label="用户ID" width="100" sortable header-align="center" align="center"></el-table-column>

                <el-table-column prop="user_pic" label="头像" width="80"  header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-avatar
                            v-if="scope.row.author_pic"
                            :size="35"
                            :src="require('../../../public/user_pic/' + scope.row.author_pic)"
                            style="border: solid 1px black;"
                        ></el-avatar>
                        <el-avatar
                            v-if="!scope.row.author_pic"
                            :size="35"
                            :src="require('../../../public/no_pic/noAvatar.png')"
                            style="border: solid 1px black;"
                        ></el-avatar>
                    </template>
                </el-table-column>

                <el-table-column prop="authorNickname" label="昵称" width="120" header-align="center" align="center"> </el-table-column>

                <el-table-column prop="comments" label="留言" header-align="center" align="center"> </el-table-column>

                <el-table-column prop="support" label="点赞" width="80" sortable header-align="center" align="center"> </el-table-column>

                <el-table-column prop="reply" label="回复" width="80" sortable header-align="center" align="center"> </el-table-column>

                <el-table-column label="操作" width="200" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleViewReply(scope.$index, scope.row)">查看回复</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="THREE">
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="commentsList.length">
            </el-pagination>
        </div>

        <el-dialog class="reply-dialog"
            title="回复列表"
            :visible.sync="replyDialogVisible"
            width="80%"
            height="80%"
            top="40px"
            modal="false">
            <div class="dialog-container">
                <div class="ONE">
                    <div class="left">
                        <p>回复列表管理</p>
                    </div>
                    <div class="right">
                        <el-input v-model.trim="replyKeyword" clearable @keyup.enter.native="searchReply()"></el-input>
                        <el-button plain type="primary" @click="searchReply()">搜索</el-button>
                    </div>
                </div>

                <div class="TWO">
                    <el-table :data="replyViewList" border highlight-current-row style="width: 100%; text-algin: center;">
                        <el-table-column prop="id" label="ID" width="80" sortable header-align="center" align="center"></el-table-column>

                        <el-table-column prop="date" label="回复日期" width="200" sortable header-align="center" align="center">
                            <template slot-scope="scope">
                                <i class="el-icon-time"></i>
                                <span style="margin-left: 10px">{{ scope.row.date }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="authorId" label="用户ID" width="100" sortable header-align="center" align="center"></el-table-column>

                        <el-table-column prop="user_pic" label="头像" width="80"  header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-avatar
                                    v-if="scope.row.author_pic"
                                    :size="35"
                                    :src="require('../../../public/user_pic/' + scope.row.author_pic)"
                                    style="border: solid 1px black;"
                                ></el-avatar>
                                <el-avatar
                                    v-if="!scope.row.author_pic"
                                    :size="35"
                                    :src="require('../../../public/no_pic/noAvatar.png')"
                                    style="border: solid 1px black;"
                                ></el-avatar>
                            </template>
                        </el-table-column>

                        <el-table-column prop="authorNickname" label="昵称" width="120" header-align="center" align="center"> </el-table-column>

                        <el-table-column prop="comments" label="回复" header-align="center" align="center"> </el-table-column>

                        <el-table-column label="操作" width="100" header-align="center" align="center">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                type="danger"
                                @click="handleDeleteReply(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="THREE">
                    <el-pagination
                    @current-change="handleReplyCurrentChange"
                    :current-page="currentReplyPage"
                    :page-size="replyPageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="replyList.length">
                    </el-pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="replyDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import http from '../../utils/request'
export default {
    data() {
        return {
            commentsList: [],
            viewList: [],
            viewDialogVisible: false,
            view: {},
            keyword: '',
            replyKeyword: '',
            pageSize: 8,
            replyPageSize: 5,
            currentPage: 1,
            currentReplyPage: 1,
            replyDialogVisible: false,
            replyList: [],
            replyViewList: [],
            currentData: {}
        }
    },
    methods: {
        getCommentsList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getCommentsList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    this.commentsList = [...res.data.data]
                    this.viewList = [...this.commentsList.slice(this.currentPage*this.pageSize-this.pageSize, this.currentPage*this.pageSize)]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        toIndex() {
            this.$router.push('/adminIndex')
        },
        // 查看回复
        handleViewReply(index, row) {
            this.replyDialogVisible = true
            this.currentData = {...row}
            // 获取回复列表
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getReplyList',
                params: {
                    higherLevelId: row.id
                }
            }).then((res) => {
                if(res.data.status === 0){
                    this.replyList = [...res.data.data]
                    this.replyViewList = [...this.replyList.slice(this.currentReplyPage*this.replyPageSize-this.replyPageSize, this.currentReplyPage*this.replyPageSize)]
                }else{
                    this.$message.warning('获取回复列表失败！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 删除留言
        handleDelete(index, row) {
            console.log(row, 'row');

            if(this.$store.getters.getUserInfo.adminCommentLOA === '1'){
                this.$confirm('此操作将永久删除该留言及其回复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除留言数据
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/my/deleteComment',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            id: row.id,
                            higherLevelId: row.id
                        }
                    }).then((res) => {
                        if(res.data.status === 1){
                            this.$message.warning('删除留言失败，请稍后再试！')
                        }else if(res.data.status === 0){
                            if(this.keyword){
                                this.$store.dispatch('asyncUpdatePage', this.currentPage)
                                this.$message.success('删除留言成功！')
                                this.search()
                                this.currentPage = this.$store.getters.getPage
                                this.$store.dispatch('asyncUpdatePage', '')
                                this.viewList = [...this.commentsList.slice(this.currentPage*this.pageSize-this.pageSize, this.currentPage*this.pageSize)]
                            }else{
                                this.$message.success('删除留言成功！')
                                this.getCommentsList()
                            }
                        }
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })
                }).catch(() => {
                    this.$message.info('已取消删除！')     
                })
            }else{
                this.$message.warning('您没有评论管理权限！')
            }  
        },
        // 删除回复
        handleDeleteReply(index, row) {
            console.log(row, 'row');

            if(this.$store.getters.getUserInfo.adminCommentLOA === '1'){
                this.$confirm('此操作将永久删除该回复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 父级留言的回复数-1
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/my/deleteReply',
                        headers: {
                            Authorization: this.$store.getters.getUserToken ,
                        },
                        params: {
                            id: row.higherLevelId
                        }
                    }).then((res) => {
                        
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })

                    // 删除留言数据
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/my/deleteComment',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            id: row.id,
                            higherLevelId: row.id
                        }
                    }).then((res) => {
                        if(res.data.status === 1){
                            this.$message.warning('删除留言失败，请稍后再试！')
                        }else if(res.data.status === 0){
                            this.$message.success('删除留言成功！')
                            this.replyDialogVisible = false
                            this.replyKeyword = ''
                        }
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })
                }).catch(() => {
                    this.$message.info('已取消删除！')     
                })
            }else{
                this.$message.warning('您没有评论管理权限！')
            }              
        },   
        // 分页
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
            this.currentPage = val
            this.viewList = [...this.commentsList.slice(this.currentPage*this.pageSize-this.pageSize, this.currentPage*this.pageSize)]
        },
        // 回复分页
        handleReplyCurrentChange(val) {
            // console.log(`当前页: ${val}`)
            this.currentReplyPage = val
            this.replyViewList = [...this.replyList.slice(this.currentReplyPage*this.replyPageSize-this.replyPageSize, this.currentReplyPage*this.replyPageSize)]
        },
        // 搜索
        search() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getKeywordCommentList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    keyword: this.keyword
                }
            }).then((res) => {
                if(res.data.status === 0){
                    this.commentsList = [...res.data.data]
                    this.viewList = [...this.commentsList.slice(0,this.pageSize)]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 回复搜索
        searchReply() {
            console.log(this.currentData, 'row');
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getKeywordReplyList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    keyword: this.replyKeyword,
                    higherLevelId: this.currentData.id,
                }
            }).then((res) => {
                if(res.data.status === 0){
                    this.replyList = [...res.data.data]
                    this.replyViewList = [...this.replyList.slice(0,this.replyPageSize)]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        }
    },
    mounted() {
        this.getCommentsList()
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
        100%{
            margin-left: 0px;
        }
    }
    .ONE {
        height: 6%;
        padding: 2px 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .left{
            height: 100%;
            display: flex;
            align-items: center;
            color: black;
            .link{
                color: black;
            }
            .link:hover{
                cursor: pointer;
                text-decoration: underline;
            }
        }
        .right{
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
    .TWO::-webkit-scrollbar {display:none}
    .THREE {
        height: 6%;
    }

    .reply-dialog {
        /deep/.el-dialog__body {
            padding: 0 20px;
        }
        .dialog-container {
            height: 500px;
            .ONE {
                height: 8%;
                padding: 2px 20px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .left{
                    height: 100%;
                    display: flex;
                    align-items: center;
                    color: black;
                }
                .right{
                    display: flex;
                    flex-direction: row;
                    .el-input {
                        margin-right: 20px;
                    }
                }
                // background: pink;
            }
            .TWO {
                height: 86%;
                overflow-y: scroll;
                // background: firebrick;
            }
            .TWO::-webkit-scrollbar {display:none}
            .THREE {
                height: 6%;
            }
        }
    }
}
</style>