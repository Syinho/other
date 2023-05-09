<template>
  <div>
    <h2 :style="{ marginBottom: '20px' }">查看任务</h2>
    <el-descriptions title="体测任务基本信息" :column="2">
      <el-descriptions-item label="任务名">
        {{ pageData.taskData === null ? '' : pageData.taskData.name }}
      </el-descriptions-item>
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
    <el-divider border-style="dashed" />
    <div class="select-container">
      <el-select
        placeholder="选择年级"
        size="small"
        @change="
          val => {
            selectChange(val, 'grade')
          }
        "
        :model-value="searchParams.grade"
      >
        <el-option v-for="item in gradeOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-select
        placeholder="选择学院"
        size="small"
        @change="
          val => {
            selectChange(val, 'college')
          }
        "
        :model-value="searchParams.college"
      >
        <el-option
          v-for="item in collegeOptions"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-select
        placeholder="选择专业"
        size="small"
        @change="
          val => {
            selectChange(val, 'major')
          }
        "
        :model-value="searchParams.major"
      >
        <el-option v-for="item in majorOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-select
        placeholder="选择班级"
        size="small"
        @change="
          val => {
            selectChange(val, 'class_name')
          }
        "
        :model-value="searchParams.class_name"
      >
        <el-option v-for="item in classOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div style="width: 800px; margin-bottom: 20px">
      <el-input
        v-model="searchParams.search_value"
        placeholder="请输入要查询的学生id或学生姓名"
        class="input-with-select"
      >
        <template #prepend>
          <el-select
            v-model="searchParams.search_key"
            placeholder="选择搜索方式"
            style="width: 115px"
          >
            <el-option
              :label="item.name"
              :value="item.value"
              v-for="item in searchOptions"
              :key="item.value"
            />
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" type="primary" style="width: 115px" @click="searchByInput" />
        </template>
      </el-input>
    </div>
    <!-- 表单 -->
    <el-table
      :data="tableData"
      style="width: 98%"
      border
      stripe
      :row-key="row => row.pk"
      v-loading="loading"
      :row-style="{ width: '150px' }"
      max-height="calc(100vh - 500px)"
    >
      <el-table-column prop="fields.student.uid" label="学生ID"></el-table-column>
      <el-table-column prop="fields.student.name" label="学生姓名"></el-table-column>
      <!-- 体测项目成绩, 可更改 -->
      <el-table-column prop="fields.height" label="身高/cm"></el-table-column>
      <el-table-column prop="fields.weight" label="体重/kg"></el-table-column>
      <el-table-column prop="fields.jump" label="跳高"></el-table-column>
      <el-table-column prop="fields.flexion" label="坐位体前屈"></el-table-column>
      <el-table-column prop="fileds.pull_up" label="引体向上"></el-table-column>
      <el-table-column prop="fields.pulmonary" label="肺活量"></el-table-column>
      <el-table-column prop="fields.left_eye" label="左眼视力"></el-table-column>
      <el-table-column prop="fields.right_eye" label="右眼视力"></el-table-column>
      <el-table-column prop="fields.run50" label="50m"></el-table-column>
      <el-table-column prop="fields.run800" label="800m"></el-table-column>
      <el-table-column prop="fields.run1000" label="1000m"></el-table-column>
      <!-- 体测项目分数, 不可更改 -->
      <el-table-column prop="fields.bmi_score" label="BMI"></el-table-column>
      <el-table-column prop="fields.curlorup_score" label="引体向上/仰卧起坐得分"></el-table-column>
      <el-table-column prop="fields.flexion_score" label="坐位体前屈得分"></el-table-column>
      <el-table-column prop="fields.jump_score" label="跳远得分"></el-table-column>
      <el-table-column prop="fields.pulmonary_score" label="肺活量得分"></el-table-column>
      <el-table-column prop="fields.run50_score" label="50m得分"></el-table-column>
      <el-table-column prop="fields.runlong_score" label="800m/1000m得分"></el-table-column>
      <el-table-column prop="fields.end_score" label="最终得分"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template #default="scope">
          <el-button plain type="primary" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import {
  reqGetTask,
  reqViewTaskProgress,
  reqGetAllStusClassInfo,
  reqScore,
  reqPutStusScore,
} from '@/ajax/api.js'
import { useRoute, useRouter } from 'vue-router'
import { handleTime } from '@/utils/index.js'
import { Search } from '@element-plus/icons-vue'
const pageData = reactive({
  taskData: ref(null),
})
const $route = useRoute()
const $router = useRouter()
const searchParams = reactive({
  task_id: $route.params.id,
  grade: '',
  page_num: 1,
  college: '',
  major: '',
  class_name: '',
  search_key: 'student__uid',
  search_value: '',
})
const props = [
  'flexion',
  'height',
  'jump',
  'left_eye',
  'pull_up',
  'pulmonary',
  'right_eye',
  'run50',
  'run800',
  'run1000',
  'weight',
]
const pageCount = ref()
const loading = ref(false)
const tableData = ref([])
const searchOptions = ref([
  { name: '学生id', value: 'student__uid' },
  { name: '学生姓名', value: 'student__name' },
])

