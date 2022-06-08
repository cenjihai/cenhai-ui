<template>
  <div>
    <el-button type="success" @click="openForm({menuId:0},'add')">添加</el-button>
    <el-table
        v-loading="loading"
        :data="menuData"
        row-key="menuId"
        border
        lazy
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >

      <el-table-column prop="name" label="名称" width="150">
        <template #default="scope">
          <font-awesome-icon v-if="scope.row.type !== 'P'" :icon="faIcons[scope.row.icon]" />
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column prop="path" label="地址" />
      <el-table-column prop="menuOrder" label="排序" />
      <el-table-column prop="permKey" label="权限字符" />
      <el-table-column prop="component" label="组件" />
      <el-table-column label="状态" >
        <template #default="scope">
          <el-tooltip content="关闭后菜单不可用" placement="top">
            <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1"
                @change="changeStatus(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="隐藏" >
        <template #default="scope">
          <el-tooltip content="隐藏后不显示，但是仍然可以访问" placement="top">
            <el-checkbox v-model="scope.row.hidden" label="Y"
                         @change="changeStatus(scope.row)"
                         true-label="Y"
                         false-label="N"
            >
              是
            </el-checkbox>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="类型" >
        <template #default="scope">
          <el-tag v-if="scope.row.type === 'M'" >菜单</el-tag>
          <el-tag v-if="scope.row.type === 'P'" type="success">权限</el-tag>
          <el-tag v-if="scope.row.type === 'C'" type="info">目录</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button type="success" size="small" @click="openForm(scope.row,'add')">新增</el-button>
          <el-button type="primary" size="small" @click="openForm(scope.row,'edit')">编辑</el-button>
          <el-popconfirm title="确定要删除？" @confirm="deleteMenu(scope.row)">
            <template #reference >
              <el-button
                  size="small"
                  type="danger">删除</el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="dialogVisible"
        :title="dialogTile"
        width="450px"
        destroy-on-close
    >
      <el-form :model="menuForm" v-loading="loading">
        <el-form-item label="类型">
          <el-radio-group v-model="menuForm.type">
            <el-radio label="M">菜单</el-radio>
            <el-radio label="P">权限</el-radio>
            <el-radio label="C">目录</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="text[menuForm.type] + '名称'">
          <el-input v-model="menuForm.name" placeholder="菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单地址" v-if="menuForm.type !== 'P'">
          <el-input v-model="menuForm.path" placeholder="菜单或目录访问地址，前后不要输入/"/>
        </el-form-item>
        <el-form-item label="权限字符" v-if="menuForm.type === 'P'">
          <el-input v-model="menuForm.permKey" placeholder="权限字符"/>
        </el-form-item>
        <el-form-item :label="text[menuForm.type] + '排序'">
          <el-input-number v-model="menuForm.menuOrder" :min="1" :max="999" />
        </el-form-item>
        <el-form-item :label="text[menuForm.type] + '图标'" v-if="menuForm.type !=='P'">
          <el-input v-model="menuForm.icon" placeholder="仅支持font-awesome 图标，驼峰写法"/>
        </el-form-item>
        <el-form-item label="菜单组件" v-if="menuForm.type === 'M'">
          <el-input v-model="menuForm.component" placeholder="对应vue中组件的位置"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-tooltip content="关闭后将不不能访问" placement="top">
            <el-switch
                v-model="menuForm.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1"

            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="隐藏" v-if="menuForm.type !== 'P'">
          <el-tooltip content="隐藏后不在菜单出现，但是依然能访问" placement="top">
            <el-radio-group v-model="menuForm.hidden">
              <el-radio label="N">显示</el-radio>
              <el-radio label="Y">隐藏</el-radio>
            </el-radio-group>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm"
        >确定</el-button
        >
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "menus"
}
</script>

<script setup>

import {ref} from "vue";
import {listMenu,updateOrSaveMenu,delMenu} from "@/api/system/menu";
import * as faIcons from "@fortawesome/free-solid-svg-icons"
import {ElMessage} from "element-plus";

const loading = ref(false)
const menuData = ref();

//状态修改
const changeStatus = (data) =>{
  menuForm.value = data;
  submitForm()
}

//删除
const deleteMenu = (data) => {
  loading.value = true
  delMenu(data.menuId).then(res => {
    loading.value = false
    ElMessage({
      message: res.msg,
      type: "success"
    })
    removeNode(menuData.value,data)
  }).catch(err => {
    loading.value = false
  })
}

function removeNode(nodes, node){
  for (let i = 0, len = nodes.length;i < len; i ++){
    if (nodes[i] == node){
      nodes.splice(i, 1)
    }else {
      if (nodes[i].children && nodes[i].children.length > 0){
        removeNode(nodes[i].children, node)
      }
    }
  }
}

function addNode(nodes,parentId, node){
  for (let i = 0, len = nodes.length;i < len; i ++){
    if (nodes[i].menuId == parentId){
      nodes[i].children.push(node)
    }else {
      if (nodes[i].children && nodes[i].children.length > 0){
        addNode(nodes[i].children,parentId, node)
      }
    }
  }
}

//新增编辑
const text = {
  M:"菜单",
  C:"目录",
  P:"权限"
}
const dialogVisible = ref(false);
const menuForm = ref();
const dialogTile = ref();

const submitForm = () => {
  loading.value = true
  updateOrSaveMenu(menuForm.value).then(res => {
    dialogVisible.value = false
    ElMessage({
      message: res.msg,
      type: 'success'
    })
    if (!menuForm.value.menuId){
      addNode(menuData.value,menuForm.value.parentMenuId,res.data)
    }
    loading.value = false
  }).catch(err => {
    loading.value = false
  })
}


const openForm = (data, event) =>{
  if (event === 'edit'){
    menuForm.value = data
    dialogTile.value = "编辑"
  }else {
    menuForm.value = {
      name: undefined,
      path:undefined,
      menuOrder: 1,
      icon: undefined,
      component: undefined,
      parentMenuId: data.menuId,
      status: '0',
      hidden: 'N',
      type: 'M',
      permKey: undefined
    }
    dialogTile.value = '添加'
  }
  dialogVisible.value = true;
}

const getData = () => {
  loading.value = true;
  listMenu({parentMenuId:0}).then(res => {
    menuData.value = res.data;
    loading.value = false
  }).catch(err => {
    loading.value = false
  })
}
getData()

const load = (row, treeNode, resolve) => {
  listMenu({parentMenuId:row.menuId}).then(res => {
    row.children = res.data
    resolve(res.data)
  })
}

</script>