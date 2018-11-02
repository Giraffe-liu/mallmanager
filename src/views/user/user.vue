<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchArea">
        <el-col :span="24">
            <el-input v-model="searchVal" class="searchInput" clearable placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
            </el-input>
            <el-button type="success" plain>添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table  v-loading="loading" :data="list" style="width: 100%">
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column label="创建日期" width="180">
            <template slot-scope="scope">
                {{scope.row.create_time | fmDate('YYYY-MM-DD')}}
            </template>
        </el-table-column>
        <el-table-column label="用户状态">
            <!-- 用户状态开关 -->
            <template slot-scope="scope">
                <el-switch
                @change="handleChangeUserStatus(scope.row)"
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <!-- 操作按钮 -->
            <template slot-scope="scope">
                <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                <el-button plain size="mini" type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>
        <!-- 分页 -->
    <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[2, 4, 6, 8]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户数据的数组
      list: [],
      // 分页相关属性
      pagenum: 1,
      pagesize: 2,
      total: 0,
      // 加载动画属性
      loading: true,
      // 搜索关键字
      searchVal: ''
    }
  },
  methods: {
    // 处理用户状态改变
    async handleChangeUserStatus (user) {
      // this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      // this.loadData()
      console.log(res)
      const data = res.data
      const {meta: {msg, status}} = data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    // 处理搜索功能
    handleSearch () {
      // 将pagenum和pagesize的值再次设置为初始值，这样数据才会从第一页开始展示
      this.pagenum = 1
      this.pagesize = 2
      this.loadData()
    },
    // 处理当前展示的是第几页
    handleCurrentChange (val) {
      this.pagenum = val
      this.loadData()
      console.log(this.pagesize)
    },
    // 处理每页有多少条
    handleSizeChange (val) {
      this.pagesize = val
      this.loadData()
      console.log(this.pagenum)
    },
    // 页面加载完成
    async loadData () {
      this.loading = true
      const res = await this.$http.get('users', {
        headers: {
          Authorization: window.sessionStorage.getItem('token')
        },
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.searchVal
        }
      })
      this.loading = false
      const data = res.data
      const {meta: { msg, status }} = data
      if (status === 200) {
        const {data: {users, total}} = data
        this.list = users
        this.total = total
        // console.log(this.pagesize, this.pagenum, this.total)
      } else {
        this.$message.error(msg)
      }
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style>
.box-card {
    height: 100%;
}

.searchArea {
    margin-top: 10px;
    margin-bottom: 10px;
}

.searchArea .searchInput {
    width: 350px;
}
</style>
