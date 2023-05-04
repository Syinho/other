<template>
  <h2 :style="{ marginBottom: '10px' }">体测任务</h2>
  <el-button
    type="primary"
    :style="{ marginBottom: '10px' }"
    @click="$router.push('/manage/admin/addTask1')"
  >
    <el-icon class="el-icon--left"><Plus /></el-icon>
    添加任务
  </el-button>
  <el-table
    :data="tableData"
    style="width: 100%"
    v-loading="loading"
    border
    stripe
    max-height="calc(100vh - 250px)"
  >
    <el-table-column prop="fields.name" label="体测任务" width="180" />
    <el-table-column prop="fields.begin_time" label="起始时间" />
    <el-table-column prop="fields.end_time" label="终止时间" />
    <el-table-column prop="fields.half" label="春/秋"></el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination
      small
      background
      layout="prev, pager, next"
      :total="count"
      class="mt-4"
      :page-size="pageSize"
      @current-change="switchData"
      :current-page="currentPage"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { reqGetTaskList } from '@/ajax/api.js'
import { handleTime } from '@/utils/index.js'
import { useRouter } from 'vue-router'
const $router = useRouter()

const tableData = ref([])
const totalData = ref([])
const loading = ref(false)

/* 分页数据 start */
let count = ref(0) // 表单数据总数
let pageSize = ref(20) // 限定每页显示20个
let currentPage = ref(1) // 当前页默认为1
/* 分页数据 end */

// 根据当前页进行数据分割
const sliceTotalData = function () {
  // 第一页显示0-19
  // 第二页显示20-39
  let startIdx = pageSize.value * (currentPage.value - 1)
  let endIdx = pageSize.value * currentPage.value
  if (endIdx > count.value) {
    endIdx = count.value
  }
  tableData.value = totalData.value.slice(startIdx, endIdx)
}

// 点击分页按钮, 切换显示数据
const switchData = function (pageNum) {
  currentPage.value = pageNum
  sliceTotalData()
}

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

    totalData.value = data
    count.value = totalData.value.length
    sliceTotalData()
  }
  loading.value = false
}
getAllTaskList()
</script>

<style scoped lang="scss">
.pagination-container {
  width: 100%;
  height: 50px;
  border: 1px solid #ebeef5;
  border-top: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 15px;
}
</style>
