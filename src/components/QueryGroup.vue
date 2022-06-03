<template>
  <el-form :inline="true">
    <template v-for="(val, key) in props.dataSource" :key="key">
      <el-form-item :label="val.label">
        <template v-if="val.widget === 'input'">
          <el-input :placeholder="val.label" v-model="queryForm[key]"/>
        </template>
        <template v-if="val.widget === 'select'">
          <el-select v-model="queryForm[key]" :placeholder="val.label">
            <el-option v-for="item in val.options" :value="item.value" :label="item.label"/>
          </el-select>
        </template>
      </el-form-item>
    </template>
    <el-form-item>
      <el-date-picker
          v-model="queryDate"
          type="daterange"
          range-separator="To"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="query">查询</el-button>
      <el-button type="primary" @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>

  import {ref} from "vue";
  import {parseTime} from "../utils/common";

  const props = defineProps(['dataSource','query','reset'])

  const queryForm = ref(reset(props.dataSource))

  const queryDate = ref()

  const query = () => {
    props.query(parseQueryForm());
  }

  const resetForm = () => {
    queryForm.value = reset(queryForm.value)
    queryDate.value = undefined
    if (props.reset){
      props.reset(queryForm.value)
    }
  }

  const parseQueryForm = () => {
    if (queryDate.value){
      queryForm.value.startTime = parseTime(queryDate.value[0]);
      queryForm.value.endTime = parseTime(queryDate.value[1]);
    }
    return queryForm.value
  }

  function reset(formData) {
    let data = {...formData}
    Object.keys(data).forEach(key => data[key] = null);
    return data;
  }
</script>