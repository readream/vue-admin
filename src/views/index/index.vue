<template>
  <div class="main">
    <el-container>
      <el-aside width="auto">
        <div class="logo">LOGO</div>
        <el-menu
          :unique-opened="true"
          :router="true"
          class="aside-nav-bar"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
        >
          <el-submenu v-for="list in menuList" :key="list.id" :index="list.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{list.authName}}</span>
            </template>
            <el-menu-item
              :index="secondList.path"
              v-for="secondList in list.children"
              :key="secondList.id"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ secondList.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <i class="myicon myicon-menu button-icon" @click="changeCollapse"></i>
          <div class="text">基于vue开发的后台管理系统</div>
          <div>
            <!-- $store.getters.username  是直接通过属性访问-->
            <span class="user-name">用户: {{$store.getters.username}}</span>
            <el-button type="text" @click="clearUser">退出</el-button>
          </div>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenu } from '../../api/index.js'
export default {
  data () {
    return {
      menuList: [], // 存放菜单数组
      isCollapse: false
    }
  },
  created () {
    // 在页面创建之前，获取菜单列表
    getMenu().then(res => {
      if (res.meta.status === 200) {
        this.menuList = res.data
      } else {
        this.$message({
          type: 'danger',
          message: '数据获取失败，请与管理员联系'
        })
      }
    })
  },
  methods: {
    handleOpen () { },
    handleClose () { },
    // 折叠事件
    changeCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 退出
    clearUser () {
      // 清除本地token和username
      localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  // 左侧
  .el-container {
    width: 100%;
    height: 100%;
    .el-aside {
      width: auto !important;
      height: 100%;
      background-color: rgb(84, 92, 100);
      .logo {
        height: 60px;
        width: 100%;
        background-color: rgb(84, 92, 100);
        color: #fff;
        font-size: 20px;
        font-weight: 1000;
        line-height: 60px;
        text-align: center;
      }
      .aside-nav-bar:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
        border: none;
      }
    }
    .el-header {
      background-color: rgb(84, 92, 100);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .text {
        font-size: 28px;
        color: #fff;
      }
      .button-icon {
        font-size: 30px;
        color: #fff;
        cursor: pointer;
      }
      .user-name {
        font-size: 14px;
        color: #fff;
        margin-right: 15px;
      }
    }
  }
}
</style>
