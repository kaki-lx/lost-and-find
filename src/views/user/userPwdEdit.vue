<template>
    <div class="userPwdEdit">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
            <el-tab-pane label="修改密码" name="first">
                <div class="form">
                    <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-ruleForm">
                        <el-form-item label="原密码" prop="oldPwd">
                            <el-input v-model.trim="form.oldPwd" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPwd">
                            <el-input v-model.trim="form.newPwd" type="password" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="再次输入" prop="reNewPwd">
                            <el-input v-model.trim="form.reNewPwd" type="password" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('form')">修改</el-button>
                            <el-button @click="resetForm('form')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>

            <el-tab-pane label="设置密保" name="second">
                <el-form :model="protectForm" :rules="protectRules" ref="protectForm" label-width="80px"
                    class="demo-ruleForm">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="问题1" prop="question_1">
                                <el-select v-model="protectForm.question_1" placeholder="请选择">
                                    <el-option v-for="item in options.slice(0, 6)" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="答案" prop="answer_1">
                                <el-input v-model.trim="protectForm.answer_1" type="text" show-password></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="问题2" prop="question_2">
                                <el-select v-model="protectForm.question_2" placeholder="请选择">
                                    <el-option v-for="item in options.slice(6, 11)" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="答案" prop="answer_2">
                                <el-input v-model.trim="protectForm.answer_2" type="text" show-password></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="问题3" prop="question_3">
                                <el-select v-model="protectForm.question_3" placeholder="请选择">
                                    <el-option v-for="item in options.slice(11, 15)" :key="item.value"
                                        :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="答案" prop="answer_3">
                                <el-input v-model.trim="protectForm.answer_3" type="text" show-password></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="20" style="display: flex; justify-content: right;">
                            <el-form-item>
                                <el-button type="primary" @click="submitProtectForm('protectForm')">保存</el-button>
                                <el-button type="danger" @click="deleteProtect()">清除</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>



                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import http from '@/utils/request';
