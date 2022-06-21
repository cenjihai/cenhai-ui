<template>
  <div class="common-layout" v-loading="loading">
    <el-container>
      <el-aside width="120px">
        <el-tabs :tab-position="'left'" @tab-click="tabClick" v-model="defaultShow">
          <el-tab-pane name="0">
            <template #label>
                <span>
                  <font-awesome-icon :icon="faIcons['faHomeLgAlt']"/>
                  <span>配置管理</span>
                </span>
            </template>
          </el-tab-pane>
          <template v-for="item in groupData" :key="item.groupId">
            <el-tab-pane :name="item.groupId">
              <template #label>
                <span>
                  <font-awesome-icon :icon="faIcons[item.icon]"/>
                  <span>{{ item.name }}</span>
                </span>
              </template>
            </el-tab-pane>
          </template>

        </el-tabs>
      </el-aside>
      <el-main>
        <template v-for="item in configData" :key="item.configId">
          <el-form :inline="true">
            <el-form-item :label="item.configName">
              <el-tooltip
                  effect="dark"
                  :content="item.remark"
                  placement="top"
              >
                <el-input style="width: 220px" v-if="item.widget==='input'" v-model="item.configValue" :placeholder="item.configName"/>

                <el-select v-if="item.widget==='select'" v-model="item.configValue"  :placeholder="item.configName">
                  <el-option
                      v-for="i in item.options"
                      :key="i.value"
                      :label="i.label"
                      :value="i.value"
                      :disabled="i.disabled"
                  />
                </el-select>

                <el-radio-group v-model="item.configValue" v-if="item.widget==='radio'">
                  <el-radio v-for="i in item.options" :label="i.value" :disabled="i.disabled">{{ i.label }}</el-radio>
                </el-radio-group>

                <el-switch
                    v-if="item.widget==='switch'"
                    v-model="item.configValue"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="0"
                    inactive-value="1"
                />

                <el-checkbox-group v-if="item.widget==='checkbox'" v-model="item.configValue">
                  <el-checkbox v-for="i in item.options" :key="i.value" :label="i.value"  :disabled="i.disabled" >{{i.label}}</el-checkbox>
                </el-checkbox-group>

              </el-tooltip>
            </el-form-item>
          </el-form>
          <el-divider />
        </template>
        <div style="text-align: right" v-if="defaultShow !== '0'">
          <el-button type="success" @click="submitForm">保存</el-button>
        </div>
        <div v-if="defaultShow==='0'" style="text-align: center">
          <p>系统运行重要配置</p>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "config"
}
</script>

<script setup>

import {ref} from "vue";
import * as faIcons from "@fortawesome/free-solid-svg-icons"
import {batchUpdate, listConfig, listGroup} from "../../../api/system/config";
import {ElNotification} from "element-plus";

const loading = ref(false)
const groupData = ref()
const configData = ref()
const defaultShow = ref('0')

const tabClick = (pane, ev) => {
  getConfigData(pane.props.name);
}

const submitForm = () => {
  if (!configData.value)return;
  loading.value = true;
  batchUpdate(configData.value).then(res => {
    loading.value = false
    ElNotification.success({title:res.msg, message: res.data})
  }).catch(err => {
    loading.value = false
  })
}

const getConfigData =(groupId) => {
  loading.value = true;
  listConfig(groupId).then(res => {
    loading.value = false;
    res.data.forEach(item => {
      if (item.options){
        item.options = JSON.parse(item.options)
      }
      if (item.widget === 'checkbox'){
        item.configValue = JSON.parse(item.configValue)
        console.log(item.configValue)
      }
    })
    configData.value = res.data;
  }).catch(err => {
    loading.value = false
  })
}

const getGroupData = () => {
  loading.value = true;
  listGroup().then(res => {
    groupData.value = res.data;
    loading.value = false
  }).catch(err => {
    loading.value = false
  })
}
getGroupData()

</script>