<template>
    <el-card>
        <myBread level1="权限管理" level2="权限列表"></myBread>
        <el-table class="eltable"
            :data="tableData"
            border
            height="500px"
            style="width: 100%, text-align: center">
            <el-table-column
            type="index"
            label="#"
            width="180">
            </el-table-column>
            <el-table-column
            prop="authName"
            label="权限名称"
            width="180">
            </el-table-column>
            <el-table-column
            prop="path"
            label="路径">
            </el-table-column>
            <el-table-column label="层级">
                <template slot-scope="scope">
                    <span v-if="scope.row.level==='0'">一级</span>
                    <span v-if="scope.row.level==='1'">二级</span>
                    <span v-if="scope.row.level==='2'">三级</span>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const res = await this.$http.get(`rights/list`)
      console.log(res)
      const data = res.data.data
      console.log(data)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.tableData = data
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
    .eltable{
        margin-top:20px
    }
</style>
