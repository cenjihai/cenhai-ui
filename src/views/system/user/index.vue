<template>
  <div>
    <query-group :data-source="queryDataSource" :query="query" :reset="reset"/>
    <div style="margin-bottom: 10px">
      <el-button type="success" @click="openDialog(null)">新增</el-button>
      <el-button type="danger" @click="deleteUser(null)">删除</el-button>
    </div>
    <el-table
        ref="userTableRef"
        :data="userList"
        max-height="900px"
        style="width: 100%"
        v-loading="tableLoading"

    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="userId" label="用户编号" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="sex" label="性别" >
        <template #default="scope">
          {{sexConverter(scope.row.sex)}}
        </template>
      </el-table-column>
      <el-table-column prop="headimgurl" label="头像" >
        <template #default="scope">
          <img :src="scope.row.headimgurl" style="width: 30px;height: 30px;" />
        </template>
      </el-table-column>
      <el-table-column label="地址" >
        <template #default="scope">
          {{scope.row.country + scope.row.province + scope.row.city}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column prop="remark" label="备注" />
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
                <el-dropdown-item @click="openRoleDialog(scope.row)">角色</el-dropdown-item>
                <el-dropdown-item @click="openPasswordForm(scope.row)">账号</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-popconfirm title="确定要删除?" @confirm="deleteUser([scope.row.userId])">
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

    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" destroy-on-close>
      <el-form v-loading="loading"   :model="userForm">
        <el-form-item label="用户昵称">
          <el-input v-model="userForm.nickname" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="用户性别">
          <el-radio-group v-model="userForm.sex">
            <el-radio label="1" size="large">男</el-radio>
            <el-radio label="2" size="large">女</el-radio>
            <el-radio label="0" size="large">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所在地址">
          <div style="display: flex">
            <el-input
                v-model="userForm.country"
                placeholder="国家"
            />
            <el-input
                v-model="userForm.province"
                placeholder="省份/地区/州"
            />
            <el-input
                v-model="userForm.city"
                placeholder="城市/区"
            />
          </div>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input
              v-model="userForm.remark"
              :rows="4"
              maxlength="85"
              show-word-limit
              type="textarea"
              placeholder="备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUserForm"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>


    <el-dialog v-model="roleDialogVisible" title="角色信息" destroy-on-close>
      <el-form v-loading="loading" v-if="roleDetails"

      >
        <el-form-item label="角色">
          <el-select
              v-model="roleDetails.userRole"
              multiple
              placeholder="选择角色"
              style="width: 340px"
          >
            <el-option
                v-for="item in roleDetails.allRole"
                :key="item.roleId"
                :label="item.name"
                :value="item.roleId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRoleForm"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>

    <el-dialog v-model="passwordDialogVisible" title="账号密码设置" width="450px" destroy-on-close>
      <el-form v-if="userAuthForm"
               :model="userAuthForm"
               v-loading="loading"
               label-width="70px"
      >
        <el-form-item label="账 号">
          <el-input v-model="userAuthForm.identifier"
                    maxlength="16"
                    show-word-limit
                    placeholder="账号"
          />
        </el-form-item>
        <el-form-item label="密 码">
          <el-input v-model="userAuthForm.credential" type="password" show-password maxlength="16" show-word-limit placeholder="密码"/>
        </el-form-item>
        <el-form-item label="状 态">
          <el-switch
              v-model="userAuthForm.status"
              inline-prompt
              active-value="0"
              inactive-value="1"
              active-text="开"
              inactive-text="关"
          />
        </el-form-item>
        <el-form-item>
          <div style="text-align: right;width: 100%">
            <el-button type="primary" @click="submitUserAuthForm">提交</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'user'
}
</script>

<script setup>
import QueryGroup from "@/components/QueryGroup.vue"
import {ref} from "vue";
import http from "../../../utils/http";
import {sexConverter} from "@/utils/common"
import {ElMessage} from "element-plus";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons"

const loading = ref(false)
const tableLoading = ref(false)

