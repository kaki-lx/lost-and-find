<template>
    <div class="container">
        <el-row :gutter="20" class="ONE">
            <el-col :span="16" class="comments">
                <div class="operation">
                    <div class="avatar">
                        <el-avatar v-if="userInfo.user_pic" :size="60"
                            :src="require('../../../public/user_pic/' + userInfo.user_pic)"></el-avatar>
                        <el-avatar v-if="!userInfo.user_pic" :size="60"
                            :src="require('../../../public/no_pic/noAvatar.png')"></el-avatar>
                    </div>

                    <div class="editComment">
                        <el-input type="textarea" resize="none" placeholder="请输入内容" v-model="textarea">
                        </el-input>
                        <el-button @click="sendBtn">发布</el-button>
                    </div>
                </div>

                <div class="showComments">
                    <div class="data-container" v-for="item in commentsList" :key="item.id">
                        <div class="left-avatar">
                            <el-avatar v-if="item.author_pic" :size="50"
                                :src="require('../../../public/user_pic/' + item.author_pic)"></el-avatar>
                            <el-avatar v-if="!item.author_pic" :size="50"
                                :src="require('../../../public/no_pic/noAvatar.png')"></el-avatar>
                        </div>

                        <div class="right">
                            <div class="r-nickname">{{ item.authorNickname }} </div>
                            <div class="r-comments">{{ item.comments }} </div>
                            <div class="r-date">{{ item.date.slice(0, 16) }}
                                <el-image :id="item.id" :src="supportSrc[0]" @click.once="supprot(item)"></el-image>
                                {{ item.support }}
                                <el-image :src="require('../../assets/reply.png')" @click="reply(item)"></el-image>{{
                                    item.reply }}
                                <el-button type="text" @click="deleteBtn(item)"
                                    v-if="isLogin == true && userInfo.id == item.authorId">删除</el-button>
                                <el-button type="text" @click="handleReport(item, 3)" v-show="isLogin"
                                    style="color: red;">举报</el-button>
                            </div>

                            <!-- 回复输入框 -->
                            <div class="replyComment" v-show="item.isReply">
                                <el-input type="textarea" resize="none" placeholder="请输入回复内容"
                                    v-model.trim="textarea_reply">
                                </el-input>
                                <el-button @click="sendReplyBtn(item)">发布</el-button>
                                <!-- <el-button @click="cancelReplyBtn(item)">取消</el-button> -->
                            </div>
                            <!-- 回复列表 -->
                            <el-collapse v-model="activeName" accordion @change="getReplyList(item)"
                                v-if="item.reply != 0">
                                <el-collapse-item title="展开回复" :name="item.id">
                                    <div class="reply-data-container" v-for="item in replyList" :key="item.id">
                                        <div class="reply-left-avatar">
                                            <el-avatar v-if="item.author_pic" :size="40"
                                                :src="require('../../../public/user_pic/' + item.author_pic)"></el-avatar>
                                            <el-avatar v-if="!item.author_pic" :size="40"
                                                :src="require('../../../public/no_pic/noAvatar.png')"></el-avatar>
                                        </div>
                                        <div class="reply-right">
                                            <div class="reply-r-nickname">{{ item.authorNickname }} </div>
                                            <div class="reply-r-comments">{{ item.comments }} </div>
                                            <div class="reply-r-date">{{ item.date.slice(0, 16) }}
                                                <!-- <el-image class="support" :src="item.isSupport == true ? supportSrc[1] : supportSrc[1] " @click.once="supprot(item)"></el-image>{{ item.support }} -->
                                                <el-button type="text" @click="deleteBtn(item)"
                                                    v-if="isLogin == true && userInfo.id == item.authorId">删除</el-button>
                                                <el-button type="text" @click="handleReport(item, 3)" v-show="isLogin"
                                                    style="color: red;">举报</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </div>
                </div>

                <div class="noComments" v-if="commentsList.length == 0">
                    暂无数据
                </div>
            </el-col>
        </el-row>
        <el-dialog class="report-dialog" title="举报" :visible.sync="reportDialogVisible" width="30%" top="50px"
            append-to-body>
            <div class="dialog-container">
                <el-descriptions class="margin-top" title="" :column="1">
                    <el-descriptions-item label="举报对象">{{ reportItem.authorNickname }}</el-descriptions-item>
                    <el-descriptions-item label="内容">{{ reportItem.comments }}</el-descriptions-item>
                </el-descriptions>
                <el-input type="textarea" resize="none" :rows="3" placeholder="请输入举报原因"
                    v-model="reportReason"></el-input>
                <el-button type="primary" @click="submitReport">提交举报</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import http from '../../utils/request'
