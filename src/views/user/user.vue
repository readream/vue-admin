<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/index/user'}">用户管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/index/users'}">用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 搜索框部分 -->
    <el-row>
      <el-col :span="24">
        <el-input
          placeholder="请输入内容"
          class="user-input"
          v-model="query"
          @keydown.native.enter="initData"
        >
          <el-button slot="append" icon="el-icon-search" @click="initData"></el-button>
        </el-input>
        <el-button type="success" plain @click="addDialogFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格部分 -->
    <el-table :data="tableData" style="width: 100%" border v-loading="loading">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="180"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="用户状态" width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.username =='admin'?true:false"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            plain
            @click="editUser(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            plain
            @click="deleteUser(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-check"
            plain
            :disabled="scope.row.username=='admin'?true:false"
            @click="getGrant(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <!-- 编辑用户 -->
    <el-dialog title="角色分配" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm" label-width="80px" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-tag type="success">{{grantForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色分配">
          <el-select v-model="itemId" placeholder="请选择角色">
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="(item,index) in grantList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        {{ itemId}}
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmGrant">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, changeState, addUser, queryUserById, updateUser, deleteUser, getGrant, grantUser } from '../../api/index'
export default {
  data () {
    return {
      tableData: [],
      loading: true, // 加载数据时显示动效
      query: '',
      // 总共条数,
      total: 0,
      pagesize: 5,
      pagenum: 1,
      addDialogFormVisible: false, // 添加用户弹框显示
      editDialogFormVisible: false, // 编辑用户弹框显示
      grantDialogFormVisible: false, // 角色分配弹框显示
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      grantForm: {
        username: ''
      },
      grantList: [], // 角色信息
      itemId: '', // 角色Id
      // 表单验证功能
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    // 处理分页时每页显示的条数
    handleSizeChange (val) {
      console.log(val)
      this.pagesize = val
      this.initData()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.initData()
    },
    // 获取表格数据
    initData () {
      getUser({
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        this.tableData = res.data.users
        this.total = res.data.total
        this.loading = false
      })
    },
    // 改变用户状态
    changeState (row) {
      changeState({ uId: row.id, type: row.mg_state }).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            message: '恭喜你，修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'warning'
          })
        }
      })
    },
    // 添加用户
    addUser (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          addUser(this.addForm).then(res => {
            if (res.meta.status === 201) {
              this.$message({
                message: '添加用户成功',
                type: 'success'
              })
              this.addDialogFormVisible = false
              this.initData()
            } else {
              this.$message({
                message: '添加用户失败',
                type: 'danger'
              })
            }
          })
        } else {
          console.log('error')
        }
      })
    },
    // 编辑用户
    editUser (row) {
      queryUserById(row.id).then(res => {
        if (res.meta.status === 200) {
          this.editForm.username = res.data.username
          this.editForm.email = res.data.email
          this.editForm.mobile = res.data.mobile
          this.editForm.id = res.data.id
        }
        this.editDialogFormVisible = true
      })
    },
    // 编辑完成后更新用户信息
    updateUser (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          updateUser(this.editForm).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.editDialogFormVisible = false
              this.initData()
            } else {
              this.$message({
                type: 'danger',
                message: '修改失败'
              })
            }
          })
        } else {
          console.log('err')
        }
      })
    },
    // 删除用户信息
    deleteUser (row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(row.id).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.initData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 获取角色列表
    getGrant (row) {
      this.grantDialogFormVisible = true
      this.grantForm = row
      console.log(row)
      getGrant().then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.grantList = res.data
        }
      })
    },
    // 分配角色
    confirmGrant () {
      console.log(this.grantForm.id, this.itemId)
      if (!this.itemId) {
        this.$message({
          type: 'danger',
          message: '请分配角色'
        })
      } else {
        grantUser({ id: this.grantForm.id, rid: this.itemId }).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '分配角色成功'
            })
            this.initData()
          } else {
            this.$message({
              type: 'danger',
              message: '分配角色失败'
            })
          }
        })
        this.grantDialogFormVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  .el-breadcrumb {
    background-color: rgb(158, 159, 246);
    height: 50px;
    line-height: 50px;
    color: #fff;
    padding-left: 10px;
  }
  .user-input {
    width: 300px;
    margin: 5px 5px 5px 0;
  }
}
</style>