//表头查询组件数据
const queryDataSource = {
  userId: {
    label: "用户编号",
    widget: "input"
  },
  nickname: {
    label: "用户昵称",
    widget: "input"
  },
  username: {
    label: "用户账号",
    widget: "input"
  },
  sex:{
    label: '性别',
    widget: "select",
    options: [
      {
        label: '男',
        value: '1'
      },{
        label: '女',
        value: '2'
      },{
        label: '未知',
        value: '0'
      }
    ]
  }
}

//查询
const userList = ref()
const page = ref({
  pageSize: 10,
  current: 1
})
const total = ref(0)
const queryForm = ref();
const query = (data) => {
  queryForm.value = data
  getData()
}
const getData = () =>{
  tableLoading.value = true;
  http.get("/user/list",Object.assign(page.value,queryForm.value)).then(res => {
    userList.value = res.data.rows
    total.value = res.data.total
    tableLoading.value = false
  }).catch(err =>{
    tableLoading.value = false
  })
}
getData()
const reset = (data) => {
  queryForm.value = data
  getData()
}

//账号设置

const passwordDialogVisible = ref(false)
const userAuthForm = ref()

const submitUserAuthForm = () => {
  loading.value = true;
  http.post("/userauth/updateOrSaveUserAuthByPassword",userAuthForm.value).then(res => {
    loading.value = false
    passwordDialogVisible.value = false
    ElMessage({
      message: res.msg,
      type: 'success'
    })
  }).catch(err => {
    loading.value = false
  })
}

const openPasswordForm = (data) => {
  getUserAuthData(data.userId)
  passwordDialogVisible.value = true;
}

const getUserAuthData = (userId) => {
  loading.value = true;
  http.get("/userauth/getPasswordType/" + userId,{}).then(res => {
    if (res.data){
      userAuthForm.value = res.data
      userAuthForm.value.credential = undefined
    }else {
      userAuthForm.value = {
        identifier: undefined,
        credential: undefined,
        userId: userId
      }
    }
    loading.value = false
  }).catch(err =>{
    loading.value = false
  })
}

//角色

const roleDialogVisible = ref(false)
const roleDetails = ref();

const openRoleDialog = (userData) => {
  roleDialogVisible.value = true
  loading.value = true;
  http.get("/role/getUserRole/" + userData.userId,{}).then(res => {
    roleDetails.value = res.data;
    roleDetails.value.userId = userData.userId;
    loading.value = false
  }).catch(err => {
    loading.value = false
  })
}

const submitRoleForm = () => {
  loading.value = true;
  http.post("/user/updateRole/" + roleDetails.value.userId,roleDetails.value.userRole).then(res => {
    loading.value = false
    ElMessage({
      message: res.msg,
      type: 'success'
    })
  }).catch(err => {
    loading.value = false
  })
}


//编辑/新增

const dialogFormVisible = ref(false)
const dialogTitle = ref("新增")
const userForm = ref()
const userTableRef = ref()


const openDialog = (data) => {
  if (data){
    userForm.value = data;
    dialogTitle.value = "编辑"
  }else {
    userForm.value = {
      nickname: undefined,
      sex: "1",
      location: undefined,
      remark: undefined
    }
  }
  dialogFormVisible.value = true;
}

const submitUserForm = () => {
  loading.value = true;
  http.post("/user/updateOrSave",userForm.value).then(res => {
    loading.value = false
    dialogFormVisible.value = false
    ElMessage({
      message : res.msg,
      type: 'success'
    })

  }).catch(err => {
    loading.value = false
  })
}

/**
 * 删除用户
 * @param userIds
 */
const deleteUser = (userIds) =>{
  if (!userIds){
    let selects = userTableRef.value.getSelectionRows();
    if (selects.length == 0)return
    userIds = []
    selects.forEach(item => {
      userIds.push(item.userId)
    })
  }
  loading.value = true;
  http.post("/user/delete",userIds).then(res => {
    loading.value = false
    getData()
    ElMessage({
      message: res.msg,
      type: 'success'
    })
  }).catch(err => {
    loading.value = false
  })
}

</script>