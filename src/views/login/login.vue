<template>
  <div class="login">
    <el-form class="container" :model="form" :rules="rules" ref="form">
      <div class="avatar">
        <img src="../../assets/avatar.png" alt />
      </div>
      <el-form-item prop="username">
        <el-input
          placeholder="账号"
          prefix-icon="myicon myicon-user"
          v-model="form.username"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          placeholder="密码"
          prefix-icon="myicon myicon-key"
          v-model="form.password"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-button" type="primary" @click="check('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { checkUser } from '../../api/index.js'
export default {
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: blur }],
        password: [{ required: true, message: '请输入密码', trigger: blur }]
      }
    }
  },
  methods: {
    check (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          checkUser(this.form).then(res => {
            if (res.meta.status === 200) {
              // 存储本地token
              this.$store.commit('getUsername', res.data.username)
              localStorage.setItem('mytoken', res.data.token)
              this.$router.push('/index')
              console.log(res)
            } else {
              this.$message({
                showClose: true,
                message: res.meta.msg,
                type: 'error'
              })
            }
          })
        } else {
          console.log('登陆失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url(../../assets/bg1.jpg) no-repeat;
  background-size: cover;
  .container {
    padding: 50px 50px 0;
    width: 400px;
    height: 100px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-height: 200px;
    background-color: #fff;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: -60px;
      transform: translateX(-50%);
      background-color: red;
      z-index: 333;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .login-button {
      width: 100%;
    }
  }
}
</style>
