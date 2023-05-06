<template>
  <div>
    <h2 :style="{ marginBottom: '10px' }">查看体测成绩</h2>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { reqGetScore } from '@/ajax/api.js'

/* 1.获取学生自己的uid */
const uid = ref(localStorage.getItem('student_uidx'))

/* 2.根据学生自己的uid发起请求自己的成绩 */
const getScore = async function () {
  if (uid) {
    const resViewScore = await reqGetScore(uid)
    console.log(resViewScore)
  } else {
    ElMessage.error('你UID呢?')
  }
}
getScore()
</script>

<style scoped lang="scss"></style>
