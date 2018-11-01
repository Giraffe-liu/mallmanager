<template>
    <div class="login-wrap">
        <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
            <el-form-item label="用户名">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formData.password"></el-input>
            </el-form-item>
            <el-button @click.prevent="handleLogin" class="login-button" type="primary">登录</el-button>
        </el-form>
    </div>
</template>
<script>
export default {
  data () {
    return {
      formData: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    // 验证登录
    handleLogin () {
      this.$http.post('login', this.formData).then(res => {
        const { meta } = res
        if (meta.status === 200) {
          console.log(meta)
        } else {
          this.$message.error(meta.msg)
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
