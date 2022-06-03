<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left" style="background: none">
          密码登录
          <el-tag type="danger" v-if="!userAuthData.password">未设置</el-tag>
        </el-divider>
        <el-form :inline="true" v-if="userAuthData.password">
          <el-form-item label="账号">
            <el-input style="color: black" v-model="userAuthData.password.identifier" readonly="readonly" placeholder="输入8-16位的数字字母"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="editPasswordDialogVisible = true">修改密码</el-button>
          </el-form-item>
        </el-form>
        <span style="font-size: 12px;color: #393d49">注意： 未设置密码登录将无法使用账号和密码进行登录系统</span>
      </el-col>
    </el-row>
    <el-dialog
        v-model="editPasswordDialogVisible"
        title="修改密码"
        width="400px"
    >
      <password />
    </el-dialog>
  </div>
</template>

<script setup>
import Password from "@/components/Password.vue"
import {ref} from "vue";
import http from "../../utils/http";

const editPasswordDialogVisible = ref(false)
const userAuthData = ref({
  password: undefined
});

const getData = () => {
  http.get("/profile/listUserAuthInfo",{}).then(res => {
    userAuthData.value = res.data
  })
}
getData()

</script>

<style>
.el-divider__text{
  background: none !important;
}
</style>