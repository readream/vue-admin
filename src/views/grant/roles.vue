<template>
  <div class="roles">
    <!-- 导航部分 -->
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/index/roles'}">权限管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/index/roles'}">角色列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <!-- 添加角色 -->
    <el-button type="primary" plain @click="addRole">添加角色</el-button>

    <!-- 表格部分 -->
    <template class="role-table">
      <el-table :data="roleList" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="firstRoleListChildren in scope.row.children"
              :key="firstRoleListChildren.id"
            >
              <el-col :span="4">
                <el-tag
                  closable
                  @close="deleteRole(scope.row,firstRoleListChildren.id)"
                >{{ firstRoleListChildren.authName }}</el-tag>
                <i class="el-icon-arrow-right" v-if="scope.row.children.length ==0?false:true"></i>
              </el-col>
              <el-col :span="20">
                <el-row
                  v-for="secondRoleListChildren in firstRoleListChildren.children"
                  :key="secondRoleListChildren.id"
                >
                  <el-col :span="4">
                    <el-tag
                      closable
                      type="success"
                      @close="deleteRole(scope.row,secondRoleListChildren.id)"
                    >{{ secondRoleListChildren.authName }}</el-tag>
                    <i class="el-icon-arrow-right" v-if="scope.row.children.length ==0?false:true"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      closable
                      type="danger"
                      @close="deleteRole(scope.row,lastRoleListChildren.id)"
                      v-for="lastRoleListChildren in secondRoleListChildren.children"
                      :key="lastRoleListChildren.id"
                    >{{ lastRoleListChildren.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="角色" prop="roleName" width="120px"></el-table-column>
        <el-table-column label="描述" prop="roleDesc" width="120px"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.username =='admin'?true:false"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              plain
              title="编辑角色"
              @click="eidRole(scope.row)"
            ></el-button>
            <el-button
              :disabled="scope.row.username =='admin'?true:false"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              plain
              title="删除角色"
              @click="deleteRoleById(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-check"
              plain
              title="编辑权限"
              @click="confirmRight(scope.row)"
              :disabled="scope.row.username =='admin'?true:false"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 授权部分管理 -->
    <el-dialog title="编辑权限" :visible.sync="grantDialogFormVisible">
      <div class="row-tree">
        <el-tree
          ref="tree"
          :data="rightList"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="selectedRightId"
          :props="defaultProps"
        ></el-tree>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleRight()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="80px">
        <el-form-item label="角色" prop="roleName">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleName('roleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible">
      <el-form :model="editroleForm" :rules="rules" ref="editroleForm" label-width="80px">
        <el-form-item label="角色" prop="roleName">
          <el-input v-model="editroleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editroleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidRoleName('editroleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGrant,
  deleteRoleRight,
  addRole,
  deleteRoleById,
  queryRoleById,
  eidRoleById,
  getRights,
  roelRight
} from '../../api/index.js'
export default {
  data () {
    return {
      roleList: [],
      loading: true,
      rightList: [], // 所有tree状 角色信息
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      grantDialogFormVisible: false,
      seletedRoel: {}, // 被选中的角色包含的信息，用来处理id
      selectedRightId: [], // 被选中角色的ID
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleForm: {}, // 角色对象
      editroleForm: {}, // 通过id获取的角色信息
      rules: {
        // 添加角色表单校验
        roleName: [
          { required: true, message: '请输入角色名字', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入描述文字', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initRoleData()
  },
  methods: {
    // 初始化数据
    initRoleData () {
      getGrant().then(res => {
        if (res.meta.status === 200) {
          this.roleList = res.data
          console.log(this.roleList)
        }
      })
    },
    // 删除分配权限
    deleteRole (row, id) {
      console.log(row)
      deleteRoleRight({ roleId: row.id, rightId: id }).then(res => {
        if (res.meta.status === 200) {
          // this.scope.row = res.data;
          row.children = res.data
          this.$message({
            type: 'success',
            message: '取消权限成功'
          })
        } else {
          this.$message({
            type: 'danger',
            message: '取消权限失败'
          })
        }
      })
    },
    // 编辑权限
    confirmRight (row) {
      console.log(row)
      this.seletedRoel = row // 将传递过来的数据保存到选中角色id 上
      getRights({ type: 'tree' }).then(res => {
        this.grantDialogFormVisible = true
        if (res.meta.status === 200) {
          this.rightList = res.data
          console.log(this.rightList)
        } else {
          this.$message({
            type: 'danger',
            message: '数据获取失败'
          })
        }
        // 在操作遍历id之前必须清空之前保存的iD
        this.selectedRightId = []
        // 操作选中角色信息 ，遍历拿出id
        this.seletedRoel.children.forEach(list => {
          if (list.children && list.children.lenght !== 0) {
            list.children.forEach(list => {
              // console.log(list.id);
              this.selectedRightId.push(list.id)
            })
          }
        })
      })
    },
    // 角色授权
    roleRight () {
      var roleId = this.$refs.tree.getCheckedKeys().join(',') // 数组必须转成 以 , 分割的权限ID列表
      roelRight(this.seletedRoel.id, { rids: roleId }).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            tyep: 'success',
            message: '权限分配成功'
          })
        } else {
          this.$message({
            type: 'danger',
            message: '权限分配失败'
          })
        }
        this.grantDialogFormVisible = false
        this.initRoleData()
      })
    },
    // 添加角色
    addRole () {
      this.addDialogFormVisible = true
    },
    // 添加角色后上传
    addRoleName (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          console.log(this.roleForm)
          addRole({
            roleName: this.roleForm.roleName,
            roleDesc: this.roleForm.roleDesc
          }).then(res => {
            console.log(res)
            if (res.meta.status === 201) {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              this.addDialogFormVisible = false
              this.initRoleData()
            } else {
              this.$message({
                type: 'danger',
                message: '创建失败'
              })
            }
          })
        } else {
          console.log('err')
        }
      })
    },
    // 删除角色
    deleteRoleById (row) {
      this.$confirm('此操将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRoleById({ id: row.id }).then(res => {
            // console.log(res);
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.initRoleData() // 删除成功之后重新加载该页面
            } else {
              this.$message({
                type: 'danger',
                message: '删除失败!'
              })
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
    // 编辑角色
    eidRole (row) {
      queryRoleById({ id: row.id }).then(res => {
        // console.log(res);
        if (res.meta.status === 200) {
          this.editroleForm = res.data
          this.editDialogFormVisible = true
        } else {
          this.$message({
            type: 'danger',
            message: '数据获取失败，请联系管理员'
          })
        }
      })
    },
    // 提交编辑角色信息
    eidRoleName (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          // 调用编辑提交的api    这个id 接口真的难调用————---
          // console.log(1);
          eidRoleById({
            id: this.editroleForm.roleId,
            roleName: this.editroleForm.roleName,
            roleDesc: this.editroleForm.roleDesc
          }).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '信息编辑成功'
              })
              this.initRoleData()
              this.editDialogFormVisible = false
              console.log(res)
            } else {
              this.$message({
                type: 'danger',
                message: '信息编辑失败'
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.roles {
  .el-breadcrumb {
    background-color: rgb(158, 159, 246);
    height: 50px;
    line-height: 50px;
    color: #fff;
    padding-left: 10px;
  }
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .row-tree {
    height: 300px;
    overflow: auto;
  }
}
</style>
