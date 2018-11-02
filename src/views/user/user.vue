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
            <el-input class="searchInput" clearable placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" plain>添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 表格 -->
    <template>
        <el-table :data="list" style="width: 100%">
            <el-table-column type="index" label="#" width="80">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="100">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" width="180">
            </el-table-column>
            <el-table-column prop="create_time" label="创建日期" width="180">
            </el-table-column>
            <el-table-column label="用户状态">
                <!-- 用户状态开关 -->
                <template slot-scope="scope">
                    <el-switch
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
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </template>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      pagenum: 1,
      pagesize: 2,
      total: 0
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    handleCurrentChange (val) {
      console.log(val)
    },
    handleSizeChange (val) {
      console.log(val)
    },
    async loadData () {
      const res = await this.$http.get('users', {
        headers: {
          Authorization: window.sessionStorage.getItem('token')
        },
        params: {
          pagenum: 1,
          pagesize: 10
        }
      })
      const {data: {data: { users }}} = res
      this.list = users
      console.log(this.list)
    }
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
