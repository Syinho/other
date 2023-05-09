<template>
  <div>
    <h2 :style="{ marginBottom: '10px' }">修改学生分数</h2>
    <el-form :model="form" label-width="80px">
      <el-form-item prop="height" label="身高">
        <el-col :md="10" :sm="16" :xs="24">
          <el-input v-model="form.height" placeholder="请输入学生的身高" />
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const form = reactive({
  height: '',
})
</script>

<style scoped lang="scss"></style>
