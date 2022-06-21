<template>
  <div>
    <query-group :data-source="queryDataSource" :query="query" :reset="reset"/>
    <div style="margin-bottom: 10px">
      <el-button type="success" @click="openDialog(null)">新增</el-button>
      <el-button type="danger" @click="deleteRole(null)">删除</el-button>
    </div>
    <el-table
        ref="roleTableRef"
        :data="dataSource"
        max-height="900px"
        style="width: 100%"
        empty-text="无数据～.～"
        v-loading="tableLoading">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="roleId" label="编号"/>
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="roleKey" label="角色字符" />
      <el-table-column label="状态">
        <template #default="scope">
          <el-tooltip content="关闭后，角色不可用" placement="top">
            <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1"
                @change = "statusChange(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-dropdown>
            <el-button size="small">
              更多
              <el-icon class="el-icon--right">
                <font-awesome-icon :icon="faAngleDown"/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openMenuDialog(scope.row.roleId)">分配菜单</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-popconfirm title="确定要删除?" @confirm="deleteRole([scope.row.roleId])">
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

    <el-dialog v-model="formDialogVisible" :title="formDialogTitle" width="400px" destroy-on-close>
      <el-form v-loading="loading" :model="roleForm">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.name" placeholder="输入角色名称" />
        </el-form-item>
        <el-form-item label="角色字符">
          <el-input v-model="roleForm.roleKey" placeholder="输入由字母组成的字符" />
        </el-form-item>
        <el-form-item label="状态">
          <el-tooltip content="关闭后无法使用" placement="top">
            <el-switch
                v-model="roleForm.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1"
            />
          </el-tooltip>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>

    <!--分配菜单弹出层-->
    <el-dialog v-model="menuDialogVisible" title="分配菜单" width="600px" destroy-on-close>
      <assign-menu :role-id="roleId" v-if="menuDialogVisible"/>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "role"
}
</script>

<script setup>

import QueryGroup from "@/components/QueryGroup.vue"
import {ref} from "vue";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons"
import AssignMenu from "@/components/AssignMenu.vue"
import {delRole, listRole, updateOrSaveRole} from "../../../api/system/role";
import {ElNotification} from "element-plus";

const tableLoading = ref(false)
const loading = ref(false)
const roleTableRef = ref()

const dataSource = ref()
const page = ref({
  current: 1,
  pageSize: 10
})
const total = ref(0)

const queryDataSource ={
  name:{
    label: '角色名称',
    widget: 'input'
  },
  roleKey: {
    label: '角色字符',
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
        label: '禁用'
      }
    ]
  }
}

const queryForm = ref()


const roleId = ref()
//分配菜单
const menuDialogVisible = ref(false)
const openMenuDialog = (id) => {
  roleId.value = id;
  menuDialogVisible.value = !menuDialogVisible.value;
}

//编辑
const roleForm = ref()
const formDialogVisible = ref(false)
const formDialogTitle = ref()

const statusChange = (data) =>{
  tableLoading.value = true
  updateOrSaveRole(data).then(res => {
    tableLoading.value = false
    ElNotification.success({title:res.msg, message: res.data})
  }).catch(err => {
    tableLoading.value = false
  })
}

const submitForm = () => {
  loading.value = true
  updateOrSaveRole(roleForm.value).then(res => {
    loading.value = false
    formDialogVisible.value = false
    getData()
    ElNotification.success({title:res.msg, message: res.data})
  }).catch(err => {
    loading.value = false
  })
}

const openDialog = (data) =>{
  if (data){
    roleForm.value = data;
    formDialogTitle.value = "编辑"
  }else {
    roleForm.value = {
      name: undefined,
      roleKey: undefined,
      status: '0'
    }
    formDialogTitle.value = "添加"
  }
  formDialogVisible.value = true
}

//删除
const deleteRole = (roleIds) => {
  if (!roleIds){
    let selects = roleTableRef.value.getSelectionRows();
    if (selects.length == 0)return
    roleIds = []
    selects.forEach(item => {
      roleIds.push(item.roleId)
    })
  }
  loading.value = true;
  delRole(roleIds).then(res => {
    getData()
    ElNotification.success({title:res.msg, message: res.data})
    loading.value = false
  }).catch(err => {
    loading.value = false
  })
}

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
  tableLoading.value = true;
  listRole(queryForm.value,page.value).then(res => {
    dataSource.value = res.data.rows;
    total.value = res.data.total
    tableLoading.value = false
  }).catch(err => {
    tableLoading.value = false
  })
}
getData()

</script>