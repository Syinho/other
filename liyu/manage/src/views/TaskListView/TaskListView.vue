<template>
  <h2 :style="{ marginBottom: '10px' }">体测任务</h2>
  <el-button
    type="primary"
    :style="{ marginBottom: '10px' }"
    @click="$router.push('/manage/admin/addTask')"
  >
    <el-icon class="el-icon--left"><Plus /></el-icon>
    添加任务
  </el-button>
  <el-table :data="tableData" style="width: 100%" v-loading="loading" border stripe>
    <el-table-column prop="fields.name" label="体测任务" width="180" />
    <el-table-column prop="fields.begin_time" label="起始时间" width="180" />
    <el-table-column prop="fields.end_time" label="终止时间" />
    <el-table-column prop="fields.half" label="春/秋"></el-table-column>
  </el-table>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { reqGetTaskList } from '@/ajax/api.js'
import { handleTime } from '@/utils/index.js'
import { useRouter } from 'vue-router'
const $router = useRouter()

const tableData = ref([])
const loading = ref(false)

// 获取体测任务
const getAllTaskList = async function () {
  loading.value = true
  const resTaskList = await reqGetTaskList()
  if (Number(resTaskList.code) === 200) {
    const data = JSON.parse(resTaskList.data)
    console.log(data)

    for (let i = 0; i < data.length; i++) {
      data[i].fields.begin_time = handleTime(data[i].fields.begin_time)
      data[i].fields.end_time = handleTime(data[i].fields.end_time)
      data[i].fields.half = Number(data[i].fields.half) === 1 ? '春' : '秋'
    }

    tableData.value = data
  }
  loading.value = false
}
getAllTaskList()
</script>

<style scoped lang="scss"></style>
