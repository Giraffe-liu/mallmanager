<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'myBread',
  props: ['level1', 'level2']
}
</script>

<style>

</style>
