<template>
	<div class="login-register">
		<div class="contain">
			<div class="big-box" :class="{ active: isLogin }">
				<div class="sysname">校园失物招领平台</div>
				<div class="big-contain" key="bigContainLogin" v-if="isLogin">
					<div class="btitle" style="margin-bottom: 20px">账户登录</div>
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm"
						style="width: auto;">
						<el-form-item label="账号" prop="username">
							<el-input v-model.trim="ruleForm.username" ref="inputUsername"
								@keyup.enter.native="submitLoginForm('ruleForm')"
								onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"></el-input>
						</el-form-item>
						<el-form-item label="密码" prop="password">
							<div class="pswInput"
								style="display: flex; flex-direction: row; justify-content: space-between;">
								<el-input v-model.trim="ruleForm.password" type="password" style="width: 200px;"
									@keyup.enter.native="submitLoginForm('ruleForm')"></el-input>
								<span style="font-size: 12px; cursor: pointer;"
									@click="dialogVisible = true">忘记密码</span>
							</div>
						</el-form-item>
						<el-form-item label="验证码" prop="code">
							<div class="pswInput"
								style="display: flex; flex-direction: row; justify-content: space-between;">
								<el-input v-model.trim="ruleForm.code" type="text" style="width: 100px;"
									@keyup.enter.native="submitLoginForm('ruleForm')"></el-input>
								<div @click="getCode" v-html="checkCode.code" title="看不清？点击更换"></div>
							</div>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitLoginForm('ruleForm')">登录</el-button>
							<el-button @click="resetForm('ruleForm')">重置</el-button>
							<el-button type="success" @click="visitor">游客浏览模式</el-button>
						</el-form-item>
					</el-form>
				</div>

				<div class="big-contain" key="bigContainRegister" v-else>
					<div class="btitle" style="margin-bottom: 20px">创建账户</div>
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
						<el-form-item label="账号" prop="username">
							<el-input v-model.trim="ruleForm.username"
								@keyup.enter.native="submitRegisterForm('ruleForm')"
								onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"></el-input>
						</el-form-item>
						<el-form-item label="密码" prop="password">
							<el-input v-model.trim="ruleForm.password" type="password" show-password
								@keyup.enter.native="submitRegisterForm('ruleForm')"></el-input>
						</el-form-item>
						<el-form-item label="联系方式" prop="phone">
							<el-input v-model.trim="ruleForm.phone"
								@keyup.enter.native="submitRegisterForm('ruleForm')"></el-input>
						</el-form-item>
						<el-form-item label="昵称" prop="nickname">
							<el-input v-model.trim="ruleForm.nickname"
								@keyup.enter.native="submitRegisterForm('ruleForm')"></el-input>
						</el-form-item>
						<el-form-item label="验证码" prop="code">
							<div class="pswInput"
								style="display: flex; flex-direction: row; justify-content: space-between;">
								<el-input v-model.trim="ruleForm.code" type="text" style="width: 100px;"
									@keyup.enter.native="submitRegisterForm('ruleForm')"></el-input>
								<div @click="getCode" v-html="checkCode.code" title="看不清？点击更换"></div>
							</div>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitRegisterForm('ruleForm')">立即注册</el-button>
							<el-button @click="resetForm('ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="small-box" :class="{ active: isLogin }">
				<div class="small-contain" key="smallContainRegister" v-if="isLogin">
					<div class="stitle">同学,你好!</div>
					<p class="scontent">开始注册,加入我们吧!</p>
					<button class="sbutton" @click="changeType">注册</button>
				</div>
				<div class="small-contain" key="smallContainLogin" v-else>
					<div class="stitle">欢迎回来!</div>
					<p class="scontent">请登录你的账户</p>
					<button class="sbutton" @click="changeType">登录</button>
				</div>
			</div>
		</div>

		<!-- 忘记密码 -->
		<el-dialog class="forgotpsw_dialog" title="提示" :visible.sync="dialogVisible" width="40%"
			:before-close="handleClose">
			<el-steps :active="active" finish-status="success" align-center>
				<el-step title="找回账号"></el-step>
				<el-step title="密保问题"></el-step>
				<el-step title="修改密码"></el-step>
			</el-steps>
			<hr>
			<div class="dialog_content_1" v-if="active === 0">
				找回账号：
				<el-input type="text" v-model.trim="forgotpswForm.username" placeholder="请填写要找回的账号"></el-input>
			</div>

			<div class="dialog_content_2" v-if="active === 1">
				<h3>请回答以下问题</h3>
				<div class="question_answer">
					问题1：{{ question.question_1 }}
					<el-input type="text" v-model.trim="forgotpswForm.answerInput_1" placeholder="请填写问题答案"></el-input>
				</div>
				<div class="question_answer">
					问题2：{{ question.question_2 }}
					<el-input type="text" v-model.trim="forgotpswForm.answerInput_2" placeholder="请填写问题答案"></el-input>
				</div>
				<div class="question_answer">
					问题3：{{ question.question_3 }}
					<el-input type="text" v-model.trim="forgotpswForm.answerInput_3" placeholder="请填写问题答案"></el-input>
				</div>
			</div>

			<div class="dialog_content_3" v-if="active === 2">
				<h3>修改密码</h3>
				<div class="editNewPwd">
					新密码：
					<el-input type="password" show-password v-model.trim="forgotpswForm.newPwd"
						placeholder="请输入新密码"></el-input>
				</div>
				<div class="editNewPwd">
					再次输入：
					<el-input type="password" show-password v-model.trim="forgotpswForm.reNewPwd"
						placeholder="请再次输入新密码"></el-input>
				</div>
			</div>

			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose()">取消</el-button>
				<el-button type="primary" @click="next()">下一步</el-button>
			</span>
		</el-dialog>
	</div>
