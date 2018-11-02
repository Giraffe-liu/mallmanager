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
                    <el-col :span="19" class="middle"><h2>电商后台管理系统</h2></el-col>
                    <el-col :span="1"><a href="#" class="loginout">退出</a></el-col>
                </el-row>
            </el-row>
        </el-header>
    <el-container>
      <el-aside class="aside" width="200px">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {

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
        color:#fff;
        text-align: center;
    }
    .header .loginout {
        line-height:60px;
        text-decoration: none;
    }
    .aside {
        background: #d3dce6;
    }
    .main {
        background: #e9eef3;
        height: 100%;
    }
</style>
