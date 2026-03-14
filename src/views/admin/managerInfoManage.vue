<template>
  <!-- <h1>我是保管员管理页</h1> -->
  <div class="container">
    <div class="ONE">
        <div class="left">
            <p><span class="link" @click="toIndex">首页</span>  > 信息管理 > 保管员信息管理</p>
        </div>
        <div class="right">
            <el-input v-model.trim="keyword" clearable @keyup.enter.native="search()"></el-input>
            <el-button plain type="primary" @click="search()">搜索</el-button>
        </div>
    </div>

    <div class="TWO">
      <el-table :data="viewList" border highlight-current-row style="width: 100%; text-algin: center;">
        <el-table-column prop="id" label="ID" width="80" sortable header-align="center" align="center"></el-table-column>

        <el-table-column prop="createDate" label="注册日期" width="200" sortable header-align="center" align="center">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
            </template>
        </el-table-column>

        <el-table-column prop="username" label="账号" header-align="center" align="center"> </el-table-column>

        <el-table-column prop="nickname" label="昵称" header-align="center" align="center"> </el-table-column>

        <el-table-column prop="user_pic" label="头像" width="80"  header-align="center" align="center">
            <template slot-scope="scope">
                <el-avatar
                    v-if="scope.row.user_pic"
                    :size="35"
                    :src="require('../../../public/user_pic/' + scope.row.user_pic)"
                    style="border: solid 1px black;"
                ></el-avatar>
                <el-avatar
                    v-if="!scope.row.user_pic"
                    :size="35"
                    :src="require('../../../public/no_pic/noAvatar.png')"
                    style="border: solid 1px black;"
                ></el-avatar>
            </template>
        </el-table-column>

        <el-table-column prop="phone" label="联系电话" width="120" header-align="center" align="center"> </el-table-column>

        <el-table-column prop="identity" label="身份" width="120" header-align="center" align="center">保管员</el-table-column>

        <el-table-column label="操作" width="220" header-align="center" align="center">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="primary"
                @click="handleView(scope.$index, scope.row)">查看</el-button>
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                :disabled="scope.row.id === userInfo.id"
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
        :total="managerList.length">
        </el-pagination>
    </div>


    <el-dialog class="view-dialog"
        title="用户信息"
        :visible.sync="dialogVisible"
        width="40%"
        top="80px">
        <div class="dialog-container">
            <div class="left">
                <el-avatar
                    v-if="view.user_pic"
                    :size="120"
                    :src="require('../../../public/user_pic/' + view.user_pic)"
                    style="margin-right: 10px; border: solid 1px black;"
                ></el-avatar>
                <el-avatar
                    v-if="!view.user_pic"
                    :size="120"
                    :src="require('../../../public/no_pic/noAvatar.png')"
                    style="margin-right: 10px; border: solid 1px black;"
                ></el-avatar>
            </div>

            <div class="right">
                <el-descriptions 
                    title="" 
                    border 
                    :column="1" 
                    :labelStyle="{'width': '40%', 'text-align': 'center'}" 
                    :contentStyle="{'width': '60%', 'text-align': 'center'}">
                    <el-descriptions-item label="用户ID" >{{view.id}}</el-descriptions-item>
                    <el-descriptions-item label="账号">{{view.username}}</el-descriptions-item>
                    <el-descriptions-item label="昵称">{{view.nickname}}</el-descriptions-item>
                    <el-descriptions-item label="性别">{{view.gender}}</el-descriptions-item>
                    <el-descriptions-item label="年龄">{{view.age}}</el-descriptions-item>
                    <el-descriptions-item label="联系电话">{{view.phone}}</el-descriptions-item>
                    <el-descriptions-item label="微信">{{view.wechat}}</el-descriptions-item>
                    <el-descriptions-item label="QQ">{{view.qq}}</el-descriptions-item>
                    <el-descriptions-item label="注册时间">{{view.createDate}}</el-descriptions-item>
                </el-descriptions>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog class="edit-dialog"
        title="用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        top="40px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="24" style="text-align: center;">
                    <div class="avatar" @click="changeAvatar">
                        <el-avatar
                            v-if="form.user_pic"
                            :size="80"
                            :src="require('../../../public/user_pic/' + form.user_pic)"
                            @click="changeAvatar"
                        ></el-avatar>
                        <el-avatar
                            v-if="!form.user_pic"
                            :size="80"
                            :src="require('../../../public/no_pic/noAvatar.png')"
                            @click="changeAvatar"
                        ></el-avatar>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20" >
                <!--  第一列 -->
                <el-col :span="12">
                    <el-form-item label="ID" prop="id" :label-width="formLabelWidth">{{form.id}} </el-form-item>

                    <el-form-item label="身份" prop="identity" :label-width="formLabelWidth">普通用户</el-form-item>

                    <el-form-item label="账号" prop="username" :label-width="formLabelWidth">
                        <el-input v-model.trim="form.username" placeholder="请输入账号" type="text" maxlength="12" show-word-limit></el-input>
                    </el-form-item>
                    
                    <el-form-item label="年龄" prop="age" :label-width="formLabelWidth">
                        <el-input type="text" placeholder="请输入年龄" oninput="value=value.replace(/[^\d]/g, '')" v-model.number.trim="form.age"></el-input>
                    </el-form-item>

                    <el-form-item label="QQ" prop="qq" :label-width="formLabelWidth">
                        <el-input v-model.trim="form.qq" placeholder="请输入QQ" type="text"></el-input>
                    </el-form-item>

                    <el-form-item label="联系方式" prop="phone" :label-width="formLabelWidth">
                        <el-input v-model.trim="form.phone" placeholder="请输入联系方式" type="text" maxlength="11" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <!-- 第二列 -->
                <el-col :span="12">
                    <el-form-item label="注册时间" prop="createDate" :label-width="formLabelWidth">{{form.createDate}}</el-form-item>

                    <el-form-item label="头像" prop="user_pic" :label-width="formLabelWidth">{{form.user_pic ? form.user_pic : '默认头像'}}</el-form-item>

                    <el-form-item label="昵称" prop="nickname" :label-width="formLabelWidth">
                        <el-input v-model.trim="form.nickname" placeholder="请输入昵称" type="text" maxlength="8" show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
                        <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                            <el-option label="保密" value="保密"></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="微信" prop="wechat" :label-width="formLabelWidth">
                        <el-input v-model.trim="form.wechat" placeholder="请输入微信" type="text"></el-input>
                    </el-form-item>

                    <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                        <el-input v-model.trim="form.password" placeholder="请输入密码" type="text" maxlength="12" show-word-limit show-password></el-input>
                    </el-form-item>
                    
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            <el-button type="info" @click="editDialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>

    <el-dialog class="avatar-dialog"
        title="修改头像"
        :visible.sync="avatarDialogVisible"
        width="30%"
        :before-close="handleClose">
        <span>上传头像
            <el-upload
                action="http://127.0.0.1:3007/my/uploadAvatar" 
                ref="upload"
                :headers="myHeaders"
                :auto-upload="false"
                :limit="limit"
                :file-list="files"
                list-type="picture-card"
                :on-change="uploadChange"
                >
                <i class="el-icon-plus"></i>
            </el-upload>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeAvatarOk">确 定</el-button>
        </span>
    </el-dialog>

    </div>
