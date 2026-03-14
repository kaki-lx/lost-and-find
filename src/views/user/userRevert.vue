<template>
  <div>
    <!-- <h1>我是userRevert页（用户寻物信息管理页）</h1> -->
    <div style="text-align: center;">
      <h2>我发布的寻物启事</h2>
    </div>

    <!--  筛选、搜索栏 -->
    <div class="search" style="display: flex; justify-content: center;">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="物品类型" style="margin-bottom: 10px">
          <el-select v-model="searchForm.type" ref="typeSelect" placeholder="物品类型" style="width: 110px"
            @change="typeSelectChange()" @clear="typeSelectClear()" clearable filterable>
            <el-option v-for="item in type" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="关键词" style="margin-bottom: 10px">
          <el-input v-model.trim="searchForm.keyword" placeholder="请输入关键词" @change="keywordInput()"
            @clear="keywordClear()" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item style="margin-bottom: 10px">
              <el-button type="primary" icon="el-icon-search" @click="searchBtn()">查询</el-button>
          </el-form-item> -->
      </el-form>
    </div>

    <!--  展示列表 -->
    <el-table :data="userRevertList" stripe border style="width: 100%">
      <el-table-column fixed="left" sortable prop="date" label="丢失日期" width="110"></el-table-column>
      <el-table-column sortable prop="createDate" label="发布日期" width="110"></el-table-column>
      <!-- <el-table-column sortable prop="type" label="类型" width="80"> </el-table-column> -->
      <el-table-column sortable prop="location" label="丢失地点" min-width="170"> </el-table-column>
      <el-table-column prop="resume" label="简述(详情)" min-width="140">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>详情： {{ scope.row.description }}</p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.resume }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="initiatorPhone" label="预留号码" width="120"> </el-table-column>

      <el-table-column sortable fixed="right" prop="isFound" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isFound == 1 ? 'primary' : (scope.row.isFound == 0 ? 'success' : 'warning')"
            disable-transitions>
            {{ scope.row.isFound == 1 ? '待归还' : (scope.row.isFound == 0 ? '已归还' : '处理中') }}
            <!-- {{ scope.row.isFound == 1 ? '待归还' : '已归还'}} -->
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.isFound != 1"
            @click="handleView(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" v-if="scope.row.isFound == 1"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.isFound == 1"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%" top="10px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20" style="margin-top: 40px">
          <el-col :span="12">
            <el-form-item label="简述" prop="resume" :label-width="formLabelWidth">
              <el-input v-model.trim="form.resume" placeholder="请输入物品简述" type="text" maxlength="8" show-word-limit
                :disabled="dialogDisabled"></el-input>
            </el-form-item>
            <el-form-item label="丢失地点" prop="location" :label-width="formLabelWidth">
              <el-input v-model.trim="form.location" placeholder="请输入丢失地点" type="text" maxlength="10" show-word-limit
                :disabled="dialogDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="丢失时间" prop="date" :label-width="formLabelWidth">
              <el-date-picker :disabled="dialogDisabled" style="width: 100%" v-model="form.date" type="date"
                format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
              <!-- <el-input type="date" v-model="form.date" :disabled="dialogDisabled"></el-input> -->
            </el-form-item>
            <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
              <el-select v-model="form.type" placeholder="请选择物品类型" style="width:100%" :disabled="dialogDisabled">
                <el-option v-for="item in type" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="详情" prop="description" :label-width="formLabelWidth">
              <el-input type="textarea" resize="none" :rows="5" placeholder="请输入物品的详细特征（供管理员参考）"
                v-model.trim="form.description" maxlength="50" show-word-limit :disabled="dialogDisabled"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="图片" prop="article_pic" :label-width="formLabelWidth">
              <el-image v-if="form.article_pic"
                :preview-src-list="[require('../../../public/revert_pic/' + form.article_pic)]"
                style="height: 120px;width: 120px;"
                :src="require('../../../public/revert_pic/' + form.article_pic)"></el-image>

              <el-image v-if="!form.article_pic" style="height: 120px;width: 120px;"
                :src="require('../../../public/no_pic/noArticle.png')"></el-image>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="预留号码" prop="initiatorPhone" :label-width="80">
              <el-input v-model.trim="form.initiatorPhone" placeholder="请输入联系方式" type="text" maxlength="11"
                show-word-limit clearable :disabled="dialogDisabled"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="预留微信号" prop="initiatorWechat" :label-width="80">
              <el-input v-model.trim="form.initiatorWechat" placeholder="请输入联系方式" type="text" maxlength="20"
                show-word-limit clearable :disabled="dialogDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预留QQ" prop="initiatorQQ" :label-width="80">
              <el-input v-model.trim="form.initiatorQQ" placeholder="请输入联系方式" type="text" maxlength="12" show-word-limit
                clearable :disabled="dialogDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="dialogDisabled">
          <el-col :span="8">
            <el-form-item label="拾物者电话号码" prop="handlerPhone" :label-width="80">
              <el-tag type="success" style="font-size: 16px; width: 100%;">{{ form.handlerPhone == '' ?
                '未填写' : form.handlerPhone}}</el-tag>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="拾物者微信号" prop="handlerWechat" :label-width="80">
              <el-tag type="success" style="font-size: 16px; width: 100%;">{{ form.handlerWechat == '' ?
                '未填写' : form.handlerWechat}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拾物者QQ" prop="handlerQQ" :label-width="80">
              <el-tag type="success" style="font-size: 16px; width: 100%;">{{ form.handlerQQ == '' ?
                '未填写' :form.handlerQQ}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item style="display:flex; justify-content:center;" v-if="!dialogDisabled">
              <el-button type="primary" @click="submitForm('form')">修改</el-button>
              <!-- <el-button @click="resetForm()">重置</el-button> -->
              <el-button type="info" @click=" dialogVisible = false">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import http from "../../utils/request";
export default {
  data() {
    return {
      userRevertList: [],
      searchForm: {
        keyword: '',
        type: '',
      },
      type: [],
      dialogVisible: false,
      dialogDisabled: false,   // 对话框 输入框状态  true-禁用  false-可用
      formLabelWidth: '80px',
      form: {},
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
        date: [
          { required: true, message: '请输入丢失时间', trigger: 'blur' },
        ],
        initiatorPhone: [
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
      },
    }
  },
  methods: {
    getUserRevertList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/my/getUserRevert",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      }).then((res) => {
        if (res.data.status === 0) {
          res.data.data.forEach(item => {
            item.date = item.date.slice(0, 10)
            item.createDate = item.createDate.slice(0, 10)
          });
          // 将用户寻物信息列表数据存入 store 中
          this.$store.dispatch('asyncUpdateUserRevert', res.data.data)
          // 从 store 中获取寻物信息列表
          this.userRevertList = [...this.$store.getters.getUserRevert]
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: "error",
          });
        }
      }).catch((err) => {
        this.$message({
          showClose: true,
          message: err,
          type: "error",
        });
      });
    },
    handleClick(row) {
      // console.log(row);
    },
    handleView(index, row) {
      this.dialogVisible = true
      this.dialogDisabled = true
      // 数据回显
      this.form = { ...row }
    },
    handleEdit(index, row) {
      // console.log(index, row, "#handleEdit");
      this.dialogVisible = true
      this.dialogDisabled = false
      // 数据回显
      this.form = { ...row }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // TODO: 发送 http 修改 revert 信息请求
          http({
            method: 'post',
            url: 'http://127.0.0.1:3007/my/editRevert',
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              id: this.form.id,
              resume: this.form.resume,
              location: this.form.location,
              date: this.form.date,
              type: this.form.type,
              description: this.form.description,
              article_pic: this.form.article_pic,
              initiatorPhone: this.form.initiatorPhone,
              initiatorWechat: this.form.initiatorWechat,
              initiatorQQ: this.form.initiatorQQ,
            }
          }).then((res) => {
            if (res.data.status === 0) {
              this.dialogVisible = false
              this.$message({
                showClose: true,
                message: '修改成功！',
                type: 'success'
              })
              this.getUserRevertList()
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'warning'
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http({
          method: 'post',
          url: 'http://127.0.0.1:3007/my/deleteRevert',
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            id: row.id,
          }
        }).then((res) => {
          if (res.data.status === 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '删除成功!'
            })
            this.getUserRevertList()
          } else {
            this.$message({
              showClose: true,
              type: 'warning',
              message: res.data.message
            });
          }
        }).catch((err) => {
          console.log(err)
        })

        // 如果 article_pic 不为空 -> 删除用户上传的图片文件
        if (row.article_pic != "") {
          http({
            method: 'post',
            url: 'http://127.0.0.1:3007/my/deleteRevertPic',
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              article_pic: row.article_pic,
              id: row.id
            }
          }).then((res) => {
            // console.log(res.data.message)
          }).catch((err) => {
            console.log(err)
          })
        }

      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    typeSelectClear() {
      if (this.searchForm.keyword) {
        // 1.初始化
        this.userRevertList = this.$store.getters.getUserRevert
        // 2.对关键词进行筛选
        const revertList_resume = this.userRevertList.filter(item => item.resume.includes(this.searchForm.keyword))
        const revertList_description = this.userRevertList.filter(item => item.description.includes(this.searchForm.keyword))
        const revertList_location = this.userRevertList.filter(item => item.location.includes(this.searchForm.keyword))
        this.userRevertList = [...revertList_resume, ...revertList_description, ...revertList_location] // 存在重复数据
        this.userRevertList = this.userRevertList.filter(function (item, index, arr) { return arr.indexOf(item, 0) === index })  // 数据去重
      } else {
        // 1.初始化
        this.userRevertList = this.$store.getters.getUserRevert
      }
    },
    typeSelectChange() {
      if (this.searchForm.keyword) {
        // 1.初始化
        this.userRevertList = this.$store.getters.getUserRevert
        // 2.对关键词进行筛选
        const revertList_resume = this.userRevertList.filter(item => item.resume.includes(this.searchForm.keyword))
        const revertList_description = this.userRevertList.filter(item => item.description.includes(this.searchForm.keyword))
        const revertList_location = this.userRevertList.filter(item => item.location.includes(this.searchForm.keyword))
        this.userRevertList = [...revertList_resume, ...revertList_description, ...revertList_location] // 存在重复数据
        this.userRevertList = this.userRevertList.filter(function (item, index, arr) { return arr.indexOf(item, 0) === index })  // 数据去重
        // 3.对类型进行筛选
        this.userRevertList = this.userRevertList.filter(item => item.type == this.searchForm.type)
      } else {
        // 1.初始化
        this.userRevertList = this.$store.getters.getUserRevert
        // 2.对类型进行筛选
        this.userRevertList = this.userRevertList.filter(item => item.type == this.searchForm.type)
      }
    },
    keywordClear() {
      if (this.searchForm.type) {
        // 1.初始化
        this.userRevertList = this.$store.getters.getUserRevert
        // 2.对类型进行筛选
        this.userRevertList = this.userRevertList.filter(item => item.type == this.searchForm.type)
      } else {
        // 1.初始化
        this.userRevertList = this.$store.getters.getUserRevert
      }
    },
    keywordInput() {
      if (this.searchForm.keyword) {
        if (this.searchForm.type) {
          // 1.初始化
          this.userRevertList = this.$store.getters.getUserRevert
          // 2.对类型进行筛选
          this.userRevertList = this.userRevertList.filter(item => item.type == this.searchForm.type)
          // 3.对关键词进行筛选
          const revertList_resume = this.userRevertList.filter(item => item.resume.includes(this.searchForm.keyword))
          const revertList_description = this.userRevertList.filter(item => item.description.includes(this.searchForm.keyword))
          const revertList_location = this.userRevertList.filter(item => item.location.includes(this.searchForm.keyword))
          this.userRevertList = [...revertList_resume, ...revertList_description, ...revertList_location] // 存在重复数据
          this.userRevertList = this.userRevertList.filter(function (item, index, arr) { return arr.indexOf(item, 0) === index })  // 数据去重
        } else {
          // 1.初始化
          this.userRevertList = this.$store.getters.getUserRevert
          // 2.对关键词进行筛选
          const revertList_resume = this.userRevertList.filter(item => item.resume.includes(this.searchForm.keyword))
          const revertList_description = this.userRevertList.filter(item => item.description.includes(this.searchForm.keyword))
          const revertList_location = this.userRevertList.filter(item => item.location.includes(this.searchForm.keyword))
          this.userRevertList = [...revertList_resume, ...revertList_description, ...revertList_location] // 存在重复数据
          this.userRevertList = this.userRevertList.filter(function (item, index, arr) { return arr.indexOf(item, 0) === index })  // 数据去重
        }
      } else {
        if (this.searchForm.type) {
          // 1.初始化
          this.userRevertList = this.$store.getters.getUserRevert
          // 2.对类型进行筛选
          this.userRevertList = this.userRevertList.filter(item => item.type == this.searchForm.type)
        } else {
          // 1.初始化
          this.userRevertList = this.$store.getters.getUserRevert
        }
      }
    },
  },
  mounted() {
    this.getUserRevertList()
    this.type = [...this.$store.getters.getType]
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__header {
  padding: 20px 20px 0;
}

/deep/.el-dialog__body {
  padding: 0px 20px 20px 20px;
}
</style>