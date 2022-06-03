<template>
  <div v-loading="loading" >
    <query-group :data-source="queryDataSource" :query="query" :reset="reset"/>
    <div style="margin-bottom: 10px">
      <el-button type="danger" @click="deleteOperlog(null)">删除</el-button>
    </div>
    <el-table
        ref="operlogTableRef"
        :data="dataSource"

        style="width: 100%"
        v-loading="tableLoading">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="operId" label="编号" width="55"/>
      <el-table-column prop="userId" label="用户编号" width="90"/>
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="info" label="日志说明" />
      <el-table-column prop="operIp" label="IP地址" />
      <el-table-column prop="operUrl" label="接口地址" />
      <el-table-column prop="userDetails" label="用户信息" />
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
          <el-popconfirm title="确定要删除?" @confirm="deleteOperlog([scope.row.operId])">
            <template #reference>
              <el-button size="small">删除</el-button>
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

    <el-dialog
        v-model="detailsDialogVisible"
        title="详情"
        :fullscreen="false"
        destroy-on-close
    >
      <el-descriptions :column="3" border>
        <el-descriptions-item
            label="操作人"
            label-align="right"
            align="center"
        >{{details.userId}}</el-descriptions-item>
        <el-descriptions-item
            label="所在IP"
            label-align="right"
            align="center"
        >{{details.operIp}}</el-descriptions-item>
        <el-descriptions-item
            label="登录信息"
            label-align="right"
            align="center"
        >{{details.userDetails}}</el-descriptions-item>
        <el-descriptions-item label="请求接口" label-align="right" align="center"
        >{{details.operUrl}}</el-descriptions-item>
      </el-descriptions>


      <el-descriptions :column="2" border>
        <el-descriptions-item
            label="日志标题"
            label-align="right"
            align="center"
        >{{details.title}}</el-descriptions-item>
        <el-descriptions-item
            label="日志说明"
            label-align="right"
            align="center"
        >{{details.info}}</el-descriptions-item>
        <el-descriptions-item label="处理器" label-align="right" align="center"
        >{{details.action}}</el-descriptions-item>


        <el-descriptions-item label="发生时间" label-align="right" align="center"
        >{{details.createTime}}</el-descriptions-item>


      </el-descriptions>


      <el-descriptions :column="1" border>
        <el-descriptions-item label="请求响应数据" label-align="right" align="center"
        >{{details.params}}</el-descriptions-item>
        <el-descriptions-item
            label="异常情况"
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
import http from "../../../utils/http";
import {ElMessage} from "element-plus";


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
  title: {
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
  http.get("/monitor/operlog/" + data.operId,{}).then(res => {
    details.value = res.data;
    loading.value = false
    detailsDialogVisible.value = true;
  }).catch(err => {
    loading.value = false
  })
}

//删除
const deleteOperlog = (operIds) => {
  if (!operIds){
    let selects = operlogTableRef.value.getSelectionRows();
    if (selects.length == 0)return
    operIds = []
    selects.forEach(item => {
      operIds.push(item.operId)
    })
  }
  loading.value = true;
  http.post("/monitor/operlog/delete",operIds).then(res => {
    getData()
    ElMessage({
      message: res.msg,
      type: 'success'
    })
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
  http.get("/monitor/operlog/list",Object.assign(page.value,queryForm.value)).then(res => {
    dataSource.value = res.data.rows;
    total.value = res.data.total
    tableLoading.value = false
  }).catch(err => {
    tableLoading.value = false
  })
}
getData()

</script>
