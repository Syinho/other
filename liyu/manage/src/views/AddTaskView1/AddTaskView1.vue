<template>
  <div>
    <h2 :style="{ marginBottom: '20px' }">添加任务</h2>
    <div class="content" style="height: calc(100vh - 200px)">
      <div style="height: 100%; width: 100px">
        <el-steps
          direction="vertical"
          :active="active"
          finish-status="success"
          process-status="process"
        >
          <el-step :icon="Edit" title="体测任务" />
          <el-step :icon="Upload" title="上传数据" />
          <el-step :icon="User" title="选择教师" />
        </el-steps>
      </div>
      <el-carousel
        height="calc(100vh - 200px)"
        style="width: 600px"
        direction="vertical"
        :autoplay="false"
        indicator-position="none"
        v-loading="loading"
        ref="carousel"
      >
        <el-carousel-item name="step1">
          <h4 :style="{ marginBottom: '20px' }">填写任务基本信息</h4>
          <el-form :model="form1" label-width="150px" ref="ruleForms1" :rules="rules">
            <el-form-item prop="name" label="体测任务">
              <el-input v-model="form1.name" placeholder="请输入要添加的体测任务名"></el-input>
            </el-form-item>
            <el-form-item prop="begin_time" label="体测任务开始时间">
              <el-config-provider :locale="zhCn">
                <el-date-picker
                  v-model="form1.begin_time"
                  type="datetime"
                  placeholder="选择体测开始时间"
                  :style="{ width: '100%' }"
                />
              </el-config-provider>
            </el-form-item>
            <el-form-item prop="end_time" label="体测任务结束时间">
              <el-config-provider :locale="zhCn">
                <el-date-picker
                  v-model="form1.end_time"
                  type="datetime"
                  placeholder="选择体测结束时间"
                  style="width: 100%"
                />
              </el-config-provider>
            </el-form-item>
            <el-form-item prop="half.value" label="季节">
              <el-input
                v-model="form1.half.value"
                placeholder="季节由任务的起始时间决定"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="submitBasicInfo">下一步</el-button>
            </el-form-item>
          </el-form>
        </el-carousel-item>
        <el-carousel-item name="step2">
          <h4 :style="{ marginBottom: '20px' }">上传参与的学生信息文件</h4>
          <el-button type="primary" @click="upload" style="position: relative">
            <input type="file" name="" id="file" @change="change" ref="file" />
            <el-icon class="el-icon--left">
              <Upload />
            </el-icon>
            上传文件
          </el-button>
          <el-text v-if="filename">
            <el-icon color="#67C23A">
              <Document />
            </el-icon>
            {{ filename }}
          </el-text>
          <div style="height: 20px"></div>
          <el-button type="success" @click="submitStusInfo">下一步</el-button>
        </el-carousel-item>
        <el-carousel-item name="step3">
          <h4 :style="{ marginBottom: '20px' }">选择指导教师</h4>
          <el-select v-model="form1.teachers" multiple placeholder="选择教师" style="width: 100%">
            <el-option
              v-for="item in teacherOptions"
              :key="item.pk"
              :label="item.fields.name"
              :value="item.pk"
            />
          </el-select>
          <div :style="{ height: '20px' }"></div>
          <el-button type="primary" @click="addTask">提交体测任务</el-button>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup>
import { Edit, User, Upload } from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useRouter, useRoute } from 'vue-router'
import {
  reqPostTask,
  reqGetAllTeachers,
  reqPostStusInfo,
  reqPostTeachers,
  reqGetTaskList,
} from '@/ajax/api.js'
import { ref, reactive, watch, nextTick } from 'vue'
const $router = useRouter()
const $route = useRoute()
const carousel = ref()
const file = ref() // 标识文件的DOM
const active = ref(0)
const task_id = ref(null) // 任务id
const form1 = reactive({
  name: '',
  begin_time: '',
  end_time: '',
  half: { id: '', value: '' },
  teachers: [],
})
let teacherOptions = ref([]) // 储存全部的教师数据

const ruleForms1 = ref(null)
let loading = ref(false)
const filename = ref('')
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
})

