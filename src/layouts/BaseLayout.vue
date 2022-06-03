<template>
  <el-container class="cenhai-body">
    <el-header >
      <div class="cenhai-header-log">
        <img src="/public/static/image/logo.png">
        <span>cenhai管理系统</span>
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <template v-for="item in breadcrumbData" :key="item.path">
          <el-breadcrumb-item>{{item.meta.title}}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
      <div style="float: right;margin-right: 40px">
        <ul class="cenhai-header-right-menu">
          <li>
            <a href="javascript:;" @click="refresh">
              <el-icon color="#000" size="20px"><RefreshLeft /></el-icon>
            </a>
          </li>
          <li>
            <a href="javascript:;">
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="全屏"
                  placement="bottom"
              >
                <el-icon color="#000" size="20px"><FullScreen /></el-icon>
              </el-tooltip>
            </a>
          </li>
          <li>
            <a href="javascript:;">
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="新消息"
                  placement="bottom"
              >
                <el-icon color="#000" size="20px"><ChatLineRound /></el-icon>
              </el-tooltip>
            </a>
          </li>
          <li class="cenhai-header-right-avatar">
            <el-dropdown>
              <el-avatar :size="30" v-if="userInfo" :src="userInfo.headimgurl" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push({path:'/profile'})">个人信息</el-dropdown-item>
                  <el-dropdown-item @click="editPasswordDialogVisible = true">修改密码</el-dropdown-item>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </li>
        </ul>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" >
        <global-menu></global-menu>
      </el-aside>
      <el-main>
        <global-tabs></global-tabs>
        <global-content/>
      </el-main>
    </el-container>

    <el-dialog
        v-model="editPasswordDialogVisible"
        title="修改密码"
        width="400px"
    >
      <password />
    </el-dialog>

  </el-container>


</template>

<script setup>
import GlobalMenu from "@/layouts/GlobalMenu.vue";
import GlobalTabs from "@/layouts/GlobalTabs.vue";
import GlobalContent from "@/layouts/GlobalContent.vue";
import { FullScreen,ChatLineRound,RefreshLeft } from '@element-plus/icons-vue'
import Password from "@/components/Password.vue"
import {useUserStore} from "../store/user";
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {useAppStore} from "../store/app";

const userInfo = ref()
const userStore = useUserStore()
const appStore = useAppStore()
const route = useRoute()
const router = useRouter()
const breadcrumbData = ref(route.matched)
const editPasswordDialogVisible = ref(false)

const refresh = () => {
  appStore.$state.routerAlive = false
  setTimeout(function () {
    appStore.$state.routerAlive = true
  },500)
}

const logout = () => {
  userStore.logout()
  ElMessage({
    message: "退出登录成功～即将前往登录页面...",
    type: 'success'
  })
  setTimeout(function () {
    router.push({path:"/login"})
  },1000)
}

watch(route, function () {
  breadcrumbData.value = route.matched
})

userStore.getUserInfo().then(data => {
  userInfo.value = data.userInfo
})

</script>

<style scoped>
.cenhai-body{
  height: 100%;
}
.cenhai-header-log{
  width: 199px;
  background-color: #393d49;
  height: 50px;
  float: left;
}
.cenhai-header-log > img{
  width: 30px;
  height: 30px;
  float: left;
  margin: 10px 10px 10px 10px;
}
.cenhai-header-log > span {
  color: #f2f2f2;
  font-size: 16px;
  line-height: 50px;
}
.el-header{
  padding: 0px;
  height: 50px;
  border-bottom: 1px #ddd solid;
}
.el-main{
  padding: 0px;
}
.el-breadcrumb{
  line-height: 50px;
  float: left;
  margin-left: 10px;
}
.cenhai-header-right-menu, .cenhai-header-right-menu li{
  list-style: none;
  float: left;
}
.cenhai-header-right-menu li a{
  display:block;
  text-align:center;
  text-decoration:none;
  color: black;
  padding: 0px 10px;
}
.cenhai-header-right-avatar{
  position: relative;
  top: -10px;
  margin-left: 10px;
}
</style>