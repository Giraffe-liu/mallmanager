<template>
<el-container class="container">
    <el-header class="header">
        <el-row>
            <el-row>
                <el-col :span="4">
                    <!-- <div class="grid-content bg-purple"> -->
                    <img src="../assets/logo.png" alt="">
                    <!-- </div> -->
                </el-col>
                <el-col :span="19" class="middle">
                    <h2>电商后台管理系统</h2>
                </el-col>
                <el-col :span="1"><a href="#" class="loginout" @click="handleLoginOut">退出</a></el-col>
            </el-row>
        </el-row>
    </el-header>
    <el-container>
        <el-aside class="aside" width="200px">
            <el-menu default-active="1" :unique-opened="true" class="el-menu-vertical-demo menu" :router="true">
                <el-submenu v-for="(item, index) in menus" :key="item.id" :index="index + ''">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item v-for="item1 in item.children" :key="item1.id" :index="item1.path">
                            <i class="el-icon-menu"></i>
                            {{item1.authName}}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  // 如果用户没登录就无法进入home页
  beforeCreate () {
    // 从sessionStorage中获取用户登录时存入的token信息
    const token = sessionStorage.getItem('token')
    if (!token) {
      this.$router.push({name: 'login'})
      this.message.warning('请先登录')
    }
  },
  created () {
    this.getAllMenu()
  },
  methods: {
    // 获取所有的menu值,动态设置侧边栏的展示
    async getAllMenu () {
      const res = await this.$http.get('menus')
      console.log(res)
      this.menus = res.data.data
    },
    handleLoginOut () {
      if (confirm('确定要退出吗？')) {
        // 删除session中的token
        sessionStorage.clear()
        // 清空后跳转到登录页
        this.$router.push({name: 'login'})
        // 弹出提示框
        this.$message.success('退出成功')
      }
    }
  }
}
</script>

<style>
.container {
    height: 100%;
}

.header {
    background: #b3c0d1;
}

.header .middle {
    line-height: 60px;
    color: #fff;
    text-align: center;
}

.header .loginout {
    line-height: 60px;
    text-decoration: none;
}

.aside {
    background: #d3dce6;
}
.aside .menu {
    height: 100%;
}
.main {
    background: #e9eef3;
    height: 100%;
}
</style>
