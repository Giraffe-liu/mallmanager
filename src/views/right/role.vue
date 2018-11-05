<template>
    <el-card>
        <el-row>
            <myBread level1="权限管理" level2="角色列表"></myBread>
        </el-row>
        <el-row>
            <el-button @click="showAddRole" class="btn" type="success">添加角色</el-button>
        </el-row>
        <el-row>
            <el-table :data="list" style="width: 100%">
                <!-- 展开列 -->
                 <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row class="elrow" v-for="item in scope.row.children" :key="item.id">
                            <!-- 显示一级 -->
                            <el-col :span="4" >
                                <el-tag @close="handleDelRight(scope.row,item.id)" type="warning" closable>{{item.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                                <el-row v-if="scope.row.children.length===0">
                                    <el-col :span="24">
                                        未分配权限
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="20">
                                <el-row class="elrow" v-for="item1 in item.children" :key="item1.id">
                                    <!-- 显示二级 -->
                                    <el-col :span="4">
                                        <el-tag @close="handleDelRight(scope.row,item1.id)" type="info" closable>{{item1.authName}}</el-tag>
                                        <i class="el-icon-arrow-right"></i>
                                    </el-col>
                                    <!-- 显示三级 -->
                                    <el-col :span="20">
                                        <el-tag @close="handleDelRight(scope.row,item2.id)" closable v-for="item2 in item1.children" :key="item2.id">{{item2.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 表格 -->
                <el-table-column type="index" label="#" width="80">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称" width="200">
                </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述" width="280">
                </el-table-column>
                <el-table-column label="操作">
                    <!-- 操作按钮 -->
                    <template slot-scope="scope">
                        <el-button @click="showEditRole(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button @click="handleDelRole(scope.row)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                        <el-button @click="showSetRoleDialog(scope.row)" plain size="mini" type="success" icon="el-icon-check" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 分配权限对话框 -->
        <el-row>
            <el-dialog
            title="分配权限"
            :visible.sync="roleDialog"
            width="40%"
            @close="closeRoleDialog">
            <el-row>
                <el-tree
                ref="tree"
                :data="roleData"
                node-key="id"
                :props="roleDefaultProps"
                :default-expanded-keys = "roleAllId"
                :default-checked-keys = "roleChecked"
                show-checkbox></el-tree>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleUpdataRole()">确 定</el-button>
            </span>
            </el-dialog>
        </el-row>
        <!-- 添加角色对话框 -->
        <el-row>
            <el-dialog title="添加角色" :visible.sync="addRoleDialog">
            <el-form :model="roleList">
                <el-form-item label="角色名称" label-width="120px">
                    <el-input v-model="roleList.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" label-width="120px">
                    <el-input v-model="roleList.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleAddRole">确 定</el-button>
            </div>
            </el-dialog>
        </el-row>
        <!-- 修改角色对话框 -->
        <el-row>
            <el-dialog @close="roleList={}" title="修改角色" :visible.sync="editRoleDialog">
            <el-form :model="roleList">
                <el-form-item label="角色名称" label-width="120px">
                    <el-input v-model="roleList.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" label-width="120px">
                    <el-input v-model="roleList.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleEditRole">确 定</el-button>
            </div>
            </el-dialog>
        </el-row>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 修改角色对话框
      editRoleDialog: false,
      // 添加角色对话框数据
      addRoleDialog: false,
      roleList: {},
      list: [],
      // 分配权限对话框所用数据
      roleDialog: false,
      roleData: [],
      roleDefaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 获取所有的权限id
      roleAllId: [],
      // 获取所有角色所包含的权限
      roleChecked: [],
      // 角色Id值
      roleId: -1
    }
  },
  created () {
    this.loadRoleData()
  },
  methods: {
    // 实现编辑角色
    async handleEditRole () {
      const res = await this.$http.put(`roles/${this.roleList.roleId}`, this.roleList)
      const {meta: {status}} = res.data
      if (status === 200) {
        this.$message.success('修改角色成功^_^')
        this.editRoleDialog = false
        this.loadRoleData()
      } else {
        this.$message.error('修改角色失败>_<')
      }
    },
    // 显示修改角色对话框
    async showEditRole (role) {
      this.editRoleDialog = true
      // 根据id值查找角色
      const res = await this.$http.get(`roles/${role.id}`)
      const {data, meta: { status }} = res.data
      if (status === 200) {
        this.roleList = data
      }
    },
    // 实现添加功能
    async handleAddRole () {
      const res = await this.$http.post('roles', this.roleList)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        this.addRoleDialog = false
        this.$message.success(msg + '^_^')
        this.loadRoleData()
      } else {
        this.$message.error(msg)
      }
    },
    // 显示添加角色对话框
    showAddRole () {
      this.addRoleDialog = true
    },
    // 删除角色
    handleDelRole (role) {
      this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {}).then(async () => {
        const res = await this.$http.delete(`roles/${role.id}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg + 'O_O')
          this.loadRoleData()
        } else {
          this.$message.error(msg)
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 改变角色的权限
    async handleUpdataRole () {
      // 使用ref绑定DOM元素，再使用this.$refs.tree.方法名，就可以直接调用树结构中的方法
      // roles/:roleId/rights
      // 获取为选中状态的数据的id值，返回值为一个数组
      const arr1 = this.$refs.tree.getCheckedKeys()
      // 获取选中状态为半选状态的数据的id值，返回值为一个数组
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      // 要求所传参数是一个以逗号分割的列表，合并两个数组，并变为用逗号分割的数据
      // 使用ES6的解构赋值
      const arr = [...arr1, ...arr2]
      const ridsId = arr.join(',')
      const res = await this.$http.post(`roles/${this.roleId}/rights`, {rids: ridsId})
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg + '^_^')
        this.loadRoleData()
      }
      this.roleDialog = false
    },
    // 展现分配角色
    async showSetRoleDialog (role) {
      this.roleId = role.id
      this.roleDialog = true
      // 获取所有权限列表
      const res = await this.$http.get('rights/tree')
      const {data} = res.data
      const {meta: {status}} = res.data
      if (status === 200) {
        this.roleData = data
        // 获取所有权限的id值，用来展开所有的树结构,因为展开最里面的数据外层数据也会默认展开，所以
        // 可以只添加最内层的数据
        data.forEach(item => {
          item.children.forEach(item1 => {
            item1.children.forEach(item2 => {
              this.roleAllId.push(item2.id)
            })
          })
        })
        // 获取角色的所有权限的id值，用来展示默认选中项
        role.children.forEach(item => {
          item.children.forEach(item1 => {
            item1.children.forEach(item2 => {
              this.roleChecked.push(item2.id)
            })
          })
        })
      }
    },
    // 分配权限对话框关闭后触发的事件
    closeRoleDialog () {
      this.roleAllId = []
      this.roleChecked = []
    },
    // 删除用户权限
    async handleDelRight (role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      const {data, meta: {msg, status}} = res.data
      if (status === 200) {
        role.children = data
        this.$message.success(msg + '^O^')
      } else {
        this.$message.error(msg)
      }
    },
    // 获取角色列表
    async loadRoleData () {
      const res = await this.$http.get('roles')
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.list = res.data.data
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
    .btn{
        margin-top:10px
    }
</style>
