<template>
  <div>
    <query-group :data-source="queryDataSource" :query="query" :reset="reset"/>
    <div style="margin-bottom: 10px">
      <el-upload
          :action="http.getConfig().baseURL + '/plugin/upload'"
          :headers="{Authorization: getToken()}"
          method="post"
          name="jarFile"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          accept="jar">
        <el-button type="success">本地上传</el-button>

      </el-upload>
    </div>
    <el-table
        :data="dataSource"
        max-height="900px"
        style="width: 100%"
        v-loading="loading">
      <el-table-column prop="pluginId" label="插件ID"/>
      <el-table-column prop="name" label="插件名称" />
      <el-table-column prop="description" label="说明" />
      <el-table-column prop="version" label="版本" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="状态">
        <template #default="scope">
          <font-awesome-icon v-if="scope.row.status ==='0'" :icon="faPlay" style="color: #5fb878"/>
          <font-awesome-icon v-if="scope.row.status ==='1'" :icon="faStop" style="color: crimson"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button v-if="scope.row.status ==='1' && scope.row.isInstall ==='Y'" type="success" size="small" @click="changeStatus(scope.row,'0')">启动</el-button>
          <el-button v-if="scope.row.status ==='0' && scope.row.isInstall ==='Y'" type="danger" size="small"  @click="changeStatus(scope.row,'1')">禁用</el-button>
          <el-button v-if="scope.row.isInstall ==='Y'" type="primary" size="small" @click="openSetting(scope.row)">设置</el-button>
          <el-popconfirm v-if="scope.row.isInstall === 'Y'" title="确定要卸载?" @confirm="uninstall(scope.row)">
            <template #reference>
              <el-button size="small">卸载</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination small background
                   v-model:currentPage="page.current"
                   layout="prev, pager, next,sizes"
                   v-model:page-size="page.pageSize"
                   :page-sizes="[10, 20, 30, 50]"
                   @size-change="getData"
                   @current-change="getData"
                   :total="total" />

    <el-dialog v-model="dialogSettingVisible" title="设置" destroy-on-close>
      <iframe :src="settingUrl" style="width: 100%;height: 100%" scrolling="no" frameborder="no"/>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "plugins"
}
</script>

<script setup>

import QueryGroup from "@/components/QueryGroup.vue"
import {ref} from "vue";
import {faPlay, faStop} from "@fortawesome/free-solid-svg-icons"
import {getToken} from "../../utils/token";
import http from "../../utils/http";
import {ElMessage} from "element-plus";
import {changePluginStatus, listPlugin, uninstallPlugin} from "../../api/plugin";
const loading = ref(false)


//设置
const dialogSettingVisible = ref(false)
const settingUrl = ref()
const openSetting = (row) => {
  settingUrl.value = http.getConfig().baseURL + "/plugins/" + row.pluginId + "/setting";
  dialogSettingVisible.value = !dialogSettingVisible.value;
}

// 启动与禁用
const changeStatus = (row, status) => {
  loading.value = true;
  row.status = status;
  changePluginStatus(row).then(res => {
    loading.value = false
    ElMessage({
      message: res.msg,
      type: "success"
    })
  }).catch(err => {
    loading.value = false
  })
}


//卸载

const uninstall = (row) => {
  loading.value = true
  uninstallPlugin(row.pluginId).then(res => {
    loading.value = false
    ElMessage({
      message: res.msg,
      type: "success"
    })
    getData()
  }).catch(err => {
    loading.value = false
  })
}


//上传
const uploadSuccess = (response, u, us) =>{
  ElMessage({
    message: response.msg,
    type: 'success'
  })
  getData()
}

const uploadError = (response, u, us) =>{
  ElMessage({
    message: "上传失败",
    type: 'error'
  })
}

//查询
const dataSource = ref()
const page = ref({
  current: 1,
  pageSize: 10
})
const total = ref(0)

const queryDataSource ={
  pluginId:{
    label: '插件ID',
    widget: 'input'
  },
  name: {
    label: '插件名称',
    widget: 'input'
  },
  status:{
    label: '状态',
    widget: 'select',
    options: [
      {
        value: '0',
        label: '启用'
      },
      {
        value: '1',
        label: '禁用'
      }
    ]
  }
}

const queryForm = ref()


//查询
const query = (data) =>{
  queryForm.value = data
  getData()
}

const reset = (data) => {
  queryForm.value = data
  getData()
}

const getData = () => {
  loading.value = true;
  listPlugin(queryForm.value,page.value).then(res => {
    dataSource.value = res.data.rows;
    total.value = res.data.total
    loading.value = false
  }).catch(err => {
    loading.value = false
  })
}
getData()

</script>