</template>

<script>
import http from "../../utils/request";
export default {
    data() {
        return {
            userInfo: {},
            managerList: [],
            dialogVisible: false,
            view: {},
            viewList: [],
            keyword: '',
            pageSize: 10,
            currentPage: 1,
            editDialogVisible: false,
            form: {},
            formLabelWidth: '80px',
            rules: {
				username: [
					{ required: true, message: '请输入账号(大小写字母、数字、下划线)', trigger: 'blur' },
					{ min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '请输入联系方式', trigger: 'blur' },
					{ validator:function(rule,value,callback){
									if(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value) == false){
										callback(new Error("请输入正确的手机号"));
									}else{
										callback();
									}
								}, trigger: 'blur'
					},
				],
				nickname: [
					{ required: true, message: '请输入昵称', trigger: 'blur' },
					{ min:1, max:10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
				],
                wechat: [
                    { min:1, max:18, message: '长度在 1 到 18 个字符', trigger: 'blur' }
                ],
                qq: [
                    { min:6, max:12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                age: [
                    { type: 'number', message: '年龄必须为数字值'},
                    { validator:function(rule,value,callback){
                        if( value ){
                        if( value < 3 || value > 120 ) { callback(new Error('请输入正确的年龄')) }
                        else { callback() }
                        }
                        else { callback() }
                        // if( value!= null && (value<3 || value>120) ) { callback(new Error('请输入正确的年龄')) }
                        // else { callback }
                    }, trigger: 'blur' }
                ]
			},
            avatarDialogVisible: false,
            limit: 1,
            files: [],
            myHeaders: {
                Authorization: this.$store.getters.getUserToken,
            }
        };
    },
    methods: {
        getUserInfo() {
            this.userInfo = {...this.$store.getters.getUserInfo}
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
                    this.viewList = [...this.managerList.slice(this.currentPage*this.pageSize-this.pageSize, this.currentPage*this.pageSize)]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            });
        },
        toIndex() {
            this.$router.push('/adminIndex')
        },
        // 查看
        handleView(index, row) {
            console.log(index, row);
            this.dialogVisible = true
            this.view = row
        },
        // 编辑
        handleEdit(index, row) {
            // console.log(index, row);
            if(this.$store.getters.getUserInfo.adminUserLOA === '1'){
                this.editDialogVisible = true
                this.form = {...row}
            }else{
                this.$message.warning('您没有用户管理权限！')
            }
        },
        // 修改信息 提交
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/admin/updateUserInfo',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            username: this.form.username,
                            nickname: this.form.nickname,
                            age: this.form.age,
                            gender: this.form.gender,
                            qq: this.form.qq,
                            wechat: this.form.wechat,
                            phone: this.form.phone,
                            password: this.form.password,
                            id: this.form.id
                        }
                    }).then((res) => {
                        if(res.data.status === 0){
                            if(this.keyword){
                                this.$store.dispatch('asyncUpdatePage', this.currentPage)
                                this.editDialogVisible = false
                                this.form = {}
                                this.$message.success('用户信息修改成功！')
                                this.search()
                                this.currentPage = this.$store.getters.getPage
                                this.$store.dispatch('asyncUpdatePage', '')
                                this.viewList = [...this.userList.slice(this.currentPage*this.pageSize-this.pageSize, this.currentPage*this.pageSize)]
                            }else{
                                this.editDialogVisible = false
                                this.form = {}
                                this.$message.success('用户信息修改成功！')
                                this.getUserList() 
                            }
                        }else{
                            this.editDialogVisible = false
                            this.form = {}
                            this.$message.warning(res.data.message)
                        }
                    }).catch((err) => {
                        console.log(err, "http请求失败");
                    })
                }else {
                    console.log('error submit!!');
                    return false;
                }
			});
        },
        // 按钮 打开头像上传对话框
        changeAvatar() {
            this.files = []
            this.avatarDialogVisible = true
        },
        // upload 改变事件
        uploadChange(file) {
            const isJPG = file.raw.type === 'image/jpeg'
            const isLt2M = file.raw.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
                this.files = []
                return
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
                this.files = []
                return
            }
        
            // 复刻文件信息
            // console.log(file,"file")
            this.files.push(file)
            // console.log(this.files,"#files")
        },
        // 关闭头像修改对话框
        handleClose() {
            this.avatarDialogVisible = false
            this.files = []
        },
        // 确认修改头像
        changeAvatarOk() {
            if(this.files.length === 1){
                this.$refs.upload.submit()
                http({
                    method: 'post',
                    url: 'http://127.0.0.1:3007/admin/updateAvatar',
                    headers: {
                        Authorization: this.$store.getters.getUserToken,
                    },
                    params: {
                        user_pic: this.files[0].name,
                        id: this.form.id,
                    }
                }).then((res) => {
                    this.$message.success('上传头像成功！', res.data.message)
                    // this.getUserInfo()
                    // 强制刷新页面
                    // location.reload()
                    this.avatarDialogVisible = false
                }).catch((err) => {
                    this.$message.error('上传头像失败！'+err)
                })
            }else{
                this.$message.warning('文件数量有误，上传失败！')
            }
        },
        // 删除
        handleDelete(index, row) {
            // console.log(index, row)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                http({
                    method: 'post',
                    url: 'http://127.0.0.1:3007/admin/deleteUser',
                    headers: {
                        Authorization: this.$store.getters.getUserToken,
                    },
                    params:{
                        id: row.id,
                    }
                }).then((res) => {
                    if(res.data.status === 0 ){
                        this.$message.success('删除成功！')
                    this.getManagerList()
                    }else{
                        this.$message.warning('删除失败！')
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }).catch(() => {
                this.$message.info('已取消删除！')     
            })
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
            this.currentPage = val
            this.viewList = [...this.managerList.slice(this.currentPage*this.pageSize-this.pageSize, this.currentPage*this.pageSize)]
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
                if(res.data.status === 0){
                    this.managerList = [...res.data.data]
                    this.viewList = [...this.managerList.slice(0,this.pageSize)]
                }
            }).catch((err) => {
                console.log(err, "http请求失败");
            })
        }
    },

    mounted() {
        this.getUserInfo();
        this.getManagerList();
    },
};
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


    .view-dialog {
        .dialog-container {
            display: flex;
            flex-direction: row;
            .el-dialog__body {
                padding: 0 20px;
            }
            .left {
                width: 30%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .right {
                width: 70%;
            }
        }
    }

    .edit-dialog{
        .avatar:hover{
            cursor: pointer;
            opacity: 0.5;
      }
    }
}
</style>