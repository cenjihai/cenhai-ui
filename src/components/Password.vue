<template>
  <div>
    <el-form v-loading="loading" :model="userAuthForm" v-if="userAuthForm">
      <el-form-item label="我的账号">
        <el-input v-model="userAuthForm.identifier"/>
      </el-form-item>
      <el-form-item label="新的密码">
        <el-input v-model="userAuthForm.credential"
                  type="password"
                  placeholder="请输入密码"
                  maxlength="16"
                  show-word-limit
                  show-password/>
      </el-form-item>
      <el-form-item label="旧的密码">
        <el-input v-model="userAuthForm.oldCredential"
                  type="password"
                  placeholder="请输入原密码"
                  maxlength="16"
                  show-word-limit
                  show-password/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 380px" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>

import {ref} from "vue";
import http from "../utils/http";
import {ElMessage} from "element-plus";
import {useUserStore} from "../store/user";
import {useRouter} from "vue-router";

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const userAuthForm = ref()

const submitForm = () => {
  loading.value = true;
  http.post("/profile/updateUserAuthByPassword", {credential: userAuthForm.value.credential,oldCredential: userAuthForm.value.oldCredential}).then(res => {
    loading.value = false
    userStore.logout();
    ElMessage({
      message: "修改成功，请重新登录～",
      type: 'success'
    })
    setTimeout(function () {
      router.push({path:"/login"})
    },1000)
  }).catch(err => {
    loading.value = false
  })
}

const getData = () => {
  loading.value = true
  http.get("/profile/getUserAuthInfo",{}).then(res => {
    if (!res.data){
      ElMessage({message:'未设置密码认证方式!',type:'error'})
      return
    }
    userAuthForm.value = res.data;
    userAuthForm.value.credential = undefined
    loading.value = false
  }).catch(err => {
    loading.value = false
  })
}
getData()

</script>