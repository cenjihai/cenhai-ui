<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card shadow="always">
          <h4>cenhai-后台管理系统</h4>
          <p>cenhai-后台管理系统一是一套以用户为主的非常简洁的后台管理系统。没有各种臃肿的依赖，都是最基本的springboot开发。</p>
          <p>前端采用element-plus 前端也没有进行任何封装和依赖，完全使用element-plus开发。</p>
          <p>对于后台功能，仅支持权限管理，用户管理，操作日志，配置管理几大最通用的模块。对于其他并不是常用的自行开发。</p>
          <p>为什么说是以用户为主呢？后台没有过多的配置，多余的功能，使得用户使用起来简洁方便。开发者难点没关系，该系统适合中小型程序使用，并不合适大型或企业级开发。</p>
          <el-divider />
          <el-link style="text-decoration: line-through">github 暂不开源</el-link>
          <el-divider />
          <span>支持的功能</span>
          <ul>
            <li>用户管理(支持多账号认证方式，比如手机号、微信等并存)</li>
            <li>菜单管理(支持粒度权限控制)</li>
            <li>角色管理</li>
            <li>系统配置(可以自定义配置的组件与显示方式。同时移除新增，删除配置的方式)<span style="color: #606266; font-size: 12px">这种东西还是开发者管理比较好，用户负责修改就行了</span></li>
            <li>操作日志(记录关键操作的日志)</li>
            <li>插件管理(允许插件化开发系统功能-<el-link href="https://www.yuque.com/starblues/spring-brick-3.0.0/ypurcw" type="primary">文档</el-link>)</li>
          </ul>
          <el-divider />
          <el-col :span="12">
            <span>技术选型-后端</span>
            <ul>
              <li>springboot 2.5 mybatis-plus3 </li>
              <li>security + jwt </li>
              <li>mysql8 + redis</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="12">
            <span>技术选型-前端</span>
            <ul>
              <li>vite + vue3 + element-plus </li>
              <li>Axios </li>
              <li>pinia</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12" style="margin-top: 20px">
      <el-col :span="12">
        <el-card shadow="always">
          <div>
            <el-collapse >
              <el-collapse-item>
                <template #title>
                  <div>
                    version 1.0.0
                  </div>
                  <div style="margin-left: 100px">
                    2022年6月6号
                  </div>
                </template>
                <div>
                  cenhai 后台管理系统正式完成
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card shadow="always">
          <div style="text-align: center">
            <span>作者信息</span>
            <p>@cenjihai </p><p>联系方式 QQ:1143617983 </p>
            <p>email:1143617983@qq.com</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
</script>