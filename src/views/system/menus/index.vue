<template>
  <div class="common-layout">
    <el-tree
        ref="menuTreeRef"
        :data="dataSource"
        :props="props"
        node-key="id"
        :expand-on-click-node="false"
        :load="loadNode" lazy >

      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>
            <template v-if="data.field.icon">
              {{data.field.menuOrder}}-
              <font-awesome-icon :icon="faIcons[data.field.icon]" />
            </template>
            {{ node.label }}
            <el-tag v-if="data.field.type ==='C'" style="margin-left: 10px" effect="dark" size="small">目录</el-tag>
            <el-tag v-if="data.field.type ==='M'" style="margin-left: 10px" effect="dark" size="small" type="success">菜单</el-tag>
            <el-tag v-if="data.field.type ==='P'" style="margin-left: 10px" effect="dark" size="small" type="danger">权限</el-tag>
          </span>
          <div>
            <a v-if="data.field.type !== 'P'" @click="openForm(node,data,'add')"><font-awesome-icon :icon="faIcons['faAdd']"/></a>
            <a  v-if="data.field.type" @click="openForm(node,data,'edit')"><font-awesome-icon :icon="faIcons['faEdit']"/></a>
            <el-popconfirm  v-if="data.field.type" title="确定要删除这个项吗？" @confirm="deleteNode(node,data)">
              <template #reference>
                <a><font-awesome-icon :icon="faIcons['faRemove']"/></a>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTile"
        width="450px"
        destroy-on-close
    >
      <el-form :model="clickNodeData.field" v-loading="loading">
        <el-form-item label="类型">
          <el-radio-group v-model="clickNodeData.field.type">
            <el-radio label="M">菜单</el-radio>
            <el-radio label="P">权限</el-radio>
            <el-radio label="C">目录</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="text[clickNodeData.field.type] + '名称'">
          <el-input v-model="clickNodeData.field.name" placeholder="菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单地址" v-if="clickNodeData.field.type !== 'P'">
          <el-input v-model="clickNodeData.field.path" placeholder="菜单或目录访问地址，前后不要输入/"/>
        </el-form-item>
        <el-form-item label="权限字符" v-if="clickNodeData.field.type === 'P'">
          <el-input v-model="clickNodeData.field.permKey" placeholder="权限字符"/>
        </el-form-item>
        <el-form-item :label="text[clickNodeData.field.type] + '排序'">
          <el-input-number v-model="clickNodeData.field.menuOrder" :min="1" :max="999" />
        </el-form-item>
        <el-form-item :label="text[clickNodeData.field.type] + '图标'" v-if="clickNodeData.field.type !=='P'">
          <el-input v-model="clickNodeData.field.icon" placeholder="仅支持font-awesome 图标，驼峰写法"/>
        </el-form-item>
        <el-form-item label="菜单组件" v-if="clickNodeData.field.type === 'M'">
          <el-input v-model="clickNodeData.field.component" placeholder="对应vue中组件的位置"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-tooltip content="关闭后将不不能访问" placement="top">
            <el-switch
                v-model="clickNodeData.field.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="隐藏" v-if="clickNodeData.field.type !== 'P'">
          <el-tooltip content="隐藏后不在菜单出现，但是依然能访问" placement="top">
            <el-radio-group v-model="clickNodeData.field.hidden">
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
  name: 'menus'
}
</script>
<script setup>

import {ref} from "vue";
import http from "../../../utils/http";
import * as faIcons from "@fortawesome/free-solid-svg-icons"
import {ElMessage} from "element-plus";

const loading = ref(false)

const text = {
  M:"菜单",
  C:"目录",
  P:"权限"
}
const props = {
  label: 'label',
  children: 'children',
}
const menuTreeRef = ref()
const dataSource = ref()
const dialogVisible = ref(false)
const dialogTile = ref()

//点击的节点
const clickNode = ref()
const clickNodeData = ref()

const deleteNode = (node, data) => {
  http.post("/menu/delete/" + data.field.menuId,{}).then(res => {
    menuTreeRef.value.remove(node)
    ElMessage({
      message: res.msg,
      type: "success"
    })
  })
}

const submitForm = () => {
  loading.value = true
  http.post("/menu/updateOrSave",clickNodeData.value.field).then(res => {
    loading.value = false
    if (dialogTile.value === "添加"){
      menuTreeRef.value.append(res.data,clickNode.value)
    }else {
      http.get("menu/menuTree/" + clickNode.value.parent.data.id,{}).then(res => {
        menuTreeRef.value.updateKeyChildren(clickNode.value.parent.data.id, res.data)
      })
    }
    dialogVisible.value = false
    ElMessage({
      message: res.msg,
      type: 'success'
    })
  }).catch(err => {
    loading.value = false
  })
}

const openForm = (node, data, event) =>{
  if (event === 'edit'){
    if (!data.field)return
    clickNodeData.value = data
    dialogTile.value = "编辑"
  }else {
    clickNodeData.value = {field : {
      name: undefined,
      path:undefined,
      menuOrder: 1,
      icon: undefined,
      component: undefined,
      parentMenuId: data.field.menuId ? data.field.menuId : data.id,
      status: '0',
      hidden: 'N',
      type: 'M',
      permKey: undefined
    }}
    dialogTile.value = '添加'
  }
  clickNode.value = node;
  dialogVisible.value = true;
}

const loadNode = (node, resolve) => {
  if (node.level === 0) {
    return resolve([{ label: '系统' ,id: 0,field: {}}])
  }
  http.get("menu/menuTree/" +node.data.id,{}).then(res => {
    resolve(res.data)
  })
}

</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node>div> a{
  margin-right: 10px;
  padding: 5px;
}
</style>