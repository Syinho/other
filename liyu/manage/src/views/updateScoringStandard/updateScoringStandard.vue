<template>
  <div>
    <h2 :style="{ marginBottom: '10px' }">修改体测评分标准</h2>
    <el-form :model="form" label-width="90px" v-loading="loading">
      <el-form-item label="年级">
        <el-col :md="10" :sm="16" :xs="24">
          <el-select
            v-model="select.grade"
            class="m-2 sel-item"
            placeholder="选择年级"
            size="small"
            @change="getData"
          >
            <el-option
              v-for="item in gradeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="项目">
        <el-col :md="10" :sm="16" :xs="24">
          <el-select
            v-model="select.key"
            class="m-2 sel-item"
            placeholder="选择项目"
            size="small"
            @change="getData"
          >
            <el-option
              v-for="item in keyOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="性别">
        <el-col :md="10" :sm="16" :xs="24">
          <el-select
            v-model="select.gender"
            class="m-2 sel-item"
            placeholder="选择性别"
            size="small"
            @change="getData"
          >
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="权重值修改"></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改评分标准</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { reqGetScoringStandard } from '@/ajax/api.js'
const loading = ref(false)
const ruleForms = ref(null)
const rules = reactive({})
const select = reactive({
  // 下拉框的选择
  grade: 'low',
  key: 'bmi',
  gender: 'male',
  name: '身体质量指数',
})
const gradeOptions = ref([
  { name: '低年级', value: 'low' },
  { name: '高年级', value: 'high' },
])
const keyOptions = ref([
  { name: '身体质量指数', value: 'bmi' },
  { name: '肺活量', value: 'pulmonary' },
  { name: '跳远', value: 'jump' },
  { name: '坐位体前屈', value: 'flexion' },
  { name: '50m', value: 'run50' },
  { name: '800m', value: 'run800' },
  { name: '1000m', value: 'run1000' },
  { name: '仰卧起坐', value: 'adbominal_curl' },
  { name: '引体向上', value: 'pull_up' },
])
const genderOptions = ref([
  { name: '男性', value: 'male' },
  { name: '女性', value: 'female' },
])

// const form = reactive({
//   key: 'end_score',
//   grade: 'low',
//   value: [
//     { name: '身体质量指数', key: 'bmi', value: 0.15 },
//     { name: '肺活量', key: 'pulmonary', value: 0.15 },
//     { name: '跳远', key: 'jump', value: 0.1 },
//     { name: '坐位体前屈', key: 'flexion', value: 0.1 },
//     { name: '长跑?', key: 'runlong', value: 0.2 },
//     { name: '卷曲?', key: 'curlorup', value: 0.1 },
//   ],
// })
// const keyOptions = ref([
//   { name: '身体质量指数', key: 'bmi', value: 0.15 },
//   { name: '肺活量', key: 'pulmonary', value: 0.15 },
//   { name: '跳远', key: 'jump', value: 0.1 },
//   { name: '坐位体前屈', key: 'flexion', value: 0.1 },
//   { name: '长跑?', key: 'runlong', value: 0.2 },
//   { name: '卷曲?', key: 'curlorup', value: 0.1 },
// ])

const onSubmit = function () {}
</script>

<style scoped lang="scss">
.slider-demo-block {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.slider-demo-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
.slider-demo-block .demonstration + .el-slider {
  flex: 0 0 70%;
}
</style>
