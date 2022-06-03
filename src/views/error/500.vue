<template>
  <el-result
      icon="error"
      title="系统异常"
      sub-title="系统异常，请联系管理员"
  >
    <template #extra>
      <el-button type="primary" @click="$router.push({path:'/index'})">返回</el-button>
    </template>
  </el-result>
</template>