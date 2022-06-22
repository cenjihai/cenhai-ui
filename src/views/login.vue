<template>
  <div class="common-layout">
    <el-container style="height: 100%">
      <el-header>
      </el-header>
      <el-main class="cenhai-main">
        <h2 style="margin-left: 44px;color: #606266">系统登录</h2>
        <el-form :label-position="'left'"
                 ref="loginFormRef"
                 label-width="100px"
                 :model="loginForm"
                 style="max-width: 350px"
                 :rules="rules"
                 :hide-required-asterisk = "true"

        >
          <el-form-item label="用户名" prop="username" required >
            <el-input v-model="loginForm.username"  placeholder="用户名" clearable  :prefix-icon="Avatar"/>
          </el-form-item>
          <el-form-item label="密&nbsp;&nbsp;&nbsp;&nbsp;码" prop="password" required>
            <el-input type="password"  show-password v-model="loginForm.password" placeholder="密码" clearable  :prefix-icon="EditPen"/>
          </el-form-item>
          <el-form-item label="验证码" prop="code" required>
            <el-col :span="13">
              <el-input v-model="loginForm.code"  placeholder="图形验证码" :prefix-icon="Lock"/>
            </el-col>
            <el-col :span="11" style="line-height: 0px">
              <img v-if="captchaImage" @click="getCaptchaImage" :src="captchaImage" class="cenhai-captcha"/>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 250px" :loading="loading" @click="submitForm(loginFormRef)">登录</el-button>
          </el-form-item>
        </el-form>

      </el-main>
      <el-footer>
        copyright @cenhai 2022
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>

import {reactive, ref} from "vue";
import {Avatar, Lock, EditPen} from "@element-plus/icons-vue"
import http from "../utils/http";
import {useUserStore} from "../store/user";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";


const loginFormRef = ref()

const loginForm = ref({
  username: "admin",
  password: "123456",
  uuid: undefined,
  code: undefined,
  identity_type: "password"
})

const captchaImage = ref();
const loading = ref(false)

const rules = reactive({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      message: '请输入图像验证码',
      trigger: 'blur'
    }
  ]

})
const userStore = useUserStore()
const router = useRouter()
const submitForm = (form) => {
  loading.value = true;
  form.validate(valid => {
    if (valid){
      userStore.login(loginForm.value).then(res => {
        loading.value = false;
        ElMessage.success("登录成功～即将跳转")
        setTimeout(function () {
          router.push({path:"/index"})
        },1000)
      }).catch(err => {
        loading.value = false
      })
    }
  })
}

const getCaptchaImage = () => {
  http.get("/captcha",{}).then(res => {
    captchaImage.value = res.data.imageBase64
    loginForm.value.uuid = res.data.uuid
  })
}
getCaptchaImage()

</script>

<style scoped>
.common-layout{
  text-align: center;
  height: 100%;
}
.cenhai-captcha{
  width: 100px;
  height: 30px;
  line-height: 30px;
  margin-left: 10px;
}
.cenhai-main{
  margin: auto;
}
</style>