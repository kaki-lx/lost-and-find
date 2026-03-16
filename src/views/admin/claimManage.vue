<template>
    <!-- <h1>我是招领信息管理页</h1> -->
    <div class="container">
        <div class="ONE">
            <div class="left">
                <p><span class="link" @click="toIndex">首页</span> > 数据管理 > 招领信息管理</p>
            </div>
            <div class="right">
                <el-input v-model.trim="keyword" clearable @keyup.enter.native="search()"></el-input>
                <el-button plain type="primary" @click="search()">搜索</el-button>
            </div>
        </div>

        <div class="TWO">
            <el-table :data="viewList" border highlight-current-row style="width: 100%; text-align: center;">
                <el-table-column prop="id" label="ID" width="80" sortable header-align="center"
                    align="center"></el-table-column>

                <el-table-column prop="createDate" label="发布日期" width="190" sortable header-align="center"
                    align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="initiatorNickname" label="发布人" sortable width="100" header-align="center"
                    align="center">
                </el-table-column>

                <el-table-column prop="" label="物品描述" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p> {{ scope.row.resume }} </p>
                        <p> {{ scope.row.description }}</p>
                    </template>
                </el-table-column>

                <el-table-column prop="article_pic" label="物品图片" width="110" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.article_pic"
                            :preview-src-list="[require('../../../public/claim_pic/' + scope.row.article_pic)]"
                            style="height: 80px;width: 80px;"
                            :src="require('../../../public/claim_pic/' + scope.row.article_pic)"></el-image>
                        <el-image v-if="!scope.row.article_pic" style="height: 60px;width: 60px;"
                            :src="require('../../../public/no_pic/noArticle.png')"></el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="handlerNickname" label="认领人" sortable width="100" header-align="center"
                    align="center">
                </el-table-column>

                <el-table-column prop="isFound" label="状态" sortable width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-tag class="isFoundTag"
                            :type="scope.row.isFound == 1 ? 'info' : (scope.row.isFound == 0 ? 'success' : (scope.row.isFound == 2 ? 'warning' : 'primary'))"
                            disable-transitions @click="editStatus(scope.row)">
                            {{ scope.row.isFound == 1 ? '待认领' : (scope.row.isFound == 0 ? '已认领' : (scope.row.isFound
                                == 2 ? '处理中' : '申请中')) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="finishDate" label="完成日期" sortable width="190" header-align="center"
                    align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time" v-if="scope.row.finishDate"></i>
                        <span style="margin-left: 10px">{{ scope.row.finishDate }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="210" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary"
                            @click="handleView(scope.$index, scope.row)">查看</el-button>
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="THREE">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                layout="total, prev, pager, next, jumper" :total="claimList.length">
            </el-pagination>
        </div>

        <el-dialog class="view-dialog" title="失物招领信息 查看" :visible.sync="dialogVisible" width="64%" top="10px">
            <div class="dialog-container">
                <div class="top">
                    <el-steps :space="200" align-center
                        :active="view.isFound == 0 ? 4 : (view.isFound == 1 ? 1 : (view.isFound == 2 ? 3 : 2))"
                        finish-status="success">
                        <el-step title="发布" :description="view.createDate"> </el-step>
                        <el-step title="申请认领" :description="view.claimDate"> </el-step>
                        <el-step title="申请认领通过" :description="view.verifyDate"> </el-step>
                        <el-step title="确认认领" :description="view.finishDate"></el-step>
                    </el-steps>
                </div>
                <div class="bottom">
                    <div class="left">
                        <el-image v-if="view.article_pic"
                            :preview-src-list="[require('../../../public/claim_pic/' + view.article_pic)]"
                            style="height: 200px;width: 200px;"
                            :src="require('../../../public/claim_pic/' + view.article_pic)"></el-image>
                        <el-image v-if="!view.article_pic" style="height: 200px;width: 200px;"
                            :src="require('../../../public/no_pic/noArticle.png')"></el-image>
                    </div>
                    <div class="right">
                        <el-descriptions title="" border :column="2"
                            :labelStyle="{ 'width': '20%', 'text-align': 'center' }"
                            :contentStyle="{ 'width': '30%', 'text-align': 'center' }">
                            <el-descriptions-item label="招领ID">{{ view.id }}</el-descriptions-item>
                            <el-descriptions-item label="物品简述">{{ view.resume }}</el-descriptions-item>

                            <el-descriptions-item label="物品类型">{{ view.type }}</el-descriptions-item>
                            <el-descriptions-item label="丢失地点">{{ view.location }}</el-descriptions-item>
                        </el-descriptions>

                        <el-descriptions title="" border :column="1"
                            :labelStyle="{ 'width': '20%', 'text-align': 'center' }"
                            :contentStyle="{ 'width': '80%', 'text-align': 'center' }">
                            <el-descriptions-item label="丢失时间">{{ view.date }}</el-descriptions-item>
                            <el-descriptions-item label="物品详情">{{ view.description }}</el-descriptions-item>
                        </el-descriptions>

                        <el-descriptions title="" border :column="2"
                            :labelStyle="{ 'width': '20%', 'text-align': 'center' }"
                            :contentStyle="{ 'width': '30%', 'text-align': 'center' }">
                            <el-descriptions-item label="拾物者ID">{{ view.initiatorId }}</el-descriptions-item>
                            <el-descriptions-item label="认领者ID">{{ view.handlerId }}</el-descriptions-item>

                            <el-descriptions-item label="拾物者昵称">{{ view.initiatorNickname }}</el-descriptions-item>
                            <el-descriptions-item label="认领者昵称">{{ view.handlerNickname }}</el-descriptions-item>

                            <el-descriptions-item label="拾物者联系方式">{{ view.initiatorPhone }}</el-descriptions-item>
                            <el-descriptions-item label="认领者联系方式">{{ view.handlerPhone }}</el-descriptions-item>

                            <el-descriptions-item label="拾物者微信">{{ view.initiatorWechat }}</el-descriptions-item>
                            <el-descriptions-item label="认领者微信">{{ view.handlerWechat }}</el-descriptions-item>

                            <el-descriptions-item label="拾物者QQ">{{ view.initiatorQQ }}</el-descriptions-item>
                            <el-descriptions-item label="认领者QQ">{{ view.handlerQQ }}</el-descriptions-item>
                        </el-descriptions>

                    </div>
                </div>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog class="edit-dialog" title="失物招领信息 编辑" :visible.sync="editDialogVisible" width="90%" top="80px">
            <el-form ref="form" :model="form">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <!-- 图片 -->
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <div
                                    style="text-align: center;font-size: 1.2em;font-weight: bolder;margin-bottom: 10px;">
                                    物品图片
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <div class="article_pic" style="display: flex;justify-content: center;"
                                    @click="changePic">
                                    <el-image v-if="form.article_pic" style="height: 200px;width: 200px;"
                                        :src="require('../../../public/claim_pic/' + form.article_pic)"></el-image>
                                    <el-image v-if="!form.article_pic" style="height: 200px;width: 200px;"
                                        :src="require('../../../public/no_pic/noArticle.png')"></el-image>
                                </div>
                            </el-col>
                        </el-row>

                    </el-col>

                    <el-col :span="10" style="border-left: solid 1px black;">
                        <!-- 表格 左 -->
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <div
                                    style="text-align: center;font-size: 1.2em;font-weight: bolder;margin-bottom: 10px;">
                                    物品信息
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <!-- 第一列 -->
                            <el-col :span="12">
                                <el-form-item label="ID" prop="id" :label-width="formLabelWidth">{{ form.id }}
                                </el-form-item>
                                <el-form-item label="地点" prop="location" :label-width="formLabelWidth">
                                    <el-input v-model.trim="form.location" placeholder="请输入拾取地点" type="text"
                                        maxlength="10" show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                            <!-- 第二列 -->
                            <el-col :span="12">
                                <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
                                    <el-select v-model="form.type" placeholder="请选择物品类型" style="width:100%">
                                        <el-option v-for="item in type" :key="item.index" :label="item.label"
                                            :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="简述" prop="resume" :label-width="formLabelWidth">
                                    <el-input v-model.trim="form.resume" placeholder="请输入物品简述" type="text" maxlength="8"
                                        show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="详情" prop="description" :label-width="formLabelWidth">
                                    <el-input type="textarea" :rows="2" placeholder="请输入物品详细信息"
                                        v-model.trim="form.description" maxlength="30" show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <!-- 第一列 -->
                            <el-col :span="12">
                                <el-form-item label="拾取时间" prop="date" :label-width="formLabelWidth">
                                    <el-date-picker style="width: 100%" v-model="form.date" type="date"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="认领时间" prop="claimDate" :label-width="formLabelWidth">{{
                                    form.claimDate }}
                                </el-form-item>
                            </el-col>
                            <!-- 第二列 -->
                            <el-col :span="12">
                                <el-form-item label="发布时间" prop="createDate" :label-width="formLabelWidth">{{
                                    form.createDate }}
                                </el-form-item>
                                <el-form-item label="完成时间" prop="finishDate" :label-width="formLabelWidth">{{
                                    form.finishDate }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>

                    <el-col :span="10" style="border-left: solid 1px black;">
                        <!-- 表格 右 -->
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <div
                                    style="text-align: center;font-size: 1.2em;font-weight: bolder;margin-bottom: 10px;">
                                    相关用户信息
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <!-- 第一列 -->
                            <el-col :span="12">
                                <el-form-item label="拾物者ID" prop="initiatorId" :label-width="formLabelWidth">{{
                                    form.initiatorId
                                    }} </el-form-item>
                                <el-form-item label="昵称" prop="initiatorNickname" :label-width="formLabelWidth">{{
                                    form.initiatorNickname }} </el-form-item>
                                <el-form-item label="联系方式" prop="initiatorPhone" :label-width="formLabelWidth">
                                    <el-input v-model.trim="form.initiatorPhone" placeholder="请输入联系方式" type="text"
                                        maxlength="11" show-word-limit></el-input>
                                </el-form-item>
                                <el-form-item label="微信" prop="initiatorWechat" :label-width="formLabelWidth">
                                    <el-input v-model.trim="form.initiatorWechat" placeholder="请输入微信"
                                        type="text"></el-input>
                                </el-form-item>
                                <el-form-item label="QQ" prop="initiatorQQ" :label-width="formLabelWidth">
                                    <el-input v-model.trim="form.initiatorQQ" placeholder="请输入QQ"
                                        type="text"></el-input>
                                </el-form-item>
                            </el-col>
                            <!-- 第二列 -->
                            <el-col :span="12">
                                <el-form-item label="认领者ID" prop="handlerId" :label-width="formLabelWidth">{{
                                    form.handlerId }}
                                </el-form-item>
                                <el-form-item label="昵称" prop="handlerNickname" :label-width="formLabelWidth">{{
                                    form.handlerNickname }} </el-form-item>
                                <el-form-item label="联系方式" prop="handlerPhone" :label-width="formLabelWidth">
                                    <el-input v-model.trim="form.handlerPhone" placeholder="请输入联系方式" type="text"
                                        maxlength="11" show-word-limit></el-input>
                                </el-form-item>
                                <el-form-item label="微信" prop="handlerWechat" :label-width="formLabelWidth">
                                    <el-input v-model.trim="form.handlerWechat" placeholder="请输入微信"
                                        type="text"></el-input>
                                </el-form-item>
                                <el-form-item label="QQ" prop="handlerQQ" :label-width="formLabelWidth">
                                    <el-input v-model.trim="form.handlerQQ" placeholder="请输入QQ" type="text"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
                <el-button type="info" @click="cancelEdit()">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog class="articlePic-dialog" title="修改物品图片" :visible.sync="articlePicDialogVisible" width="30%">
            <span>上传物品图片
                <el-upload action="http://127.0.0.1:3007/my/uploadClaimPic" ref="upload" :headers="myHeaders"
                    :auto-upload="false" :limit="limit" :file-list="files" list-type="picture-card"
                    :on-change="uploadChange" :on-remove="uploadRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="articlePicDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureChangePic">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog class="status-dialog" title="状态修改" :visible.sync="statusDialogVisible" width="30%" top="10px">
            <div class="dialog-container">
                <el-button type="primary" :disabled="status.isFound == 1" @click="editStatusClaim">待认领</el-button>
                <el-button type="warning" :disabled="status.isFound == 2" @click="editStatusProcessing">处理中</el-button>
                <el-button type="success" :disabled="status.isFound == 0 || status.isFound == 1"
                    @click="editStatusClaimed">已认领</el-button>
            </div>
        </el-dialog>

        <el-dialog class="status-input-dialog" title="认领人ID/账号" :visible.sync="statusEditDialogVisible" width="30%"
            top="10px">
            <div class="dialog-container">
                <el-input type="text" placeholder="请输入认领人ID或账号" v-model="statusInput"></el-input>
                <el-button type="primary" @click="submitHandler">提交</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { getCurrentDate } from '@/utils/methods'
import http from "../../utils/request"
export default {
    data() {
        return {
            claimList: [],  // 列表 所有
            viewList: [],  // 分页后的列表
            view: {}, // 查看
            dialogVisible: false,
            currentPage: 1,
            pageSize: 5,
            keyword: '',
            editDialogVisible: false,
            form: {},
            formLabelWidth: '70px',
            type: [
                { label: "钥匙", value: "钥匙" },
                { label: "宠物", value: "宠物" },
                { label: "证件", value: "证件" },
                { label: "数码", value: "数码" },
                { label: "美妆", value: "美妆" },
                { label: "衣服", value: "衣服" },
                { label: "首饰", value: "首饰" },
                { label: "电器", value: "电器" },
                { label: "包包", value: "包包" },
                { label: "快递", value: "快递" },
                { label: "书籍", value: "书籍" },
                { label: "其他", value: "其他" },
            ],
            statusDialogVisible: false,
            status: {},
            statusEditDialogVisible: false,
            statusInput: '',
            articlePicDialogVisible: false,
            myHeaders: { Authorization: this.$store.getters.getUserToken },
            limit: 1,
            files: []
        }
    },
    methods: {
        getClaimList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getClaimList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.claimList = [...res.data.data]
                    this.viewList = [...this.claimList.slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize)]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        toIndex() {
            this.$router.push('/adminIndex')
        },
        // 查看
        handleView(index, row) {
            console.log(index, row);
            this.dialogVisible = true
            this.view = row
        },// 编辑
        handleEdit(index, row) {
            console.log(index, row);
            if (this.$store.getters.getUserInfo.adminDataLOA === '1') {
                // TODO
                this.form = { ...row }
                this.editDialogVisible = true
            } else {
                this.$message.warning('您没有数据管理权限！')
            }
        },
        // 删除
        handleDelete(index, row) {
            // console.log(index, row)
            if (this.$store.getters.getUserInfo.adminDataLOA === '1') {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 判断是否存在图片 如果存在则删除
                    if (row.article_pic) {
                        http({
                            method: 'post',
                            url: 'http://127.0.0.1:3007/my/deleteClaimPic',
                            headers: {
                                Authorization: this.$store.getters.getUserToken,
                            },
                            params: {
                                article_pic: row.article_pic,
                                id: row.id
                            }
                        }).then((res) => {
                            if (res.data.status === 0) {
                                console.log('文件删除成功！')
                            }
                        }).catch((err) => {
                            console.log(err, "http请求失败");
                        })
                    }

                    // 数据库删除数据
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/my/deleteClaim',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            id: row.id
                        }
                    }).then((res) => {
                        if (res.data.status === 0) {
                            this.$message.success('删除招领信息成功！')
                            this.getClaimList()
                        }
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })
                }).catch(() => {
                    this.$message.info('已取消删除！')
                })
            } else {
                this.$message.warning('您没有数据管理权限！')
            }
        },
        // 分页
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
            // console.log(val);
            this.currentPage = val
            this.viewList = [...this.claimList.slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize)]
        },
        // 搜索
        search() {
            console.log('搜索关键词:', this.keyword);
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getKeywordClaimList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    keyword: this.keyword
                }
            }).then((res) => {
                console.log('搜索结果:', res.data);
                if (res.data.status === 0) {
                    this.claimList = res.data.data || [];
                    this.viewList = this.claimList.slice(0, this.pageSize);
                    console.log('claimList长度:', this.claimList.length);
                    console.log('viewList长度:', this.viewList.length);
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 提交修改信息的表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/admin/editClaim',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            type: this.form.type,
                            location: this.form.location,
                            resume: this.form.resume,
                            description: this.form.description,
                            date: this.form.date,
                            initiatorPhone: this.form.initiatorPhone,
                            initiatorWechat: this.form.initiatorWechat,
                            initiatorQQ: this.form.initiatorQQ,
                            handlerPhone: this.form.handlerPhone,
                            handlerWechat: this.form.handlerWechat,
                            handlerQQ: this.form.handlerQQ,
                            id: this.form.id
                        }
                    }).then((res) => {
                        if (res.data.status === 0) {
                            this.editDialogVisible = false
                            this.getClaimList()
                            this.$message.success('修改招领信息成功！')
                        } else {
                            this.$message.warning('修改招领信息失败！')
                        }
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        changePic() {
            this.files = []
            this.articlePicDialogVisible = true
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
        sureChangePic() {
            if (this.files.length == 1) {
                // 上传图片
                this.$refs.upload.submit()
                // 改写数据库数据
                http({
                    method: 'post',
                    url: 'http://127.0.0.1:3007/admin/editClaim',
                    headers: {
                        Authorization: this.$store.getters.getUserToken,
                    },
                    params: {
                        article_pic: this.files[0].name,
                        id: this.form.id
                    }
                }).then((res) => {
                    if (res.data.status === 0) {
                        this.$message.success('修改物品图片成功！')
                        this.getClaimList()
                        this.articlePicDialogVisible = false
                        this.editDialogVisible = false
                    } else {
                        this.$message.warning('修改物品图片失败！')
                        this.articlePicDialogVisible = false
                    }
                }).catch((err) => {
                    console.log(err, "http请求失败");
                })
            } else {
                this.$message.warning('上传失败，您未选择物品图片！')
                this.articlePicDialogVisible = false
            }
        },
        // 取消修改信息
        cancelEdit() {
            this.editDialogVisible = false
            this.form = {}
        },
        // 修改状态
        editStatus(row) {
            // console.log(row, 'row')
            this.status = { ...row }
            if (row.isFound === 3) {
                this.$message.warning('请到【申请处理】->【认领申请】中处理！')
            } else {
                this.statusDialogVisible = true
            }
        },
        // 修改状态 处理中/已认领 -> 待认领 的按钮
        editStatusClaim() {
            console.log(this.currentPage, '当前页 1');
            // true: 已认领 -> 待认领，  false: 处理中 -> 待认领
            if (this.status.finishDate) {
                http({
                    method: 'post',
                    url: 'http://127.0.0.1:3007/admin/statusClaimedToClaim',
                    headers: {
                        Authorization: this.$store.getters.getUserToken,
                    },
                    params: {
                        id: this.status.id
                    }
                }).then((res) => {
                    if (res.data.status === 0) {
                        this.statusDialogVisible = false
                        this.getClaimList()
                        this.$message.success('状态修改成功！')
                        console.log(this.currentPage, '当前页 2');

                    } else {
                        this.$message.warning('状态修改失败！')
                    }
                }).catch((err) => {
                    console.log(err, "http请求失败");
                })
            } else {
                http({
                    method: 'post',
                    url: 'http://127.0.0.1:3007/admin/statusProcessingToClaim',
                    headers: {
                        Authorization: this.$store.getters.getUserToken,
                    },
                    params: {
                        id: this.status.id
                    }
                }).then((res) => {
                    if (res.data.status === 0) {
                        this.statusDialogVisible = false
                        this.getClaimList()
                        this.$message.success('状态修改成功！')
                    } else {
                        this.$message.warning('状态修改失败！')
                    }
                }).catch((err) => {
                    console.log(err, "http请求失败");
                })
            }
        },
        // 修改状态 待认领/已认领 -> 处理中 的按钮
        editStatusProcessing() {
            // 如果信息中有处理人信息 说明是 已认领 -> 处理中, 反之 待认领 -> 处理中
            if (this.status.handlerId) {
                http({
                    method: 'post',
                    url: 'http://127.0.0.1:3007/admin/statusClaimedToProcessing',
                    headers: {
                        Authorization: this.$store.getters.getUserToken,
                    },
                    params: {
                        id: this.status.id
                    }
                }).then((res) => {
                    if (res.data.status === 0) {
                        this.statusDialogVisible = false
                        this.getClaimList()
                        this.$message.success('状态修改成功！')
                    } else {
                        this.$message.warning('状态修改失败！')
                    }
                }).catch((err) => {
                    console.log(err, "http请求失败");
                })
            } else {
                this.statusInput = ''
                this.statusEditDialogVisible = true
            }
        },
        // 修改状态 待认领/已认领 -> 处理中 的 确认按钮
        submitHandler() {
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/statusClaimToProcessing',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    input: this.statusInput,
                    date: getCurrentDate(),
                    id: this.status.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.statusEditDialogVisible = false
                    this.statusDialogVisible = false
                    this.statusInput = ''
                    this.getClaimList()
                    this.$message.success('状态修改成功！')
                } else {
                    this.$message.warning(res.data.message || '状态修改失败！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        },
        // 修改状态 待认领/处理中 -> 已认领 的按钮
        editStatusClaimed() {
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/statusProcessingToClaimed',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                params: {
                    date: getCurrentDate(),
                    id: this.status.id
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.statusDialogVisible = false
                    this.getClaimList()
                    this.$message.success('状态修改成功！')
                } else {
                    this.$message.warning('状态修改失败！')
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        }
    },
    mounted() {
        this.getClaimList()
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
        /deep/ .isFoundTag:hover {
            cursor: pointer;
        }
    }

    .TWO::-webkit-scrollbar {
        display: none
    }

    .THREE {
        height: 6%;
    }

    .view-dialog {
        .dialog-container {
            display: flex;
            flex-direction: column;

            .el-dialog__body {
                padding: 0 20px;
            }

            .top {
                width: 100%;
                height: 10%;
                display: flex;
                justify-content: center;

                .el-steps {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                }
            }

            .bottom {
                width: 100%;
                height: 90%;
                margin-top: 20px;
                display: flex;
                flex-direction: row;

                .left {
                    width: 30%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                }

                .right {
                    width: 70%;
                    height: 100%;
                }
            }
        }
    }

    .status-dialog {
        .dialog-container {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }
    }

    .status-input-dialog {
        .dialog-container {
            display: flex;
            flex-direction: row;

            .el-button {
                margin-left: 10px;
            }
        }
    }

    .edit-dialog {
        .article_pic:hover {
            cursor: pointer;
            opacity: 0.5;
        }
    }
}
</style>