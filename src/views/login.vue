<template>
    <div class="login-wrap">
        <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
            <el-form-item label="用户名">
                <el-input v-model="formData.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formData.password"></el-input>
            </el-form-item>
            <el-button @click="handleLogin" class="login-button" type="primary">登录</el-button>
        </el-form>
    </div>
</template>
<script>
export default {
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 验证登录
    async handleLogin () {
      await this.$http.post('login', this.formData).then(res => {
        const { data } = res
        const { meta: {status, msg} } = data
        if (status === 200) {
          // 获取数据中的token
          const token = data.data.token
          // 将token存储在sessionStorage中
          sessionStorage.setItem('token', token)
          this.$message.success(msg)
          this.$router.push({name: 'home'})
        } else {
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>
<style>
    .login-wrap{
        background: #324152;
        height: 100%;
        display: flex;
        justify-content:center;
        align-items:center;
    }
    .login-wrap .login-form{
        background: #fff;
        width: 400px;
        padding:30px;
        border-radius: 20px;
    }
    .login-wrap .login-button{
        width:100%;
    }
</style>
