<template>
  <div class="userInfo">
    <!-- <h1>我是userInfo页</h1> -->

    <div class="title">
      <h2>基本信息</h2>
    </div>
    <div class="userInfoList">

      <div class="avatar-container">
        <div class="avatar" @click="changeAvatar">
          <el-avatar v-if="userInfo.user_pic" :size="80"
            :src="require('../../../public/user_pic/' + form.user_pic)"></el-avatar>
          <el-avatar v-if="!userInfo.user_pic" :size="80"
            :src="require('../../../public/no_pic/noAvatar.png')"></el-avatar>
        </div>
      </div>

      <el-dialog title="修改头像" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>上传头像
          <el-upload action="http://127.0.0.1:3007/my/uploadAvatar" ref="upload" :headers="myHeaders"
            :auto-upload="false" :limit="limit" :file-list="files" list-type="picture-card" :on-change="uploadChange">
            <i class="el-icon-plus"></i>
          </el-upload>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeAvatarOk">确 定</el-button>
        </span>
      </el-dialog>



      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-descriptions title="" :column="2" border :labelStyle="{ 'width': '12%', 'text-align': 'right', }"
          :contentStyle="{ 'width': '38%' }">
          <!-- 右侧操作栏 -->
          <template slot="extra">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="edit()">{{ isEdit ? '取消' : '编辑'
            }}</el-button>
          </template>
          <!-- 第一行 -->
          <el-descriptions-item label="ID" label-class-name="my-label" content-class-name="my-content">
            {{ userInfo.id }}
          </el-descriptions-item>

          <el-descriptions-item label="账号">
            {{ userInfo.username }}
          </el-descriptions-item>
          <!-- 第二行 -->
          <el-descriptions-item label="昵称">
            <div>{{ userInfo.nickname }}</div>
          </el-descriptions-item>

          <el-descriptions-item label="联系电话">
            <div v-if="!isEdit">{{ userInfo.phone }}</div>

            <el-form-item prop="phone" label-width=“0px” v-if="isEdit">
              <el-input v-model.trim="form.phone"></el-input>
            </el-form-item>
          </el-descriptions-item>

          <!-- 第三行 -->
          <el-descriptions-item label="微信">
            <div v-if="!isEdit">{{ userInfo.wechat }}</div>

            <el-form-item prop="wechat" label-width=“0px” v-if="isEdit">
              <el-input v-model.trim="form.wechat"></el-input>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="QQ">
            <div v-if="!isEdit">{{ userInfo.qq }}</div>

            <el-form-item prop="qq" label-width=“0px” v-if="isEdit">
              <el-input type="text" oninput="value=value.replace(/[^\d]/g, '')" v-model.trim="form.qq"></el-input>
            </el-form-item>
          </el-descriptions-item>

          <!-- 第四行 -->
          <el-descriptions-item label="性别">
            <div v-if="!isEdit">{{ userInfo.gender }}</div>

            <el-form-item label="" label-width="0px" v-if="isEdit">
              <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
                <el-option label="保密" value="保密"></el-option>
              </el-select>
            </el-form-item>

          </el-descriptions-item>

          <el-descriptions-item label="年龄">
            <div v-if="!isEdit">{{ userInfo.age }}</div>

            <el-form-item prop="age" label-width=“0px” v-if="isEdit">
              <el-input type="text" oninput="value=value.replace(/[^\d]/g, '')"
                v-model.number.trim="form.age"></el-input>
            </el-form-item>
          </el-descriptions-item>

          <!-- <el-descriptions-item label="联系地址">

          </el-descriptions-item> -->
        </el-descriptions>
        <div class="btn-container" v-if="isEdit">
          <el-button type="primary" @click="submitForm('form')">完成</el-button>
          <el-button @click="resetForm('form')" style="margin-left:60px">恢复</el-button>
        </div>
      </el-form>
    </div>

  </div>
</template>

<script>
import http from '../../utils/request'