export default {
    data() {
        return {
            isLogin: false,
            userInfo: {},
            textarea: '',
            textarea_reply: '',
            commentsList: [],
            replyList: [],
            supportSrc: [require('../../assets/support.png'), require('../../assets/supported.png')],
            activeName: '1',
            reportDialogVisible: false,
            reportItem: {},
            reportReason: '',
            reportType: 0
        }
    },
    methods: {
        getUserInfo() {
            this.userInfo = { ...this.$store.getters.getUserInfo }
        },
        getCommentsList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getCommentsList',
            }).then((res) => {
                if (res.data.status === 0) {
                    this.commentsList = [...res.data.data]
                    this.commentsList.forEach(item => {
                        Object.assign(item, { isSupport: false, isReply: false })
                    })
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        getCurrentDate() {
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hour = date.getHours(); // 时
            let minutes = date.getMinutes(); // 分
            let seconds = date.getSeconds() // 秒
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
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes
            }
            if (seconds >= 0 && seconds <= 9) {
                seconds = "0" + seconds
            }
            const currentDate = year + '-' + month + '-' + day + ' ' + hour + ":" + minutes + ":" + seconds
            return currentDate
        },
        sendBtn() {
            if (this.isLogin) {
                if (this.$store.getters.getUserInfo.commentsLOA === '0') {
                    this.$message.warning('您没有留言权限！')
                    this.textarea = ''
                    return
                }
                if (this.textarea != "") {
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/my/publishComment',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            date: this.getCurrentDate(),
                            authorId: this.userInfo.id,
                            author_pic: this.userInfo.user_pic,
                            authorNickname: this.userInfo.nickname,
                            comments: this.textarea,
                            level: 1,
                            support: 0,
                            reply: 0,
                        }
                    }).then((res) => {
                        if (res.data.status === 1) {
                            this.$message.warning('发布失败，请稍后再试！')
                        } else if (res.data.status === 0) {
                            this.$message.success('发布成功！')
                            this.textarea = ""
                            this.getCommentsList()
                        }
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })
                } else {
                    this.$message.warning('留言不能为空！')
                }
            } else {
                this.$message.warning('未登录状态，请先登录！')
                this.textarea = ""
            }
        },
        supprot(item) {
            document.getElementById(item.id).src = this.supportSrc[1];
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/api/public/support',
                params: {
                    id: item.id
                }
            }).then((res) => {
                if (res.data.status === 1) {
                    this.$message.warning('点赞失败！')
                } else if (res.data.status === 0) {
                    this.$message.success('点赞成功！')
                    this.getCommentsList()
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },

        reply(item) {
            item.isReply = !item.isReply
            // 强制刷新v-for的数据,可以解决v-for循环的值改变页面不刷新的问题
            this.$forceUpdate();
        },
        deleteBtn(item) {
            console.log(item, "删除的item")
            // 如果是二级评论 其一级评论的reply - 1
            if (item.level != 1) {
                http({
                    method: 'post',
                    url: 'http://127.0.0.1:3007/my/deleteReply',
                    headers: {
                        Authorization: this.$store.getters.getUserToken,
                    },
                    params: {
                        id: item.higherLevelId
                    }
                }).then((res) => {
                    if (res.data.status === 1) {
                        this.$message.warning('删除回复失败！')
                    } else if (res.data.status === 0) {
                        this.$message.success('删除回复成功！')
                        this.getCommentsList()
                    }
                }).catch((err) => {
                    console.log(err, "http请求失败");
                })
            }

            // 删除数据
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/my/deleteComment',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    id: item.id,
                    higherLevelId: item.id
                }
            }).then((res) => {
                if (res.data.status === 1) {
                    this.$message.warning('删除留言失败，请稍后再试！')
                } else if (res.data.status === 0) {
                    this.$message.success('删除留言成功！')
                    this.getCommentsList()
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })

            // 强制刷新页面
            location.reload()
        },
        getReplyList(item) {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getReplyList',
                params: {
                    higherLevelId: item.id
                }
            }).then((res) => {
                if (res.data.status === 1) {
                    this.$message.warning('获取回复列表失败！')
                } else if (res.data.status === 0) {
                    this.replyList = [...res.data.data]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        sendReplyBtn(item) {
            if (this.isLogin) {
                if (this.$store.getters.getUserInfo.commentsLOA === '0') {
                    this.$message.warning('您没有回复权限！')
                    this.textarea_reply = ''
                    return
                }
                if (this.textarea_reply != "") {
                    // 添加一条新的数据
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/my/publishCommentsReply',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            date: this.getCurrentDate(),
                            authorId: this.userInfo.id,
                            author_pic: this.userInfo.user_pic,
                            authorNickname: this.userInfo.nickname,
                            comments: this.textarea_reply,
                            level: 2,
                            support: 0,
                            reply: 0,
                            higherLevelId: item.id
                        }
                    }).then((res) => {
                        if (res.data.status === 1) {
                            this.$message.warning('回复留言失败，请稍后再试！')
                        } else if (res.data.status === 0) {
                            this.$message.success('回复留言成功！')
                            this.textarea = ""
                            this.getCommentsList()
                        }
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })

                    // 修改被回复的评论的回复数
                    let number = item.reply + 1
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/api/public/reply',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            reply: number,
                            id: item.id
                        }
                    }).then((res) => {
                        if (res.data.status === 1) {
                            this.$message.warning('回复留言失败，请稍后再试！')
                        } else if (res.data.status === 0) {
                            this.$message.success('回复留言成功！')
                            this.getCommentsList()
                        }
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })
                    this.textarea_reply = ""
                } else {
                    this.$message.warning("回复不能为空！")
                }
            } else {
                this.$message.warning('未登录状态，请先登录！')
                this.textarea_reply = ""
            }
        },
        // 处理举报
        handleReport(item, type) {
            console.log('handleReport called', item, type)
            this.reportItem = { ...item }
            this.reportType = type
            this.reportDialogVisible = true
            console.log('reportDialogVisible:', this.reportDialogVisible)
        },
        // 提交举报
        submitReport() {
            if (!this.reportReason) {
                this.$message.warning('请输入举报原因！')
                return
            }
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/api/public/report',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                data: {
                    report_type: this.reportType,
                    target_id: this.reportItem.id,
                    reporter_id: this.$store.getters.getUserInfo.id,
                    reporter_nickname: this.$store.getters.getUserInfo.nickname,
                    reason: this.reportReason
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.reportDialogVisible = false
                    this.reportReason = ''
                    this.$message.success(res.data.message)
                } else {
                    this.$message.error(res.data.message)
                }
            }).catch((err) => {
                console.log(err)
                this.$message.error('举报失败，请稍后再试！')
            })
        }
    },
    mounted() {
        this.getUserInfo()
        this.getCommentsList()
        // 判断当前是否为登录状态
        if (this.$store.getters.getUserInfo.nickname != "" && this.$store.getters.getUserToken) {
            this.isLogin = true
        }
    },
}
</script>

