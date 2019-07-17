<template>
  <div class="goodList">
    <!-- 导航部分 -->
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/index/goods'}">商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 商品搜索 -->
    <el-row>
      <el-col :span="24">
        <el-input
          placeholder="请输入内容"
          v-model="query"
          @keyup.enter.native="queryGoods"
          class="query-input"
        >
          <el-button slot="append" icon="el-icon-search" @click="queryGoods"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格部分 -->
    <template>
      <el-table :data="goodList" border style="width: 100%" class="data-table" v-loading="loading">
        <el-table-column type="index" width="50" label="编号"></el-table-column>
        <el-table-column prop="goods_id" label="商品ID" width="80px"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="400px"></el-table-column>
        <el-table-column prop="goods_price" label="价格" width="100px"></el-table-column>
        <el-table-column prop="goods_number" label="数量" width="100px"></el-table-column>
        <el-table-column prop="goods_weight" label="重量" width="100px"></el-table-column>
        <el-table-column label="商品状态" width="100px">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ handleState(scope.row.goods_state) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="200px">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ dateFormat(scope.row.add_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="200px">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ dateFormat(scope.row.upd_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hot_mumber" label="热销品数量" width="80px"></el-table-column>
        <el-table-column label="是否是热销品" width="80px">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.is_promote == true ?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              plain
              @click="editGood(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              plain
              @click="deleteGood(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 编辑商品 -->
    <el-dialog title="商品名称" :visible.sync="editDialogFormVisible" width="650px">
      <el-form :model="editGoodList" class="eid-input" :rules="rules" ref="editGoodList">
        <el-form-item label="商品名称" label-width="110px" prop="goods_name">
          <el-input v-model="editGoodList.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="110px" prop="goods_price">
          <el-input v-model="editGoodList.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" label-width="110px" prop="goods_number">
          <el-input v-model="editGoodList.goods_number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重量" label-width="110px" prop="goods_weight">
          <el-input v-model="editGoodList.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="介绍" label-width="110px" prop="goods_introduce">
          <el-input autocomplete="off" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="eidDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsList('editGoodList')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodList,
  editGoods,
  queryGoodsById,
  deleteGoods
} from '../../api/index.js'
export default {
  data () {
    return {
      goodList: [], // 数据库获取的商品列表数据
      query: '', // 查询参数---
      pagenum: 1, // 查阅页码数 默认为1
      pagesize: 10, // 每页显示的条数 默认为10
      total: 0, // 总共的条目数
      loading: true, // 数据加载中效果
      editDialogFormVisible: false, // 商品编辑的显影
      editGoodList: {}, // 商品数据源
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    // 初始化商品数据
    initData () {
      // 请求后台数据
      this.loading = true
      getGoodList({
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        if (res.meta.status === 200) {
          this.loading = false
          this.goodList = res.data.goods
          this.total = res.data.total
        }
      })
    },
    queryGoods () {
      // 查询商品
      this.initData()
    },
    // 删除商品根据id
    deleteGood (row) {
      // console.log(row);
      // 向服务器发起请求
      deleteGoods(row.goods_id).then(res => {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
              // 重新请求刷新数据
              this.initData()
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      })
    },
    // 编辑商品 根据id查询商品
    editGood (row) {
      this.editDialogFormVisible = true
      queryGoodsById(row.goods_id).then(res => {
        if (res.meta.status === 200) {
          this.editGoodList = res.data
        }
      })
    },
    // 编辑向服务器提交商品
    editGoodsList (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          // 如果校验通过发起向服务器请求
          var params = {
            id: this.editGoodList.goods_id,
            goods_name: this.editGoodList.goods_name,
            goods_price: this.editGoodList.goods_price,
            goods_number: this.editGoodList.goods_number,
            goods_weight: this.editGoodList.goods_weight,
            goods_introduce: '',
            pics: '',
            attrs: []
          }
          editGoods(params).then(res => {
            // console.log(res);
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '商品数据更新成功'
              })
            } else if (res.meta.status === 400) {
              this.$message({
                type: 'danger',
                message: '服务器请求参数错误！联系管理员'
              })
            }
            // 关闭该对话框
            this.eidDialogFormVisible = false
            // 重新向服务器发起请求
            this.initData()
          })
        }
      })
    },
    // 处理商品状态
    handleState (state) {
      if (state === 0) {
        return '未通过'
      } else if (state === 1) {
        return '审核中'
      } else {
        return '已审核'
      }
    },
    // 格式化时间
    dateFormat (time) {
      var date = new Date(time)
      var y = date.getFullYear()
      var M = date.getMonth() + 1
      var d = date.getDate()
      var h = date.getHours()
      var m = date.getMinutes()
      var s = date.getSeconds()
      return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
    },
    // 分页处理的两个函数
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val
      // 数据初始化
      this.initData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.goodList {
  .query-input {
    width: 300px;
  }
  .mg-button {
    margin-left: 15px;
  }
  .data-table {
    margin: 10px 0;
    overflow: auto;
  }
  .eid-input {
    .el-input {
      width: 400px;
    }
  }
}
</style>
