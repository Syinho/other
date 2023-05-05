<template>
  <div>
    <h2 :style="{ marginBottom: '10px' }">添加任务</h2>
    <el-form :model="form" label-width="150px" ref="ruleForms" :rules="rules" v-loading="loading">
      <el-form-item prop="name" label="体测任务">
        <el-col :md="10" :sm="16" :xs="24">
          <el-input v-model="form.name" placeholder="请输入要添加的体测任务名"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="begin_time" label="体测任务开始时间">
        <el-col :md="10" :sm="16" :xs="24">
          <el-config-provider :locale="zhCn">
            <el-date-picker
              v-model="form.begin_time"
              type="datetime"
              placeholder="选择体测开始时间"
              :style="{ width: '100%' }"
            />
          </el-config-provider>
        </el-col>
      </el-form-item>
      <el-form-item prop="end_time" label="体测任务结束时间">
        <el-col :md="10" :sm="16" :xs="24">
          <el-config-provider :locale="zhCn">
            <el-date-picker
              v-model="form.end_time"
              type="datetime"
              placeholder="选择体测结束时间"
              style="width: 100%"
            />
          </el-config-provider>
        </el-col>
      </el-form-item>
      <el-form-item prop="half.value" label="季节">
        <el-col :md="10" :sm="16" :xs="24">
          <el-input
            v-model="form.half.value"
            placeholder="季节由任务的起始时间决定"
            disabled
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="学生基本信息文件" prop="filename">
        <div class="upload-container">
          <input type="file" name="" id="" class="files" accept=".xlsx,.xls" @change="fileChange" />
          <div class="fileInfo" v-if="form.filename">
            <span>{{ form.filename }}</span>
            <span class="iconfont icon-aui-icon-correct"></span>
          </div>
        </div>
        <br />
      </el-form-item>
      <!-- 教师选择 -->
      <el-form-item label="教师选择">
        <el-col :md="10" :sm="16" :xs="24">
          <el-select v-model="form.teachers" multiple placeholder="选择教师" style="width: 100%">
            <el-option
              v-for="item in teacherOptions"
              :key="item.pk"
              :label="item.fields.name"
              :value="item.pk"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <!-- 点击上传任务 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加体测任务</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import {
  reqPostTask,
  reqGetAllTeachers,
  reqPostStusInfo,
  reqPostTeachers,
  reqGetTaskList,
} from '@/ajax/api.js'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useRouter } from 'vue-router'
const $router = useRouter()
const form = reactive({
  name: '',
  begin_time: '',
  end_time: '',
  half: { id: '', value: '' },
  filename: '',
  teachers: [],
})
const ruleForms = ref(null)
const task_id = ref(null)
let loading = ref(false)

/* 校验规则 */
const rules = reactive({
  name: [
    {
      required: true,
      message: '请填写体测任务',
      trigger: 'blur',
    },
  ],
  begin_time: [
    {
      required: true,
      message: '请选择体测开始时间',
      trigger: 'blur',
    },
  ],
  end_time: [
    {
      required: true,
      message: '请选择体测结束时间',
      trigger: 'blur',
    },
  ],
  filename: [{ required: true, message: '请上传学生基本信息', trigger: 'blur' }],
})

