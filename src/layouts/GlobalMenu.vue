<template>
  <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      :collapse="false"
      :router = "true"
      :unique-opened="true"
      active-text-color="#409eff"
      background-color="#393d49"
      text-color="#fff"
  >
    <template v-for="item in routes" :key="item.path">
      <el-sub-menu :index="item.path" v-if="hasChildren(item)  && !item.hidden">
        <template #title>
          <font-awesome-icon :icon="faIcons[item.meta.icon]"/>
          <span>{{item.meta.title}}</span>
        </template>
        <sub-menu-item :routes="item.children" :parent="item"/>
      </el-sub-menu>
      <!--渲染没有孩子的-->
      <el-menu-item v-if="!hasChildren(item)  && !item.hidden" :index="'/' + item.path">
        <font-awesome-icon :icon="faIcons[item.meta.icon]"/>
        <template #title>{{ item.meta.title }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import {ref, watch} from 'vue'
import * as faIcons from '@fortawesome/free-solid-svg-icons'
import { useRoute } from "vue-router"
import baseRoutes from "../router/base-routes";
import {useMenuStore} from "../store/menu";
import SubMenuItem from "@/layouts/SubMenuItem.vue"

const route = useRoute();
const activeMenu = ref("/index")
activeMenu.value = route.fullPath;

const menuStore = useMenuStore();
const routes = baseRoutes.concat(JSON.parse(menuStore.$state.menus))

watch(route, function () {
  activeMenu.value = route.fullPath
})

//是否有孩子
const hasChildren = (item) => {
  if (item && item.children && item.children.length > 0){
    return true
  }
  return false;
}

</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
.svg-inline--fa{
  margin-right: 20px;
}
</style>