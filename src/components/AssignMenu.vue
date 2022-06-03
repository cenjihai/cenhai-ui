<template>
  <div v-loading="loading">
    <el-tree :data="treeData"
             ref="treeRef"
             :props="defaultProps"
             show-checkbox
             node-key="id"
             :default-expanded-keys="selectedData"
             :default-checked-keys="selectedData"
             :check-strictly="true"
             @check-change="checkChange"
    />
    <div style="text-align: right">
      <el-button @click="reset">清空选择</el-button>
      <el-button type="primary" @click="submitData">保存</el-button>
    </div>
  </div>
</template>

<script setup>

import {ref} from "vue";
import http from "../utils/http";
import {ElMessage} from "element-plus";

const loading = ref(false)
const defaultProps = {
  children: 'children',
  label: 'label',
}
const treeRef = ref()
const props = defineProps(['roleId'])
const treeData = ref()
const selectedData = ref()

const checkChange =(data, selected, child) => {
  data.children.forEach(item => {
    treeRef.value.setChecked(item.id,selected,true)
  })
}

const submitData = () => {
  loading.value = true;
  http.post("/menu/assignToRole/" + props.roleId,treeRef.value.getCheckedKeys()).then(res => {
    loading.value = false
    ElMessage({
      message: res.msg,
      type: 'success'
    })
  }).catch(err => {
    loading.value = false
  })
}

const reset = () => {
  treeRef.value.setCheckedKeys([], false)
}

const getData = () => {
  loading.value = true;
  http.get("/menu/listSelectedAndAllMenu/" + props.roleId,{}).then(res => {
    treeData.value = res.data.all;
    selectedData.value = res.data.selected;
    loading.value = false
  }).catch(err => {
    loading.value = false
  })
}
getData()


</script>