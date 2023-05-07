<template>
  <h2 :style="{ marginBottom: '10px' }">教师账号管理</h2>
  <el-button
    type="primary"
    :style="{ marginBottom: '10px' }"
    @click="$router.push('/manage/admin/addteacher')"
  >
    <el-icon class="el-icon--left"><Plus /></el-icon>
    添加教师
  </el-button>
  <el-table :data="tableData" style="width: 100%" v-loading="loading" border stripe>
    <el-table-column prop="fields.uid" label="职工号"></el-table-column>
    <el-table-column prop="fields.name" label="教师姓名"></el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
import { reqGetAllTeachers } from '@/ajax/api.js'
const tableData = ref([])
const loading = ref(false)

/* 获取全部的教师账号 */
/* 获取全部教师数据 */
const getAllTeachers = async function () {
  loading.value = true
  const resAllTeachers = await reqGetAllTeachers()
  if (Number(resAllTeachers.code) === 200) {
    const data = JSON.parse(resAllTeachers.data)
    tableData.value = data
  }
  loading.value = false
}
getAllTeachers()
</script>

<style scoped lang="scss"></style>
