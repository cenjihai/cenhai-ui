<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="230px" v-if="userInfo" style="text-align: center;padding-top: 20px">
        <el-avatar :size="80" :src="userInfo.headimgurl" />
        <span style="display: block;font-size: 14px;color: #4a4a4a;margin-top: 10px">欢迎您，{{userInfo.nickname}}</span>
        <el-divider />
        <div style="margin: auto" class="cenhai-tabs">
          <el-tabs v-model="tabPane" :tab-position="'left'" :stretch="true" @tab-click="tabClick">
            <el-tab-pane label="个人资料" name="myInfo"></el-tab-pane>
            <el-tab-pane label="退出登录" name="logout"></el-tab-pane>
          </el-tabs>
        </div>

      </el-aside>
      <el-main>
        <my-info :user-info="userInfo" v-if="tabPane === 'myInfo'"></my-info>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {useUserStore} from "../../store/user";
import {ref} from "vue";
import MyInfo from "@/components/profile/MyInfo.vue"
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter} from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const userInfo = ref(userStore.$state.userInfo)
const tabPane = ref("myInfo")
const tabClick = (pane, e) => {
  switch (pane.props.name){
    case "logout":{
      logout()
      break;
    }
  }
  console.log(pane)
}

const logout = () => {
  ElMessageBox.alert('确定要退出登录？', '警告', {
    confirmButtonText: '确定',
    callback: (action) => {
      if (action === 'confirm'){
        userStore.logout();
        ElMessage({
          type: 'success',
          message: "退出登录成功～即将前往登录页",
        })
        setTimeout(function () {
          router.push({path:"/login"})
        },1000)
      }
    },
  })
}

userStore.$subscribe((mutation, state) => {
  if (mutation.events.key === 'userInfo'){
    userInfo.value = mutation.events.newValue
  }
})

</script>

<style>
.cenhai-tabs > .el-tabs > .el-tabs__header> .el-tabs__nav-wrap{
  width: 230px;
  text-align: center;
}
.el-tabs__item{
  text-align: center !important;
}
</style>