export default {
  data() {
    return {
      isEdit: true,
      userInfo: {},
      form: {},
      rules: {
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value) == false) {
                callback(new Error("请输入正确的手机号"));
              } else {
                callback();
              }
            }, trigger: 'blur'
          },
        ],
        wechat: [
          // { required: true, message: '请输入微信号', trigger: 'blur' },
          { min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur' }
        ],
        qq: [
          // { required: true, message: '请输入QQ号', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        age: [
          // { required: true, message: '请输入年龄', trigger: 'blur' },
          { type: 'number', message: '年龄必须为数字值' },
          {
            validator: function (rule, value, callback) {
              if (value) {
                if (value < 3 || value > 120) { callback(new Error('请输入正确的年龄')) }
                else { callback() }
              }
              else { callback() }
              // if( value!= null && (value<3 || value>120) ) { callback(new Error('请输入正确的年龄')) }
              // else { callback }
            }, trigger: 'blur'
          }
        ]
      },
      dialogVisible: false,
      limit: 1,
      files: [],
      myHeaders: {
        Authorization: this.$store.getters.getUserToken,
      }
    }
  },
  methods: {
    getUserInfo() {
      http({
        method: 'get',
        url: 'http://127.0.0.1:3007/my/getUserInfo',
        headers: {
          Authorization: this.$store.getters.getUserToken,
        }
      }).then((res) => {
        // 将通过 Token 获取的用户信息存入 store 中
        this.$store.dispatch('asyncUpdateUserInfo', res.data.data)
        // 同步更新此页面的用户信息
        this.userInfo = { ...this.$store.getters.getUserInfo }
      }).catch((err) => {
        console.log(err, '用户信息修改 获取用户数据失败！')
      })
    },
    edit() {
      if (this.isEdit === true) {
        this.form = { ...this.userInfo }
      }
      this.isEdit = !this.isEdit

    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          http({
            method: 'post',
            url: 'http://127.0.0.1:3007/my/updateUserInfo',
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              phone: this.form.phone,
              nickname: this.form.nickname,
              wechat: this.form.wechat,
              qq: this.form.qq,
              gender: this.form.gender,
              age: this.form.age,
            }
          }).then((res) => {
            if (res.data.status === 1) {
              this.$message.warning(res.data.message)
            } else if (res.data.status === 0) {
              this.$message.success(res.data.message)
              // 重新获取个人信息 存入 store 中
              this.getUserInfo()
              // 将编辑状态修改为 false
              this.isEdit = false
            }
            else { alert('未知错误！') }
          }).catch((err) => {
            console.log(err, '个人信息页 更新用户数据失败！')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 复原 表单
    resetForm() {
      this.form = { ...this.userInfo }
    },
    // 关闭 对话框
    handleClose() {
      this.dialogVisible = false
      this.files = []
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
      console.log(file, "file")
      this.files.push(file)
      console.log(this.files, "#files")
    },
    // 点击头像 弹出修改头像对话框
    changeAvatar() {
      this.files = []
      this.dialogVisible = true
    },
    // 确认修改头像
    changeAvatarOk() {
      if (this.files.length === 1) {
        this.$refs.upload.submit()
        http({
          method: 'post',
          url: 'http://127.0.0.1:3007/my/updateAvatar',
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            user_pic: this.files[0].name,
          }
        }).then((res) => {
          this.$message.success('上传头像成功！', res.data.message)
          this.getUserInfo()
          // 强制刷新页面
          location.reload()
          this.dialogVisible = false
        }).catch((err) => {
          this.$message.error('上传头像失败！' + err)
        })
      } else {
        this.$message.warning('文件数量有误，上传失败！')
      }
    }
  },
  mounted() {
    console.log(this.$store.getters.getUserInfo, "#用户信息页")
    // 编辑状态默认关闭
    this.isEdit = false
    // 获得用户信息 存入 userInfo 中
    this.userInfo = { ...this.$store.getters.getUserInfo }
    // form 表单 数据回显
    this.form = { ...this.userInfo }
  },
}
</script>

<style lang="less" scoped>
.userInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    width: 80%;
    text-align: center;
  }

  .userInfoList {
    width: 80%;

    .avatar-container {
      display: flex;
      justify-content: center;

      .avatar {
        display: flex;
        flex-direction: column;
      }

      .avatar:hover {
        cursor: pointer;
        opacity: 0.5;
      }
    }

    .btn-container {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
  }
}
</style>