/* 获取全部教师数据 */
let teacherOptions = ref([])
const getAllTeachers = async function () {
  loading.value = true
  const resAllTeachers = await reqGetAllTeachers()
  if (Number(resAllTeachers.code) === 200) {
    const data = JSON.parse(resAllTeachers.data)
    teacherOptions.value = data
  } else {
    console.log(resAllTeachers)
    if (resAllTeachers.response.status === 401) {
      $router.replace({ path: '/login_register' })
    }
  }
  loading.value = false
}
getAllTeachers()
/* 提交体测任务 */
const onSubmit = function () {
  ruleForms.value.validate(async valid => {
    if (valid) {
      // 1.处理时间数据为秒时间戳
      loading = true
      const oFile = document.querySelector('.files')
      let year = new Date(form.begin_time).getFullYear()
      let begin_time = Number(new Date(form.begin_time).getTime()) / 1000
      let end_time = Number(new Date(form.end_time).getTime()) / 1000
      // 2.上传基本信息
      console.log('1.添加基本任务数据')
      const resPostTask = await reqPostTask(form.name, begin_time, end_time, form.half.id, year)
      console.log(resPostTask)
      // 3.获取全部的任务数据以便获得任务pk值
      if (Number(resPostTask.code) === 200) {
        console.log('2.获取任务pk值')
        const resAllTask = await reqGetTaskList()
        console.log(resAllTask)
        if (Number(resAllTask.code) === 200) {
          const data = JSON.parse(resAllTask.data)
          const task = Array.prototype.find.call(data, item => {
            return item.fields.name === form.name
          })
          task_id.value = Number(task.pk)
          console.log(task_id.value)
          // 4.检查文件是否上传成功?
          if (oFile.files.length === 0) {
            return
          } else {
            let f = new FormData()
            f.append('task_id', Number(task_id.value))
            f.append('file', oFile.files[0])
            console.log('3.上传学生文件')
            const resPostStusInfo = await reqPostStusInfo(f)
            console.log(resPostStusInfo)
            if (Number(resPostStusInfo.code) === 200) {
              // 5.检查教师数据是否获取到
              if (teacherOptions.value.length > 0) {
                console.log('4.上传教师名单')
                const resPostTeachers = await reqPostTeachers(Number(task_id.value), form.teachers)
                console.log(resPostTeachers)
                if (Number(resPostTeachers.code) === 200) {
                  ElMessage({
                    type: 'success',
                    message: '添加体测任务成功',
                  })
                  $router.push({ path: '/manage/admin/tasklist' })
                } else {
                  ElMessage.error(`code:${resPostTask.code},msg:${resPostTask.msg}`)
                  loading = false
                }
              }
            } else {
              ElMessage.error(`code:${resPostTask.code},msg:${resPostTask.msg}`)
              loading = false
            }
          }
        } else {
          ElMessage.error(`code:${resPostTask.code},msg:${resPostTask.msg}`)
          loading = false
        }
      } else {
        ElMessage.error(`code:${resPostTask.code},msg:${resPostTask.msg}`)
        loading = false
      }
      // 3.上传学生文件
      // let oFile = document.querySelector('.files')
      // console.log(oFile.files[0])
      // let f = new FormData().append('file',oFile.files[0])
      // const resPostStusInfo = reqPostStusInfo(f)
      // // 4.上传教师名单
      // console.log(form.teachers)
      // const resPostTeachers = reqPostTeachers(form.teachers)
    }
  })
}

/* 上传文件 */
const fileChange = function () {
  let oFile = document.querySelector('.files')
  // 判断是否有文件
  if (oFile.files.length === 0) {
    form.filename = ''
    return
  }
  // 判断文件类型
  const isXlS =
    oFile.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    oFile.files[0].type === 'application/vnd.ms-excel'
  if (!isXlS) {
    ElMessage.error('仅支持.xlsx与.xls文件')
    oFile.value = null // 清空文件
    form.filename = ''
    return
  }
  form.filename = oFile.files[0].name
}

/* 监听起始时间 start */
watch(
  () => form.begin_time,
  () => {
    let begin_timeStamp = new Date(form.begin_time).getTime()
    const mon = new Date(begin_timeStamp).getMonth() + 1

    if (form.end_time === '') {
      if (mon <= 6) {
        form.half = { id: 1, value: '春季' }
      } else {
        form.half = { id: 2, value: '秋季' }
      }
      return
    } else {
      let endTimeStamp = new Date(form.end_time).getTime()
      if (begin_timeStamp >= endTimeStamp) {
        ElMessage.error('起始时间应该小于截止时间')
        form.begin_time = ''
        form.half = ''
      } else {
        if (mon <= 6) {
          form.half = { id: 1, value: '春季' }
        } else {
          form.half = { id: 2, value: '秋季' }
        }
      }
    }
  }
)
/* end */

/* 监听截止时间 */
watch(
  () => form.end_time,
  () => {
    if (form.begin_time === '') {
      return
    } else {
      let begin_timeStamp = new Date(form.begin_time).getTime()
      let endTimeStamp = new Date(form.end_time).getTime()
      if (begin_timeStamp >= endTimeStamp) {
        ElMessage.error('截止时间应该大于起始时间')
        form.end_time = ''
      }
    }
  }
)
/* end */

watch(
  () => form.teachers,
  newVal => {
    console.log(newVal)
  }
)
</script>

<style scoped lang="scss">
@import './AddTaskView.scss';
</style>