import { getCurrentDate } from '@/utils/methods';
export default {
    data() {
        return {
            activeName: 'first',
            form: {
                oldPwd: '',
                newPwd: '',
                reNewPwd: ''
            },
            rules: {
                oldPwd: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' },
                    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                ],
                newPwd: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                ],
                reNewPwd: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                ]
            },
            protectForm: {
                question_1: '',
                answer_1: '',
                question_2: '',
                answer_2: '',
                question_3: '',
                answer_3: '',
            },
            protectRules: {
                question_1: [{ required: true, message: '请选择第一个密保问题', trigger: 'blur' }],
                answer_1: [{ required: true, message: '请回答第一个密保问题', trigger: 'blur' }],
                question_2: [{ required: true, message: '请选择第二个密保问题', trigger: 'blur' }],
                answer_2: [{ required: true, message: '请回答第二个密保问题', trigger: 'blur' }],
                question_3: [{ required: true, message: '请选择第三个密保问题', trigger: 'blur' }],
                answer_3: [{ required: true, message: '请回答第三个密保问题', trigger: 'blur' }],
            },
            options: [
                // 1~6
                {
                    value: '您小学学校名称？',
                    label: '您小学学校名称？'
                },
                {
                    value: '您小学班主任姓名？',
                    label: '您小学班主任姓名？'
                },
                {
                    value: '您初中学校名称？',
                    label: '您初中学校名称？'
                },
                {
                    value: '您初中班主任姓名？',
                    label: '您初中班主任姓名？'
                },
                {
                    value: '您高中学校名称？',
                    label: '您高中学校名称？'
                },
                {
                    value: '您高中班主任姓名？',
                    label: '您高中班主任姓名？'
                },
                // 7~11
                {
                    value: '您父亲的姓名？',
                    label: '您父亲的姓名？'
                },
                {
                    value: '您母亲的姓名？',
                    label: '您母亲的姓名？'
                },
                {
                    value: '您配偶的姓名？',
                    label: '您配偶的姓名？'
                },
                {
                    value: '您爷爷的姓名？',
                    label: '您爷爷的姓名？'
                },
                {
                    value: '您奶奶的姓名？',
                    label: '您奶奶的姓名？'
                },
                // 12~15
                {
                    value: '您的生日？',
                    label: '您的生日？'
                },
                {
                    value: '您父亲的生日？',
                    label: '您父亲的生日？'
                },
                {
                    value: '您母亲的生日？',
                    label: '您母亲的生日？'
                },
                {
                    value: '您配偶的生日？',
                    label: '您配偶的生日？'
                },
            ]
        }
    },
    methods: {
        getPswProtect() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/my/getPswProtect',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.protectForm = { ...res.data.data[0] }
                    // console.log(res.data.data, 'data');
                }
            }).catch((err) => {
                console.log(err, 'err')
            })
        },
        submitForm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    // 判断两次新密码输入是否一致
                    if (this.form.newPwd !== this.form.reNewPwd) {
                        this.$message.warning('两次新密码输入不一致，请重新输入！')
                        this.form.newPwd = ''
                        this.form.reNewPwd = ''
                        return
                    }
                    // 判断旧密码是否正确 正确-> 发送请求 -> 返回结果， 错误-> return false
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/my/updatePassword',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            oldPwd: this.form.oldPwd,
                            newPwd: this.form.newPwd,
                        }
                    }).then((res) => {
                        if (res.data.status === 1) {
                            this.$message.warning(res.data.message)
                        } else if (res.data.status === 0) {
                            this.$message.success(res.data.message)
                        }
                        this.resetForm(form)
                    }).catch((err) => {
                        console.log(err, 'err')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(form) {
            this.$refs[form].resetFields();
        },
        handleClick(tab/*, event*/) {
            // console.log(tab.name)
            if (tab.name === 'second') {
                this.getPswProtect()
            }
        },
        // 保存密保问题
        submitProtectForm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    http({
                        method: 'post',
                        url: 'http://127.0.0.1:3007/my/updatePswProtect',
                        headers: {
                            Authorization: this.$store.getters.getUserToken,
                        },
                        params: {
                            question_1: this.protectForm.question_1,
                            answer_1: this.protectForm.answer_1,
                            question_2: this.protectForm.question_2,
                            answer_2: this.protectForm.answer_2,
                            question_3: this.protectForm.question_3,
                            answer_3: this.protectForm.answer_3,
                            lastEditDate: getCurrentDate()
                        }
                    }).then((res) => {
                        if (res.data.status === 1) {
                            this.$message.warning(res.data.message)
                        } else if (res.data.status === 0) {
                            this.$message.success(res.data.message)
                        }
                    }).catch((err) => {
                        console.log(err, 'err')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        // 清除密保问题
        deleteProtect() {
            this.$confirm('<p>您确定删除密保问题?</p><p>删除后将无法通过【找回账号】的方式修改密码</p>', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true
            }).then(() => {
                http({
                    method: 'post',
                    url: 'http://127.0.0.1:3007/my/deletePswProtect',
                    headers: {
                        Authorization: this.$store.getters.getUserToken,
                    },
                    params: {
                        lastEditDate: getCurrentDate()
                    }
                }).then((res) => {
                    if (res.data.status === 1) {
                        this.$message.warning(res.data.message)
                    } else if (res.data.status === 0) {
                        this.$message.success(res.data.message)
                        this.getPswProtect()
                    }
                }).catch((err) => {
                    console.log(err, 'err')
                })
            }).catch(() => {
                this.$message.info('已取消清除')
            });
        }
    }
}
</script>

<style lang="less" scoped>
.userPwdEdit {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // background-color: aqua;

    .el-tabs {
        width: 100%;
        height: auto;
        margin-top: 10px;
        background: white;
    }

    .title {
        width: 80%;
        text-align: center;
    }

    .form {
        width: 50%;

        .el-input {
            width: 70%;
        }

        .el-button--primary {
            margin-left: 30px;
        }

        .el-button--default {
            margin-left: 30px;
        }
    }
}
</style>