<style lang="less" scoped>
.container {
    // border: 1px solid salmon;
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

    .ONE {
        height: 100%;
        // border: 1px solid black;
        padding: 10px;
        display: flex;
        justify-content: center;

        .comments {
            height: 100%;

            // border: 1px solid rgb(0, 255, 115);
            .operation {
                height: 11%;
                display: flex;
                flex-direction: row;
                // border: 1px solid rgb(30, 7, 229);


                .avatar {
                    width: 12%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .editComment {
                    width: 88%;
                    height: 100%;
                    display: flex;
                    justify-content: space-between;

                    .el-textarea {
                        width: 86%;
                        height: 100%;

                        /deep/.el-textarea__inner {
                            height: 100%;
                        }
                    }

                    .el-button {
                        width: 12%;
                        height: 100%;
                        color: white;
                        font-size: 1em;
                        letter-spacing: 6px;
                        border-radius: 5px;
                        background-color: rgb(136, 236, 221);
                    }

                    .el-button:hover {
                        cursor: pointer;
                        background-color: rgb(104, 205, 190, 0.8);
                    }
                }
            }

            .showComments {
                height: auto;
                padding: 5px;
                // border: 1px solid rgb(240, 10, 156);

                .data-container {
                    height: auto;
                    padding: 10px 0 10px 0;
                    display: flex;
                    flex-direction: row;

                    .left-avatar {
                        width: 12%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .right {
                        width: 88%;
                        border-bottom: 2px solid #ccc;
                        display: flex;
                        flex-direction: column;

                        .r-nickname {
                            color: rgb(97, 102, 109);
                            padding: 10px 0;
                        }

                        .r-comments {
                            padding: 5px 0;
                        }

                        .r-date {
                            padding: 0 0 5px 0;
                            font-size: 0.9em;
                            color: #757575;
                            display: flex;
                            align-items: center;

                            .el-image {
                                height: 15px;
                                width: 15px;
                                padding: 0 5px 0 30px;
                            }

                            .el-image:hover {
                                cursor: pointer;
                            }

                            .el-button {
                                padding: 0 0 0 30px;
                            }
                        }

                        .replyComment {
                            width: 100%;
                            height: 100%;
                            padding: 5px 0;
                            display: flex;
                            justify-content: space-around;
                            align-items: center;

                            .el-textarea {
                                width: 86%;
                                height: 100%;

                                /deep/.el-textarea__inner {
                                    height: 100%;
                                }
                            }

                            .el-button {
                                width: 12%;
                                height: 100%;
                                color: white;
                                font-size: 1em;
                                letter-spacing: 6px;
                                border-radius: 5px;
                                background-color: rgb(136, 236, 221);
                            }

                            .el-button:hover {
                                cursor: pointer;
                                background-color: rgb(104, 205, 190, 0.8);
                            }
                        }

                        .el-collapse {

                            .reply-data-container {
                                height: auto;
                                padding: 10px 0 10px 0;
                                display: flex;
                                flex-direction: row;

                                .reply-left-avatar {
                                    width: 10%;
                                    height: 100%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }

                                .reply-right {
                                    width: 88%;
                                    border-bottom: 2px solid #ccc;
                                    display: flex;
                                    flex-direction: column;

                                    .reply-r-nickname {
                                        color: rgb(97, 102, 109);
                                        padding: 5px 0;
                                    }

                                    .reply-r-comments {
                                        padding: 2px 0;
                                    }

                                    .reply-r-date {
                                        padding: 0 0 5px 0;
                                        font-size: 0.9em;
                                        color: #757575;
                                        display: flex;
                                        align-items: center;

                                        .el-image {
                                            height: 15px;
                                            width: 15px;
                                            padding: 0 5px 0 30px;
                                        }

                                        .el-image:hover {
                                            cursor: pointer;
                                        }

                                        .el-button {
                                            padding: 0 0 0 30px;
                                        }
                                    }
                                }
                            }

                            /deep/.el-collapse-item__header {
                                background-color: rgb(244, 244, 244);
                                height: 20px;
                                line-height: 20px;

                                // color: #409EFF;
                                .el-collapse-head-8879 {
                                    color: #409EFF;
                                }
                            }

                            /deep/.el-collapse-item__content {
                                background-color: rgb(244, 244, 244);
                                padding-bottom: 0px;
                            }
                        }

                    }
                }

            }

            .noComments {
                text-align: center;
                font-weight: bolder;
                color: #666;
                font-size: 1.5em;
                padding: 50px 0;
            }
        }
    }
}
</style>