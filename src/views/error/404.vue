<template>
  <el-result icon="info" title="404 页面不存在">
    <template #sub-title>
      <p>您访问的页面不存在，请检查地址是否正确！</p>
    </template>
    <template #extra>
      <el-button type="primary" @click="$router.push({path:'/index'})">返回</el-button>
    </template>
  </el-result>
</template>