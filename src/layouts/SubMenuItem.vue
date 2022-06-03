<template>
  <div v-for="item in props.routes" :key="item.path">
    <el-menu-item v-if="!hasChildren(item)  && !item.hidden" :index="buildChildMenuPath(item.path)">
      <font-awesome-icon :icon="faIcons[item.meta.icon]"/>
      <template #title>{{ item.meta.title }}</template>
    </el-menu-item>

    <el-sub-menu :index="item.path" v-if="hasChildren(item) && !item.hidden">
      <template #title>
        <font-awesome-icon :icon="faIcons[item.meta.icon]"/>
        <span>{{item.meta.title}}</span>
      </template>
      <sub-menu-item :routes = "item.children" :parent="item"/>
    </el-sub-menu>
  </div>

</template>

<script setup>
import * as faIcons from '@fortawesome/free-solid-svg-icons'
import SubMenuItem from "@/layouts/SubMenuItem.vue"

const props = defineProps(['routes','parent'])

//是否有孩子
const hasChildren = (item) => {
  if (item && item.children && item.children.length > 0){
    return true
  }
  return false;
}

const buildChildMenuPath = (childPath) => {
  if (props.parent.path === '/'){
    return props.parent.path + childPath
  }else {
    return '/' + props.parent.path + '/' + childPath
  }
}
</script>
<style scoped>
.svg-inline--fa{
  margin-right: 20px;
}
</style>