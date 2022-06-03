<template>
  <el-tabs
      v-model="defaultSelect"
      type="card"
      closable
      class="demo-tabs"
      @tab-remove="removeTab"
      @tab-change="changeTab"
  >
    <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
    >
    </el-tab-pane>
  </el-tabs>
</template>


<script setup>
import {ref, watch} from 'vue'
import { useRoute, useRouter } from "vue-router"
import {useAppStore} from "../store/app";

const defaultSelect = ref('/index')
const router = useRouter();
const route = useRoute();
const appStore = useAppStore()

const tabs = ref([
  {
    title: '控制台',
    name: '/index',
    closable: false
  }
])

const setTabs = () => {
  let bool = false;
  tabs.value.forEach((tab, index) => {
    if (tab.name === route.fullPath){
      bool = true;
    }
  });
  if (!bool){
    tabs.value.push({
      title: route.meta.title,
      name: route.fullPath,
    })
    appStore.addCache(route.name)
    defaultSelect.value = route.fullPath;
  }else {
    defaultSelect.value = route.fullPath;
  }
}
setTabs();

watch(route, function () {
  setTabs();
})


const changeTab = (name) => {
  router.push({path:name})
}

const removeTab = (targetName) => {
  appStore.removeCacheByFullPath(targetName)
  if (targetName !== '/index'){
    let activeName = defaultSelect.value
    if (activeName === targetName) {
      tabs.value.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs.value[index + 1] || tabs.value[index - 1]
          if (nextTab) {
            activeName = nextTab.name
          }
        }
      })
    }
    defaultSelect.value = activeName
    tabs.value = tabs.value.filter((tab) => tab.name !== targetName)
    router.push({path:activeName})

  }

}
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.el-tabs__content{
  display: none;
}
</style>
