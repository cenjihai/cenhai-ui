<template>
  <div class="global-content">
    <el-scrollbar :height="bodyHeight + 'px'">
      <router-view v-slot="{Component}" v-if="appStore.$state.routerAlive">
        <transition name="fade" mode="out-in">
          <keep-alive :include="appStore.$state.cacheView">
            <component :is="Component"/>
          </keep-alive>
        </transition>
      </router-view>
    </el-scrollbar>

  </div>
</template>

<script setup>
import {useAppStore} from "../store/app";
import {onMounted, ref} from "vue";

const appStore = useAppStore()

const bodyHeight = ref(document.body.clientHeight - 120)

onMounted(() => {
  window.onresize = () => {
    return(() => {
      bodyHeight.value = document.body.clientHeight - 120;
    })()
  }
})

</script>

<style scoped>
.global-content {
  margin-left: 10px;
  margin-right: 10px;
}
/*页面切换动画*/
/*进入过渡的结束状态，元素被插入时就生效，在过渡过程完成后移除*/
.fade-enter-active {
  transition: opacity .5s;
}
/*进入过渡的开始状态，元素被插入时生效，只应用一帧后立刻删除*/
.fade-enter {
  opacity: 0;
}
/*离开过渡的开始状态，元素被删除时触发，只应用一帧后立刻删除*/
.fade-leave {
  opacity: 1;
}
/*离开过渡的结束状态，元素被删除时生效，离开过渡完成后被删除*/
.fade-leave-active {
  opacity:0;
  transition: opacity .5s;
}
</style>