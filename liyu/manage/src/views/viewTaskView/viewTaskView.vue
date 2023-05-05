<template>
  <div>
    <h2 :style="{ marginBottom: '20px' }">查看任务</h2>
    <el-descriptions :title="pageData.taskData === null ? '' : pageData.taskData.name" :column="1">
      <el-descriptions-item label="起始时间">
        {{ pageData.taskData === null ? 0 : handleTime(pageData.taskData.begin_time) }}
      </el-descriptions-item>
      <el-descriptions-item label="截止时间">
        {{ pageData.taskData === null ? 0 : handleTime(pageData.taskData.end_time) }}
      </el-descriptions-item>
      <el-descriptions-item label="季节">
        {{ pageData.taskData === null ? '春' : pageData.taskData.half === 1 ? '春' : '秋' }}
      </el-descriptions-item>
    </el-descriptions>
    <el-button type="primary" @click="confirm">确定</el-button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { reqGetTask } from '@/ajax/api.js'
import { useRoute, useRouter } from 'vue-router'
import { handleTime } from '@/utils/index.js'
const pageData = reactive({
  taskData: ref(null),
})
const $route = useRoute()
const $router = useRouter()

/* 1.获取指定的任务数据 */
const getTaskById = async function () {
  const id = $route.params.id
  const resGetTask = await reqGetTask(id)
  console.log(resGetTask)
  if (Number(resGetTask.code) === 200) {
    const data = JSON.parse(resGetTask.data)
    pageData.taskData = data[0].fields
    console.log(pageData.taskData)
  }
}

/* 确定按钮, 返回任务列表 */
const confirm = function () {
  $router.push('/manage/admin/tasklist')
}
getTaskById()
</script>

<style scoped lang="scss"></style>
