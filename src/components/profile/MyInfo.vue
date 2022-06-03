<template>
  <div style="margin: 0px 50px" class="cenhai-input-flex">
    <el-form :model="props.userInfo">
      <div style="text-align: center;margin-bottom: 20px">
        <img-cutter @cutDown="cutDown">
          <template #open>
            <el-avatar :size="80" :src="props.userInfo.headimgurl"/>
          </template>
        </img-cutter>
      </div>
      <el-form-item style="display: none">
        <el-input v-model="props.userInfo.headimgurl"/>
      </el-form-item>
      <el-form-item label="我的昵称">
        <el-input v-model="props.userInfo.nickname" />
      </el-form-item>
      <el-form-item label="我的性别">
        <el-radio-group v-model="props.userInfo.sex">
          <el-radio label="1" size="large">男</el-radio>
          <el-radio label="2" size="large">女</el-radio>
          <el-radio label="0" size="large">秘密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="我的地址">
        <div class="cenhai-input-flex">
          <el-input
              v-model="props.userInfo.country"
              placeholder="国家"
          />
          <el-input
              v-model="props.userInfo.province"
              placeholder="省份/地区/州"
          />
          <el-input
              v-model="props.userInfo.city"
              placeholder="城市/区"
          />
        </div>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-input v-model="props.userInfo.createTime"></el-input>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" :loading="loading" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import ImgCutter from "vue-img-cutter"
import {ref} from "vue";
import http from "../../utils/http";
import {ElMessage} from "element-plus";

const props = defineProps(['userInfo'])
const loading = ref(false)
const cutDown = (event) => {
  props.userInfo.headimgurl = event.dataURL
}

const submitForm = () => {
  loading.value = true;
  http.post("/profile/update",props.userInfo).then(res => {
    loading.value = false
    ElMessage({
      message: res.msg,
      type: 'success'
    })
  }).catch(err => {
    loading.value = false
  })
}

//头像切割组建地址 https://gitee.com/GLUESTICK/vue-img-cutter
</script>

<style>
.cenhai-input-flex{
  display: flex;
}
</style>