/* 判断pk值与其status */
const chkRoute = function () {
  let pk = $route.params.pk
  console.log(pk)
  if (!pk) {
    return
  }
}
chkRoute()
/* 监听起始时间 start */
watch(
  () => form1.begin_time,
  () => {
    let begin_timeStamp = new Date(form1.begin_time).getTime()
    const mon = new Date(begin_timeStamp).getMonth() + 1

    if (form1.end_time === '') {
      if (mon <= 6) {
        form1.half = { id: 1, value: '春季' }
      } else {
        form1.half = { id: 2, value: '秋季' }
      }
      return
    } else {
      let endTimeStamp = new Date(form1.end_time).getTime()
      if (begin_timeStamp >= endTimeStamp) {
        ElMessage.error('起始时间应该小于截止时间')
        form1.begin_time = ''
        form1.half = ''
      } else {
        if (mon <= 6) {
          form1.half = { id: 1, value: '春季' }
        } else {
          form1.half = { id: 2, value: '秋季' }
        }
      }
    }
  }
)

/* 监听截止时间 */
watch(
  () => form1.end_time,
  () => {
    if (form1.begin_time === '') {
      return
    } else {
      let begin_timeStamp = new Date(form1.begin_time).getTime()
      let endTimeStamp = new Date(form1.end_time).getTime()
      if (begin_timeStamp >= endTimeStamp) {
        ElMessage.error('截止时间应该大于起始时间')
        form1.end_time = ''
      }
    }
  }
)

/* 上传基本信息 */
const submitBasicInfo = function () {
  ruleForms1.value.validate(async valid => {
    if (valid) {
      loading.value = true
      let year = new Date(form1.begin_time).getFullYear()
      let begin_time = Number(new Date(form1.begin_time).getTime()) / 1000
      let end_time = Number(new Date(form1.end_time).getTime()) / 1000
      const resPostTask = await reqPostTask(form1.name, begin_time, end_time, form1.half.id, year)
      if (Number(resPostTask.code) === 200) {
        active.value = 1
        carousel.value.setActiveItem('step2')
        const resAllTask = await reqGetTaskList()
        if (Number(resAllTask.code) === 200) {
          const data = JSON.parse(resAllTask.data)
          const task = Array.prototype.find.call(data, item => {
            return item.fields.name === form1.name
          })
          task_id.value = Number(task.pk)
          active.value = 1 // 步骤条进行到1
          carousel.value.setActiveItem('step2') // 轮播图进行到第二步
        } else {
          ElMessage.error('获取任务pk值失败')
        }
      } else {
        ElMessage.error('上传体测任务基本信息失败')
      }
      loading.value = false
    }
  })
}

/* 第二步: 上传学生名单 */
const submitStusInfo = async function () {
  if (file.value.files.length === 0) {
    ElMessage.error('必须上传文件参与学生名单才能进行下一步')
    return
  } else {
    loading.value = true
    let f = new FormData()
    f.append('task_id', Number(task_id.value))
    f.append('file', file.value.files[0])
    const resPostStusInfo = await reqPostStusInfo(f)
    if (Number(resPostStusInfo.code) === 200) {
      // 获取教师名单
      const resAllTeachers = await reqGetAllTeachers()
      if (Number(resAllTeachers.code) === 200) {
        const data = JSON.parse(resAllTeachers.data)
        teacherOptions.value = data
        active.value = 2 // 步骤条进行到1
        carousel.value.setActiveItem('step3') // 轮播图进行到第二步
      } else {
        console.log(resAllTeachers)
        if (resAllTeachers.response.status === 401) {
          $router.replace({ path: '/login_register' })
        }
      }
    }
    loading.value = false
  }
}

/* 第三步: 提交体测任务 */
const addTask = async function () {
  const resPostTeachers = await reqPostTeachers(Number(task_id.value), form1.teachers)
  if (Number(resPostTeachers.code) === 200) {
    ElMessage({
      type: 'success',
      message: '添加体测任务成功',
    })
    $router.push({ name: 'taskList' })
  } else {
    ElMessage.error(`code:${resPostTeachers.code},msg:${resPostTeachers.msg}`)
    loading = false
  }
}

/* 文件变化 */
const change = function () {
  if (file.value.files[0].length === 0) {
    filename.value = ''
  } else {
    // 判断文件类型
    const isXlS =
      file.value.files[0].type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.value.files[0].type === 'application/vnd.ms-excel'
    if (!isXlS) {
      ElMessage.error('仅支持.xlsx与.xls文件')
      file.value.value = null // 清空文件
      filename.value = ''
      return
    }

    filename.value = file.value.files[0].name
    console.log(file.value.files[0])
  }
}

/* 上传学生文件 */
const upload = function () {}
</script>

<style scoped lang="scss">
@import './AddTaskView1.scss';
</style>
