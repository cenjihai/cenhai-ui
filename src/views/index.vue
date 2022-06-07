<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card shadow="always">
          <h4>cenhai-系统管理</h4>
          <p>网上有许多优秀的后台管理系统。但是都有一个我不喜欢的点。那就是集成的东西太多。像什么部门管理，公司管理等等。虽然不影响业务使用，但是这些对业务毫无意义的功能。看着实在碍眼。也容易误操作。</p>
          <p>故此，我借鉴网上优秀的系统写出了一套适合自己的系统。同时也适合中小型网站。丢弃那些繁琐无用的功能。保留最通用的功能。剩下的按自己的业务开发</p>
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