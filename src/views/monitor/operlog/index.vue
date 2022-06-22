<template>
  <div v-loading="loading" >
    <query-group :data-source="queryDataSource" :query="query" :reset="reset"/>
    <div style="margin-bottom: 10px">
      <el-button type="danger" @click="clean()">清空</el-button>
    </div>
    <el-table
        ref="operlogTableRef"
        :data="dataSource"
        empty-text="无数据～.～"
        style="width: 100%"
        v-loading="tableLoading">
      <el-table-column prop="operId" label="编号" width="55"/>
      <el-table-column prop="userId" label="用户编号" width="90"/>
      <el-table-column prop="operType" label="标题" />
      <el-table-column prop="operDesc" label="日志说明" />
      <el-table-column prop="operIp" label="IP地址" />
      <el-table-column label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status==='0'" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status==='1'" type="danger">错误</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openDialog(scope.row)">详情</el-button>
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

    <el-dialog
        v-model="detailsDialogVisible"
        title="详情"
        :fullscreen="false"
        width="70%"
        destroy-on-close
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item
            label="请求参数"
            label-align="right"
            align="center"
        >{{details.reqParam}}</el-descriptions-item>
        <el-descriptions-item
            label="响应数据"
            label-align="right"
            align="center"
        >{{details.respData}}</el-descriptions-item>
        <el-descriptions-item
            label="异常数据"
            label-align="right"
            align="center"
        >{{details.errMsg}}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "operlog"
}
</script>

<script setup>

import QueryGroup from "@/components/QueryGroup.vue"
import {ref} from "vue";
import {cleanOperlog, listOperlog, operlogDetails} from "../../../api/monitor/operlog";
import {ElNotification} from "element-plus";


const tableLoading = ref(false)
const loading = ref(false)
const operlogTableRef = ref()

const dataSource = ref()
const page = ref({
  current: 1,
  pageSize: 10
})
const total = ref(0)

const queryDataSource ={
  userId:{
    label: '用户编号',
    widget: 'input'
  },
  operType: {
    label: '日志标题',
    widget: 'input'
  },
  status:{
    label: '状态',
    widget: 'select',
    options: [
      {
        value: '0',
        label: '正常'
      },
      {
        value: '1',
        label: '错误'
      }
    ]
  }
}
//详情
const details = ref()
const detailsDialogVisible = ref(false);
const openDialog = (data) => {
  loading.value = true;
  operlogDetails(data.operId).then(res => {
    details.value = res.data;
    loading.value = false
    detailsDialogVisible.value = true;
  }).catch(err => {
    loading.value = false
  })
}

//删除
const clean = () => {
  loading.value = true;
  cleanOperlog().then(res => {
    getData()
    ElNotification.success({title:res.msg, message: res.data})
    loading.value = false
  }).catch(err => {
    loading.value = false
  })
}

//查询
const queryForm = ref()
const query = (data) =>{
  queryForm.value = data
  getData()
}

const reset = (data) => {
  queryForm.value = data
  getData()
}

const getData = () => {
  tableLoading.value = true;
  listOperlog(queryForm.value,page.value).then(res => {
    dataSource.value = res.data.rows;
    total.value = res.data.total
    tableLoading.value = false
  }).catch(err => {
    tableLoading.value = false
  })
}
getData()

</script>
