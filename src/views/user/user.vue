<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <myBread level1="用户管理" level2="用户列表"></myBread>
    <!-- 搜索框 -->
    <el-row class="searchArea">
        <el-col :span="24">
            <el-input v-model="searchVal" class="searchInput" clearable placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
            </el-input>
            <el-button @click="addUserDialog" type="success" plain>添加用户</el-button>
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
                <el-button @click="editUserDialog(scope.row.id)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="handleDel(scope.row)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                <el-button @click="RoleDialog(scope.row)" plain size="mini" type="success" icon="el-icon-check" circle></el-button>
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
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog">
        <el-form :model="formData">
            <el-form-item label="用户名" label-width="100px">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="100px">
                <el-input v-model="formData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="100px">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addDialog = false">取 消</el-button>
            <el-button @click="handleAdd">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog @close="formData={}" title="编辑用户" :visible.sync="editDialog">
        <el-form :model="formData">
            <el-form-item label="用户名" label-width="100px">
                <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="100px">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="editDialog = false">取 消</el-button>
            <el-button @click="handleEdit()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
     <el-dialog title="分配角色" :visible.sync="setRoleDialog">
        <el-form label-width="100px">
            <el-form-item label="用户名">
                {{currentUsername}}
            </el-form-item>
             <el-form-item label="角色">
                <el-select v-model="currentRoleId">
                    <el-option disabled label="请选择" :value="-1">
                    </el-option>
                    <el-option
                    v-for="item in roles"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialog = false">取 消</el-button>
            <el-button @click="handleSetRole()">确 定</el-button>
        </div>
    </el-dialog>
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
      pagesize: 6,
      total: 0,
      // 加载动画属性
      loading: true,
      // 搜索关键字
      searchVal: '',
      // 添加用户对话框中的属性
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addDialog: false,
      // 编辑用户对话框中的属性
      editDialog: false,
      // 分配角色对话框中的属性
      setRoleDialog: false,
      currentUsername: '',
      currentUserId: -1,
      currentRoleId: -1,
      roles: []
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    // 修改用户角色
    async handleSetRole () {
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {rid: this.currentRoleId})
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.loadData()
        this.$message.success(msg + '^O^')
        this.setRoleDialog = false
      } else {
        this.$message.error(msg)
      }
      console.log(res)
    },
    // 渲染角色分配对话框
    async RoleDialog (user) {
      // this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      this.setRoleDialog = true
      this.currentUsername = user.username
      this.currentUserId = user.id
      console.log(this.currentUserId)
      const res = await this.$http.get(`users/${user.id}`)
      this.currentRoleId = res.data.data.rid
      const res1 = await this.$http.get('roles')
      this.roles = res1.data.data
    },
    // 处理编辑功能
    async handleEdit () {
      await this.$http.put(`users/${this.formData.id}`, this.formData)
        .then(res => {
          const {meta: {msg, status}} = res.data
          if (status === 200) {
            this.$message.success(msg + '^O^')
            this.editDialog = false
            this.formData = {}
            this.loadData()
          } else {
            this.$message.error(msg)
          }
        })
    },
    // 渲染编辑用户对话框
    async editUserDialog (id) {
      this.editDialog = true
      await this.$http.get(`users/${id}`)
        .then(res => {
          const data = res.data
          this.formData = data.data
        })
    },
    // 处理添加用户
    async handleAdd () {
      // this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      await this.$http.post('users', this.formData)
        .then(res => {
          const {meta: {msg, status}} = res.data
          if (status === 201) {
            this.$message.success(msg + '^O^')
            this.addDialog = false
            this.formData = {}
            this.loadData()
          } else {
            this.$message.error(msg)
          }
        })
    },
    // 渲染添加用户对话框
    addUserDialog () {
      this.addDialog = true
    },
    // 删除用户信息
    handleDel (user) {
      // this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      this.$confirm('此操作将永久删除，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const res = await this.$http.delete(`users/${user.id}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.loadData()
          this.$message.success(msg + '^O^')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // 处理用户状态改变
    async handleChangeUserStatus (user) {
      // this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      const data = res.data
      const {meta: {msg, status}} = data
      if (status === 200) {
        this.$message.success(msg + '^O^')
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
    },
    // 处理每页有多少条
    handleSizeChange (val) {
      this.pagesize = val
      this.loadData()
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