/* 1.获取指定的任务数据 */
const getTaskById = async function () {
  const id = $route.params.id
  searchParams.task_id = id
  const resGetTask = await reqGetTask(id)
  console.log(resGetTask)
  if (Number(resGetTask.code) === 200) {
    const data = JSON.parse(resGetTask.data)
    pageData.taskData = data[0].fields
    console.log(pageData.taskData)
  }
}
getTaskById()

/* 4.获取全部的学生成绩 */
let gradeOptions = ref([])
let collegeOptions = ref([])
let majorOptions = ref([])
let classOptions = ref([])
const getScore = async function () {
  const id = $route.params.id
  loading.value = true
  const res = await reqScore({
    task_id: searchParams.task_id,
  })
  pageCount.value = res.page_count
  if (Number(res.code) === 200) {
    const data = JSON.parse(res.data)
    console.log(data)
    // 数据处理
    Array.prototype.forEach.call(data, stu => {
      // grade
      if (gradeOptions.value.indexOf(stu.fields.student.grade) === -1) {
        gradeOptions.value.push(stu.fields.student.grade)
      }
      // college
      if (collegeOptions.value.indexOf(stu.fields.student.college) === -1) {
        collegeOptions.value.push(stu.fields.student.college)
      }
      // major
      if (majorOptions.value.indexOf(stu.fields.student.major) === -1) {
        majorOptions.value.push(stu.fields.student.major)
      }
      // class_name
      if (classOptions.value.indexOf(stu.fields.student.class_name) === -1) {
        classOptions.value.push(stu.fields.student.class_name)
      }
    })
    // 再对grade与class_name进行排序处理
    Array.prototype.sort.call(gradeOptions.value, function (a, b) {
      return Number(a) - Number(b)
    })

    Array.prototype.sort.call(classOptions.value, function (a, b) {
      return Number(a) - Number(b)
    })
    tableData.value = data
  } else {
    ElMessage.error('获取学生分数失败')
  }
  loading.value = false
}
getScore()

/* 切换select */
const selectChange = async function (val, key) {
  loading.value = true
  searchParams[key] = val
  let paramsObj = {}
  for (const prop in searchParams) {
    // 只要search_value没有值, 就跳过增加search_key
    if (prop === 'search_key' && searchParams['search_value'] === '') {
      continue
    } else if (prop === 'search_key' && searchParams['search_value'] !== '') {
      console.log(1)
      paramsObj[prop] = searchParams[prop]
      paramsObj['search_value'] = searchParams['search_value']
    }
    if (prop === 'search_value') {
      continue
    }
    if (searchParams[prop] !== '') {
      paramsObj[prop] = searchParams[prop]
    }
  }
  console.log(paramsObj)
  const res = await reqScore(paramsObj)
  console.log(res)
  if (Number(res.code) === 200) {
    const data = JSON.parse(res.data)
    console.log(data)
    tableData.value = data
  } else {
    ElMessage.error('获取数据失败')
  }
  loading.value = false
}

/* 主动搜索 */
const searchByInput = async function () {
  loading.value = true
  let paramsObj = {}
  for (const prop in searchParams) {
    // 只要search_value没有值, 就跳过
    if (prop === 'search_key' && searchParams['search_value'] === '') {
      continue
    } else if (prop === 'search_key' && searchParams['search_value'] !== '') {
      console.log(1)
      paramsObj[prop] = searchParams[prop]
      paramsObj['search_value'] = searchParams['search_value']
    }
    if (prop === 'search_value') {
      continue
    }
    if (searchParams[prop] !== '') {
      paramsObj[prop] = searchParams[prop]
    }
  }
  console.log(paramsObj)
  const res = await reqScore(paramsObj)
  console.log(res)
  if (Number(res.code) === 200) {
    const data = JSON.parse(res.data)
    console.log(data)
    tableData.value = data
  } else {
    ElMessage.error('获取数据失败')
  }
  loading.value = false
}

/* 跳转编辑页面 */
const edit = function (data) {
  $router.push(`/manage/admin/editstuscore/${data.pk}`)
}
</script>

<style scoped lang="scss">
@import './viewTaskView.scss';
</style>
