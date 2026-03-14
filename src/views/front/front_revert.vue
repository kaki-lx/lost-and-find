<template>
    <div class="container">
        <!-- <h1>我是前台claim页（认领）</h1> -->

        <!-- 流程图 -->
        <div class="process" v-if="!isEdit">
            <el-steps :active="4" simple>
                <el-step title="申请归还" icon="el-icon-edit"></el-step>
                <el-step title="等待审核" icon="el-icon-s-order"></el-step>
                <el-step title="私下联系" icon="el-icon-phone-outline"></el-step>
                <el-step title="确认归还" icon="el-icon-success"></el-step>
            </el-steps>
        </div>

        <div class="process" v-if="isEdit">
            <el-steps :active="4" simple>
                <el-step title="发布信息" icon="el-icon-upload2"></el-step>
                <el-step title="等待归还" icon="el-icon-loading"></el-step>
                <el-step title="等待审核" icon="el-icon-s-order"></el-step>
                <el-step title="私下联系" icon="el-icon-phone-outline"></el-step>
            </el-steps>
        </div>

        <!-- 筛选、搜索栏 -->
        <div class="search" style="justify-content: center; padding-top: 10px"
            :style="{ display: isEdit ? 'none' : 'flex' }">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="物品类型">
                    <el-select v-model="searchForm.type" ref="typeSelect" placeholder="物品类型" style="width: 110px"
                        @change="typeSelectChange()" @clear="typeSelectClear()" clearable filterable>
                        <el-option v-for="item in type" :key="item.label" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="关键词">
                    <el-input v-model.trim="searchForm.keyword" placeholder="物品名称/拾取地点" @change="keywordInput()"
                        @clear="keywordClear()" clearable></el-input>
                </el-form-item>

                <el-form-item>
                    <!-- <el-button type="primary" icon="el-icon-search" @click="searchBtn()">查询</el-button> -->
                    <el-button type="primary" @click="handleIssue()">我要发布寻物信息</el-button>
                </el-form-item>
            </el-form>


        </div>


        <!-- 招领信息发布 DIv -->
        <div class="edit-form">
            <el-form :model="form" :rules="rules" ref="ruleForm" v-if="isEdit" style="width:100%">
                <div><el-divider content-position="center" style="font-size: 20px">发布寻物启事信息</el-divider></div>

                <el-row :gutter="20" style="margin-top: 40px">
                    <el-col :span="2"></el-col>
                    <el-col :span="10">
                        <el-form-item label="简述" prop="resume" :label-width="formLabelWidth">
                            <el-input v-model.trim="form.resume" placeholder="请输入物品简述" type="text" maxlength="8"
                                show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="地点" prop="location" :label-width="formLabelWidth">
                            <el-input v-model.trim="form.location" placeholder="请输入丢失地点" type="text" maxlength="10"
                                show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="丢失时间" prop="date" :label-width="formLabelWidth">
                            <el-date-picker style="width: 100%" v-model="form.date" type="date" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
                            <el-select v-model="form.type" placeholder="请选择物品类型" style="width:100%">
                                <el-option v-for="item in type" :key="item.label" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2"></el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="2"></el-col>
                    <el-col :span="20">
                        <el-form-item label="详情" prop="description" :label-width="formLabelWidth">
                            <el-input type="textarea" resize="none" :rows="3" placeholder="请输入物品的详细特征（供管理员参考）"
                                v-model.trim="form.description" maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2"></el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="2"></el-col>
                    <el-col :span="20">
                        <el-form-item label="图片" prop="article_pic" :label-width="formLabelWidth">
                            请上传物品图片，尽可能出现物品特点，注意隐私！（至多1张）
                            <el-upload action="http://127.0.0.1:3007/my/uploadRevertPic" ref="upload"
                                :headers="myHeaders" :auto-upload="false" :limit="limit" :file-list="files"
                                list-type="picture-card" :on-change="uploadChange" :on-remove="uploadRemove">
                                <i class="el-icon-plus"></i>
                                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2"></el-col>
                </el-row>

                <el-row :gutter="20">
                    <!-- <el-col :span="6"></el-col> -->
                    <el-col :span="24">
                        <el-form-item style="display:flex; justify-content:center;">
                            <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                            <el-button type="info" @click=" isEdit = false">取消</el-button>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6"></el-col> -->
                </el-row>



            </el-form>
        </div>


        <!-- 招领信息展示 Div -->
        <div v-if="!isEdit">
            <!-- title 标题 -->
            <div><el-divider content-position="center">寻物启事信息列表</el-divider></div>

            <!-- card 卡片 -->
            <el-row class="el-row" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
                <el-card class="box-card" v-for="item in revertList.slice(0, count)" :key="item.id" shadow="hover">
                    <div class="resume-btn">
                        <div class="resume">{{ item.resume }}</div>
                        <div style="display: flex; gap: 5px;">
                            <el-button type="primary" size="mini" @click="handleRevert(item)"
                                v-show="isLogin">归还</el-button>
                            <el-button type="danger" size="mini" @click="handleReport(item, 2)"
                                v-show="isLogin">举报</el-button>
                        </div>
                    </div>
                    <hr>
                    <div class="article_pic" style="text-align: center;">

                        <el-image v-if="item.article_pic"
                            :preview-src-list="[require('../../../public/revert_pic/' + item.article_pic)]"
                            style="height: 120px;width: 120px;"
                            :src="require('../../../public/revert_pic/' + item.article_pic)"></el-image>
                        <el-image v-if="!item.article_pic" style="height: 120px;width: 120px;"
                            :src="require('../../../public/no_pic/noArticle.png')"></el-image>

                    </div>
                    <!-- <div class="describe">详情：{{ item.description }}</div> -->
                    <div class="location-date">
                        <div class="location" style=""><i class="el-icon-location"></i>{{ item.location }}</div>
                        <div class="date" style="">{{ item.date }}</div>
                    </div>
                </el-card>
            </el-row>

            <p v-if="loading" class="Hint_text">加载中...</p>
            <p v-if="noMore" class="Hint_text">没有更多了</p>

        </div>

        <el-dialog class="describe-dialog" title="申请验证" :visible.sync="describeDialogVisible" width="30%" top="50px">
            <div class="dialog-container">
                <el-descriptions class="margin-top" title="" :column="1">
                    <el-descriptions-item label="物品简述">{{ currentItem.resume }}</el-descriptions-item>
                    <el-descriptions-item label="拾取地点">{{ currentItem.location }}</el-descriptions-item>
                    <el-descriptions-item label="拾取时间">{{ currentItem.date }}</el-descriptions-item>
                </el-descriptions>
                <el-input type="textarea" resize="none" :rows="5" placeholder="请输入物品特征点（尽可能多、详细）"
                    v-model="describeInput"></el-input>
                <el-button type="primary" @click="submitDescribe">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog class="report-dialog" title="举报" :visible.sync="reportDialogVisible" width="30%" top="50px">
            <div class="dialog-container">
                <el-descriptions class="margin-top" title="" :column="1">
                    <el-descriptions-item label="举报对象">{{ reportItem.resume }}</el-descriptions-item>
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
import { getCurrentDate } from '../../utils/methods'
export default {
    data() {
        return {
            isLogin: '',
            isEdit: false,
            revertList: [],
            count: 12,
            loading: false,
            formLabelWidth: '120px',
            form: {
                resume: '',     // 物品简述
                description: '',// 物品详细信息
                type: '',       // 物品类型
                location: '',   // 丢失地点
                article_pic: '',// 图片
                date: '',       // 丢失时间
            },
            rules: {
                resume: [
                    { required: true, message: '请输入物品简述', trigger: 'blur' },
                ],
                description: [
                    { required: true, message: '请输入物品详细信息', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请输入物品类型', trigger: 'blur' },
                ],
                location: [
                    { required: true, message: '请输入丢失地点', trigger: 'blur' },
                ],
                // article_pic: [
                //     { required: true, message: '请上传物品图片', trigger: 'blur' },
                // ],
                date: [
                    { required: true, message: '请输入丢失时间', trigger: 'blur' },
                ],
            },
            type: [],
            searchForm: {
                keyword: '',
                type: '',
            },
            limit: 1,
            files: [],
            myHeaders: { Authorization: this.$store.getters.getUserToken },
            describeDialogVisible: false,
            describeInput: '',
            currentItem: {},
            reportDialogVisible: false,
            reportItem: {},
            reportReason: '',
            reportType: 0
        }
    },
    methods: {
        // 获取寻物信息列表
        getRevertList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/api/public/getRevert',
            }).then((res) => {
                // 将招领信息列表数据存入 store 中
                this.$store.dispatch('asyncUpdateRevertList', res.data.data)
                // 从 store 中获取招领信息列表
                this.revertList = this.$store.getters.getRevertList
                // console.log(res.data.data, "#获取revertList成功")
            }).catch((err) => {
                console.log(err, "#获取revertList失败")
            })
        },
        // 判断登录状态
        judgeLogin() {
            if (this.$store.getters.getUserInfo.id && this.$store.getters.getUserToken) { this.isLogin = true }
            else { this.isLogin = false }
        },
        typeSelectClear() {
            if (this.searchForm.keyword) {
                this.revertList = this.$store.getters.getRevertList
                const revertList_resume = this.revertList.filter(item => item.resume.includes(this.searchForm.keyword))
                const revertList_location = this.revertList.filter(item => item.location.includes(this.searchForm.keyword))
                this.revertList = [...revertList_resume, ...revertList_location]
                this.revertList = this.revertList.filter(function (item, index, arr) { return arr.indexOf(item, 0) === index })  // 数据去重
            } else {
                this.revertList = this.$store.getters.getRevertList
            }
        },
        typeSelectChange() {
            if (this.searchForm.keyword) {
                // 1.初始化
                this.revertList = this.$store.getters.getRevertList
                // 2.对关键词进行筛选
                const revertList_resume = this.revertList.filter(item => item.resume.includes(this.searchForm.keyword))
                const revertList_location = this.revertList.filter(item => item.location.includes(this.searchForm.keyword))
                this.revertList = [...revertList_resume, ...revertList_location]
                this.revertList = this.revertList.filter(function (item, index, arr) { return arr.indexOf(item, 0) === index })  // 数据去重
                // 3.对类型进行筛选
                this.revertList = this.revertList.filter(item => item.type == this.searchForm.type)
            } else {
                this.revertList = this.$store.getters.getRevertList
                this.revertList = this.revertList.filter(item => item.type == this.searchForm.type)
            }
        },
        keywordClear() {
            if (this.searchForm.type) {
                this.revertList = this.$store.getters.getRevertList
                this.revertList = this.revertList.filter(item => item.type == this.searchForm.type)
            } else {
                this.revertList = this.$store.getters.getRevertList
            }
        },
        keywordInput() {
            if (this.searchForm.keyword) {
                if (this.searchForm.type) {
                    // 1.初始化
                    this.revertList = this.$store.getters.getRevertList
                    // 2.对类型进行筛选
                    this.revertList = this.revertList.filter(item => item.type == this.searchForm.type)
                    // 3.对关键词进行筛选
                    const revertList_resume = this.revertList.filter(item => item.resume.includes(this.searchForm.keyword))
                    const revertList_location = this.revertList.filter(item => item.location.includes(this.searchForm.keyword))
                    this.revertList = [...revertList_resume, ...revertList_location]
                    this.revertList = this.revertList.filter(function (item, index, arr) { return arr.indexOf(item, 0) === index })  // 数据去重
                } else {
                    // 1.初始化
                    this.revertList = this.$store.getters.getRevertList
                    // 2.对关键词进行筛选
                    const revertList_resume = this.revertList.filter(item => item.resume.includes(this.searchForm.keyword))
                    const revertList_location = this.revertList.filter(item => item.location.includes(this.searchForm.keyword))
                    this.revertList = [...revertList_resume, ...revertList_location]
                    this.revertList = this.revertList.filter(function (item, index, arr) { return arr.indexOf(item, 0) === index })  // 数据去重
                }
            } else {
                if (this.searchForm.type) {
                    // 1.初始化
                    this.revertList = this.$store.getters.getRevertList
                    // 2.对类型进行筛选
                    this.revertList = this.revertList.filter(item => item.type == this.searchForm.type)
                } else {
                    // 1.初始化
                    this.revertList = this.$store.getters.getRevertList
                }
            }
        },
        // 发布 按钮事件
        handleIssue() {
            if (this.isLogin) {
                if (this.$store.getters.getUserInfo.publishLOA == '1') {
                    this.isEdit = true
                    this.files = []
                } else {
                    this.$message.warning('您没有发布权限！')
                }
            } else {
                this.$message({
                    showClose: true,
                    message: '未登录状态 请先登陆！',
                    type: 'warning'
                })
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 如果 用户上传了图片 -> 启动upload -> MySQL写入数据（带article_pic的值为图片名）
                    if (this.files.length == 1) {
                        this.$refs.upload.submit()
                        http({
                            method: 'post',
                            url: 'http://127.0.0.1:3007/my/addRevert',
                            headers: {
                                Authorization: this.$store.getters.getUserToken,
                            },
                            params: {
                                createDate: getCurrentDate(),
                                initiatorId: this.$store.getters.getUserInfo.id,
                                initiatorNickname: this.$store.getters.getUserInfo.nickname,
                                initiatorPhone: this.$store.getters.getUserInfo.phone,
                                initiatorWechat: this.$store.getters.getUserInfo.wechat,
                                initiatorQQ: this.$store.getters.getUserInfo.qq,
                                isFound: 1,
                                type: this.form.type,
                                date: this.form.date,
                                location: this.form.location,
                                resume: this.form.resume,
                                description: this.form.description,
                                article_pic: this.files[0].name,
                            }
                        }).then((res) => {
                            if (res.data.status == 0) {
                                this.resetForm('ruleForm')
                                this.isEdit = false
                                this.$message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: 'success'
                                })
                                this.getRevertList().then(
                                    console.log('刷新列表信息成功')
                                )
                            } else if (res.data.status == 1) {
                                this.$message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: 'error'
                                })
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    } else {
                        // 如果 用户没有上传图片 -> MySQL写入数据（不带article_pic的值）
                        http({
                            method: 'post',
                            url: 'http://127.0.0.1:3007/my/addRevert',
                            headers: {
                                Authorization: this.$store.getters.getUserToken,
                            },
                            params: {
                                createDate: getCurrentDate(),
                                initiatorId: this.$store.getters.getUserInfo.id,
                                initiatorNickname: this.$store.getters.getUserInfo.nickname,
                                initiatorPhone: this.$store.getters.getUserInfo.phone,
                                initiatorWechat: this.$store.getters.getUserInfo.wechat,
                                initiatorQQ: this.$store.getters.getUserInfo.qq,
                                isFound: 1,
                                type: this.form.type,
                                date: this.form.date,
                                location: this.form.location,
                                resume: this.form.resume,
                                description: this.form.description,
                            }
                        }).then((res) => {
                            if (res.data.status == 0) {
                                this.resetForm('ruleForm')
                                this.isEdit = false
                                this.$message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: 'success'
                                })
                                this.getRevertList()
                            } else if (res.data.status == 1) {
                                this.$message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: 'error'
                                })
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleRevert(item) {
            if (item.initiatorId == this.$store.getters.getUserInfo.id) {
                this.$message({
                    showClose: true,
                    message: '归还失败，这是你发布的信息！',
                    type: 'error'
                })
                return
            }
            if (this.$store.getters.getUserInfo.revertLOA == '0') {
                this.$message.warning('您没有归还权限！')
                return
            }

            this.$confirm('你确定该物品是你捡到的物品吗？', '申请归还', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.describeDialogVisible = true
                this.currentItem = { ...item }
            }).catch(action => {
                this.$message({
                    showClose: true,
                    type: 'info',
                    message: action === 'cancel' ? '已取消' : '已关闭'
                })
            })
        },
        submitDescribe() {
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/my/handleRevert',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    id: this.currentItem.id,
                    revertDate: getCurrentDate(),
                    handlerDescribe: this.describeInput,
                    handlerId: this.$store.getters.getUserInfo.id,
                    handlerNickname: this.$store.getters.getUserInfo.nickname,
                    handlerPhone: this.$store.getters.getUserInfo.phone,
                    handlerWechat: this.$store.getters.getUserInfo.wechat,
                    handlerQQ: this.$store.getters.getUserInfo.qq,
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.describeDialogVisible = false
                    this.describeInput = ''
                    this.$alert('可在 个人中心 -> 任务管理 中查看任务详情。', '申请成功', {
                        confirmButtonText: '确定'
                    })
                    this.getRevertList()
                }
            }).catch((err) => {
                console.log(err);
            })
        },
        uploadChange(file) {
            const isJPGorPNG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
            const isLt2M = file.raw.size / 1024 / 1024 < 2
            if (!isJPGorPNG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
                this.files = []
                return
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
                this.files = []
                return
            }

            // 复刻文件信息
            // console.log(file,"file")
            this.files.push(file)
            // console.log(this.files,"#files")
        },
        uploadRemove() {
            this.files.pop()
        },
        load() {
            this.loading = true
            setTimeout(() => {
                this.count += 8
                this.loading = false
            }, 2000)
        },
        // 处理举报
        handleReport(item, type) {
            this.reportItem = { ...item }
            this.reportType = type
            this.reportDialogVisible = true
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
        // 获取招领信息列表
        this.getRevertList()
        this.judgeLogin()
        this.type = [...this.$store.getters.getType]
    },

    computed: {
        noMore() {
            return this.count >= this.revertList.length
        },
        disabled() {
            return this.loading || this.noMore
        }
    },

    watch: {

    }
}
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;
    // overflow: hidden;

    .process {
        width: 100%;
        padding: 10px 0 0 0;
        display: flex;
        justify-content: center;

        .el-steps--simple {
            background: white;
        }

        .el-steps {
            width: 50%;
        }
    }

    .banner-container {
        width: 100%;

        .banner-left {

            img {
                width: 600px;
                height: 300px;
            }
        }
    }

    .demo-form-inline {
        .el-form-item {
            margin-bottom: 0px;
        }
    }

    .edit-form {
        display: flex;

        .el-row {
            display: flex;
        }

        .el-form-item {
            margin-bottom: 18px;
        }
    }

    .el-divider {
        background-color: black;

        .el-divider__text {
            // title 字体
            font-size: 20px;
            background-color: rgb(244, 244, 244);
        }
    }

    .el-row {
        margin-left: 0px;
        margin-right: 0px;
        display: flex;
        flex-wrap: wrap;

        /deep/ .el-card__header {
            height: 25%;
            padding: 10px 20px;
        }

        /deep/ .el-card__body {
            padding: 10px;
        }

        .box-card {
            width: 23.9%;
            margin: 5px;
        }

        .article_pic {
            .el-image {
                /deep/.el-image__inner {
                    object-fit: contain;
                }
            }
        }

        .resume-btn {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .resume {
                font-size: 15px;
                font-weight: bold;
                // 描述文字至多显示一行 ↓  -----------多出部分隐藏 显示为省略号
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 1;
                line-clamp: 1;
                text-overflow: ellipsis;
                // 描述文字至多显示两行 ↑  -----------
            }
        }

        .describe {
            font-size: 13px;
            // 描述文字至多显示三行 ↓  -----------多出部分隐藏 显示为省略号
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            text-overflow: ellipsis;
            // 描述文字至多显示两行 ↑  -----------
            // border: solid 1px black;
        }

        .location-date {
            margin-top: 5px;
            font-size: 12px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
    }

    .Hint_text {
        text-align: center;
        font-size: 20px;
        padding: 30px 0;
        color: #9c9c9c;
    }

    .describe-dialog {
        .dialog-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            //.el-input {}

            .el-button {
                margin-top: 10px;
            }
        }
    }
}
</style>