</template>



<script>
import http from '../utils/request'
export default {
	name: 'login-register',
	data() {
		return {
			isLogin: true,
			ruleForm: {
				username: '',
				password: '',
				phone: '',
				nickname: '',
				code: ''
			},
			rules: {
				username: [
					{ required: true, message: '请输入账号', trigger: 'blur' },
					{ min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
				],
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
				nickname: [
					{ required: true, message: '请输入昵称', trigger: 'blur' },
					{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
				],
				code: [
					{ required: true, message: '请输入验证码', trigger: 'blur' }
				]
			},
			dialogVisible: false,
			active: 0,
			forgotpswForm: {
				username: '',
				answerInput_1: '',
				answerInput_2: '',
				answerInput_3: '',
				newPwd: '',
				reNewPwd: ''
			},
			question: {},
			checkCode: {
				code: '',
				codeText: ''
			}
		}
	},

	methods: {
		// 切换 登陆/注册
		changeType() {
			this.isLogin = !this.isLogin
			Object.keys(this.ruleForm).forEach(key => { this.ruleForm[key] = '' })
		},
		// 游客浏览模式
		visitor() {
			this.$router.push('/frontIndex')
		},
		// 登陆
		submitLoginForm(formName) {
			console.log('登录按钮被点击，开始表单验证...')
			console.log('表单数据:', this.ruleForm)
			console.log('验证码存储:', this.checkCode)
			this.$refs[formName].validate((valid) => {
				console.log('表单验证结果:', valid)
				if (valid) {
					console.log('验证码验证:', this.ruleForm.code, this.checkCode.codeText)
					console.log('验证码比较结果:', this.ruleForm.code.toLowerCase() === this.checkCode.codeText.toLowerCase())
					if (this.ruleForm.code.toLowerCase() !== this.checkCode.codeText.toLowerCase()) {
						this.$message.error('验证码错误！')
						this.ruleForm.code = ''
						this.getCode()
						return
					}
					console.log('准备发送登录请求...')
					http({
						method: 'post',
						url: 'http://127.0.0.1:3007/api/login',
						data: {
							username: this.ruleForm.username,
							password: this.ruleForm.password,
						}
					}).then((res) => {
						console.log('登录API响应:', res.data)
						if (res.data.status == 1) {
							this.$message({
								showClose: true,
								message: res.data.message,
								type: 'warning'
							})
							this.ruleForm.password = ''
							this.ruleForm.code = ''
							this.getCode()
						} else if (res.data.status == 0) {
							console.log('登录成功，开始处理token...')
							// 将 Token 信息存入 store 用于不同页面间的通信
							this.$store.dispatch('asyncUpdateUserToken', res.data.token)
							// 将 Token 信息存入 sessionStorage 用于全局前置路由守卫的判断
							sessionStorage.setItem("Token", res.data.token)
							console.log('Token已存储到sessionStorage')

							// 通过 Token 获取用户数据 并且添加到 store 中
							console.log('准备获取用户信息...')
							http({
								method: 'get',
								url: 'http://127.0.0.1:3007/my/getUserInfo',
								headers: {
									Authorization: res.data.token
								}
							}).then((userRes) => {
								console.log('获取用户信息响应:', userRes.data)
								if (userRes.data.data.loginLOA == '0') {
									this.$message.warning('您的账号已被停用！')
									return
								}
								// 将通过 Token 获取的用户信息存入 store 中
								this.$store.dispatch('asyncUpdateUserInfo', userRes.data.data)
								sessionStorage.setItem('state', JSON.stringify(userRes.data.data))
								console.log('用户信息已存储:', userRes.data.data)
								// 跳转到前台首页
								console.log('准备跳转到前台首页...')
								this.$router.push('/frontIndex')
								this.$message.success('登陆成功！', true)
								this.getUserTask()
								this.getUserNotice()
							}).catch((err) => {
								console.log('登陆注册页 获取用户数据失败！', err)
								console.log('获取用户信息错误详情:', err.response ? err.response.data : err.message)
							})
						}

					}).catch((err) => {
						console.log('登录请求失败:', err)
						console.log('错误详情:', err.response ? err.response.data : err.message)
						this.$message({
							showClose: true,
							message: err.response ? err.response.data.message : err.message,
							type: 'error'
						})
					})
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 注册
		submitRegisterForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.ruleForm.code.toLowerCase() !== this.checkCode.codeText.toLowerCase()) {
						this.$message.error('验证码错误！')
						this.ruleForm.code = ''
						this.getCode()
						return
					}
					http({
						method: 'post',
						url: 'http://127.0.0.1:3007/api/register',
						data: {
							username: this.ruleForm.username,
							password: this.ruleForm.password,
							phone: this.ruleForm.phone,
							nickname: this.ruleForm.nickname,
							identity: 2,
							createDate: this.getCurrentDate(),
						}
					}).then((res) => {
						if (res.data.status == 1) {
							this.$message({
								showClose: true,
								message: res.data.message,
								type: 'warning'
							})
						} else if (res.data.status == 0) {
							this.$message({
								showClose: true,
								message: res.data.message,
								type: 'success'
							})
							// 清空表单数据
							this.resetForm(formName)
							// 切换为登录界面
							this.isLogin = true
							// 重新获取验证码
							this.getCode()
						}
					}).catch((err) => {
						this.$message({
							showClose: true,
							message: err,
							type: 'error'
						})
					})
					// axios.post('http://127.0.0.1:3007/api/login', { username: this.ruleForm.username, password: this.ruleForm.password })
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 重置表单
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		// 获取图片验证码
		getCode() {
			console.log('开始获取验证码...');
			http({
				method: 'get',
				url: 'http://127.0.0.1:3007/api/public/checkCode'
			}).then((res) => {
				console.log('验证码接口响应:', res.data);
				if (res.data.status === 0) {
					this.checkCode.code = res.data.data.data
					this.checkCode.codeText = res.data.data.text
					console.log('验证码获取成功:', this.checkCode);
				} else {
					console.log('验证码获取失败:', res.data.message);
				}
			}).catch((err) => {
				console.log('验证码接口请求失败:', err);
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
		// 获取用户任务
		getUserTask() {
			let claimTask = []
			let revertTask = []
			http({
				method: 'get',
				url: 'http://127.0.0.1:3007/my/getUserClaimTask',
				headers: {
					Authorization: this.$store.getters.getUserToken,
				}
			}).then((res) => {
				if (res.data.status === 0) {
					claimTask = [...res.data.data]
					http({
						method: 'get',
						url: 'http://127.0.0.1:3007/my/getUserRevertTask',
						headers: {
							Authorization: this.$store.getters.getUserToken,
						}
					}).then((res) => {
						if (res.data.status === 0) {
							revertTask = [...res.data.data]
							if (claimTask.length != 0 || revertTask != 0) {
								this.$notify.info({
									title: '温馨提醒',
									dangerouslyUseHTMLString: true,
									duration: 10000, // 显示时间 毫秒 1000ms == 1s
									message: '<p>您当前待处理：</p><p>&emsp;' + claimTask.length + ' 个认领任务，</p><p>&emsp;' + revertTask.length + ' 个归还任务。</p><p>可在 个人中心 -> 任务管理 查看</P>',
									offset: 50
								})
							}
						}
					}).catch((err) => {
						console.log(err, "http请求失败");
					})
				}
			}).catch((err) => {
				console.log(err, "http请求失败");
			})
		},
		toView() {
			this.$route.push('/userHandleClaim')
		},
		// 获取用户通知
		getUserNotice() {
			let claimNotice = []
			let revertNotice = []
			http({
				method: 'get',
				url: 'http://127.0.0.1:3007/my/getUserClaimNotice',
				headers: {
					Authorization: this.$store.getters.getUserToken,
				}
			}).then((res) => {
				if (res.data.status === 0) {
					claimNotice = [...res.data.data]
					http({
						method: 'get',
						url: 'http://127.0.0.1:3007/my/getUserRevertNotice',
						headers: {
							Authorization: this.$store.getters.getUserToken,
						}
					}).then((res) => {
						if (res.data.status === 0) {
							revertNotice = [...res.data.data]
							let claimYes = claimNotice.filter((item) => { return item.res == 1 })
							let claimNo = claimNotice.filter((item) => { return item.res == 0 })
							let revertYes = revertNotice.filter((item) => { return item.res == 1 })
							let revertNo = revertNotice.filter((item) => { return item.res == 0 })
							if (claimYes.length != 0 && revertYes.length != 0) {
								this.$notify({
									dangerouslyUseHTMLString: true,
									duration: 10000, // 显示时间 毫秒 1000ms == 1s
									title: '申请审核通过',
									message: '<p>认领申请： ' + claimYes.length + ' 个已通过，</p><p>归还申请： ' + revertYes.length + ' 个已通过。<p>快去个人中心查看吧！</p>',
									type: 'success',
									offset: 50
								})
							} else if (revertYes.length != 0) {
								this.$notify({
									dangerouslyUseHTMLString: true,
									duration: 10000, // 显示时间 毫秒 1000ms == 1s
									title: '申请审核通过',
									message: '您有 ' + revertYes.length + ' 个归还申请已通过。<p>快去个人中心查看吧！</p>',
									type: 'success',
									offset: 50
								})
							} else if (claimYes.length != 0) {
								this.$notify({
									dangerouslyUseHTMLString: true,
									duration: 10000, // 显示时间 毫秒 1000ms == 1s
									title: '申请审核通过',
									message: '您有 ' + claimYes.length + ' 个认领申请已通过。<p>快去个人中心查看吧！</p>',
									type: 'success',
									offset: 50
								})
							}
							if (claimNo.length != 0 && revertNo.length != 0) {
								this.$notify({
									dangerouslyUseHTMLString: true,
									duration: 10000, // 显示时间 毫秒 1000ms == 1s
									title: '申请审核未通过',
									message: '<p>认领申请： ' + claimNo.length + ' 个未通过，</p><p>归还申请： ' + revertNo.length + ' 个未通过。<p>快去个人中心查看吧！</p>',
									type: 'error',
									offset: 150
								})
							} else if (revertNo.length != 0) {
								this.$notify({
									dangerouslyUseHTMLString: true,
									duration: 10000, // 显示时间 毫秒 1000ms == 1s
									title: '申请审核未通过',
									message: '您有 ' + revertNo.length + ' 个归还申请已通过。<p>申请描述越详细越有机会通过哦~</p>',
									type: 'error',
									offset: 150
								})
							} else if (claimNo.length != 0) {
								this.$notify({
									dangerouslyUseHTMLString: true,
									duration: 10000, // 显示时间 毫秒 1000ms == 1s
									title: '申请审核未通过',
									message: '您有 ' + claimNo.length + ' 个认领申请被驳回。<p>申请描述越详细越有机会通过哦~</p>',
									type: 'error',
									offset: 150
								})
							}

							// 修改 认领申请 审核结果表 的 isNotice 的值为 1（已提示）
							claimNotice.forEach((item) => {
								http({
									method: 'post',
									url: 'http://127.0.0.1:3007/my/updateNotice',
									headers: {
										Authorization: this.$store.getters.getUserToken,
									},
									params: {
										id: item.id
									}
								})
							})

							// 修改 归还申请 审核结果表 的 isNotice 的值为 1（已提示）
							revertNotice.forEach((item) => {
								http({
									method: 'post',
									url: 'http://127.0.0.1:3007/my/updateNotice',
									headers: {
										Authorization: this.$store.getters.getUserToken,
									},
									params: {
										id: item.id
									}
								})
							})
						}
					}).catch((err) => {
						console.log(err, "http请求失败");
					})
				}
			}).catch((err) => {
				console.log(err, "http请求失败");
			})



		},
		// -----------------------------------------修改密码-----------------------------------------------
		// dialog 关闭事件
		handleClose() {
			this.dialogVisible = false
			this.active = 0
			Object.keys(this.forgotpswForm).forEach(key => { this.forgotpswForm[key] = '' })
		},
		// 下一步
		next() {
			if (this.active === 0) {
				if (this.forgotpswForm.username) {
					this.active = 1
					this.getPswProtect()
				} else {
					this.$message.warning('请填写要找回的账号！')
				}
			} else if (this.active === 1) {
				if (this.forgotpswForm.answerInput_1 && this.forgotpswForm.answerInput_2 && this.forgotpswForm.answerInput_3) {
					this.verifyPswProtect()
				} else {
					this.$message.warning('请回答所有问题的答案！')
				}
			} else if (this.active === 2) {
				if (this.forgotpswForm.newPwd === this.forgotpswForm.reNewPwd) {
					this.updatePassword()
				}
			}
		},
		// 获取用户密保问题
		getPswProtect() {
			http({
				method: 'get',
				url: 'http://127.0.0.1:3007/api/public/getPswProtect',
				params: {
					username: this.forgotpswForm.username
				}
			}).then((res) => {
				if (res.data.status === 0) {
					console.log(res.data.data, 'res.data.data');
					this.question = { ...res.data.data[0] }
				} else {
					this.$message.error('此账号未设置密保问题！请联系管理员。')
					this.handleClose()
				}
			}).catch((err) => {
				console.log(err, 'err')
			})
		},
		// 验证密保问题
		verifyPswProtect() {
			http({
				method: 'post',
				url: 'http://127.0.0.1:3007/api/public/verifyPswProtect',
				params: {
					username: this.forgotpswForm.username,
					answer_1: this.forgotpswForm.answerInput_1,
					answer_2: this.forgotpswForm.answerInput_2,
					answer_3: this.forgotpswForm.answerInput_3
				}
			}).then((res) => {
				if (res.data.status === 0) {
					this.active = 2
				} else {
					this.$message.warning(res.data.message)
				}
			}).catch((err) => {
				console.log(err, 'err')
			})
		},
		// 修改密码
		updatePassword() {
			http({
				method: 'post',
				url: 'http://127.0.0.1:3007/api/public/updatePassword',
				params: {
					username: this.forgotpswForm.username,
					password: this.forgotpswForm.newPwd
				}
			}).then((res) => {
				if (res.data.status === 0) {
					this.active = 0
					this.dialogVisible = false
					Object.keys(this.forgotpswForm).forEach(key => { this.forgotpswForm[key] = '' })
					this.$message.success('密码修改成功！')
				} else {
					this.$message.warning(res.data.message)
				}
			}).catch((err) => {
				console.log(err, 'err')
			})
		}
	},
	mounted() {
		this.$refs.inputUsername.focus()
		this.getCode()
	},
}
</script>



<style lang="less" scoped>
.login-register {
	width: 100vw;
	height: 100vh;
	box-sizing: border-box;
	background-image: url("../assets/login_bg.JPG");
	background-size: cover;

	.forgotpsw_dialog {
		.dialog_content_1 {
			padding: 10px 0;
			text-align: center;

			.el-input {
				width: 250px;
			}
		}

		.dialog_content_2 {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.question_answer {
				display: flex;
				flex-direction: column;
				justify-content: center;

				// align-items: center;
				.el-input {
					width: 250px;
					margin: 5px 0;
				}
			}
		}

		.dialog_content_3 {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.editNewPwd {
				display: flex;
				flex-direction: column;
				justify-content: center;

				// align-items: center;
				.el-input {
					width: 250px;
					margin: 5px 0;
				}
			}
		}
	}
}

.contain {
	width: 60%;
	height: 65%;
	position: relative;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #fff;
	border-radius: 20px;
	box-shadow: 0 0 3px #f0f0f0,
		0 0 6px #f0f0f0;
}

.big-box {
	width: 70%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 30%;
	transform: translateX(0%);
	transition: all 1s;

	.sysname {
		height: 10%;
		text-align: center;
		font-weight: bolder;
		color: rgb(104, 205, 190);
		font-size: 2em;
		overflow: hidden;
	}
}

.big-contain {
	width: 100%;
	height: 90%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.btitle {
	font-size: 1.5em;
	font-weight: bold;
	color: rgb(57, 167, 176);
}

.bform {
	width: 100%;
	height: 40%;
	padding: 2em 0;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}

.bform .errTips {
	display: block;
	width: 50%;
	text-align: left;
	color: red;
	font-size: 0.7em;
	margin-left: 1em;
}

.bform input {
	width: 50%;
	height: 30px;
	border: none;
	outline: none;
	border-radius: 10px;
	padding-left: 2em;
	background-color: #f0f0f0;
}

.bbutton {
	width: 20%;
	height: 40px;
	border-radius: 24px;
	border: none;
	outline: none;
	background-color: rgb(57, 167, 176);
	color: #fff;
	font-size: 0.9em;
	cursor: pointer;
}

.small-box {
	width: 30%;
	height: 100%;
	background: linear-gradient(135deg, rgb(57, 167, 176), rgb(56, 183, 145));
	position: absolute;
	top: 0;
	left: 0;
	transform: translateX(0%);
	transition: all 1s;
	border-top-left-radius: inherit;
	border-bottom-left-radius: inherit;
}

.small-contain {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.stitle {
	font-size: 1.5em;
	font-weight: bold;
	color: #fff;
}

.scontent {
	font-size: 0.8em;
	color: #fff;
	text-align: center;
	padding: 2em 4em;
	line-height: 1.7em;
}

.sbutton {
	width: 60%;
	height: 40px;
	border-radius: 24px;
	border: 1px solid #fff;
	outline: none;
	background-color: transparent;
	color: #fff;
	font-size: 0.9em;
	cursor: pointer;
}

.big-box.active {
	left: 0;
	transition: all 0.5s;
}

.small-box.active {
	left: 100%;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	border-top-right-radius: inherit;
	border-bottom-right-radius: inherit;
	transform: translateX(-100%);
	transition: all 1s;
}
</style>
