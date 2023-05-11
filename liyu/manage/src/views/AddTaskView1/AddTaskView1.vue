<template>
  <div>
    <h2 :style="{ marginBottom: '20px' }" v-cloak>{{ title }}</h2>
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
        style="width: calc(80vw - 150px)"
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
              <el-input
                v-model="form1.name"
                placeholder="请输入要添加的体测任务名"
                :style="{ width: '214px' }"
              ></el-input>
            </el-form-item>
            <el-form-item prop="begin_time" label="体测任务开始时间">
              <el-config-provider :locale="zhCn">
                <el-date-picker
                  v-model="form1.begin_time"
                  type="datetime"
                  placeholder="选择体测开始时间"
                />
              </el-config-provider>
            </el-form-item>
            <el-form-item prop="end_time" label="体测任务结束时间">
              <el-config-provider :locale="zhCn">
                <el-date-picker
                  v-model="form1.end_time"
                  type="datetime"
                  placeholder="选择体测结束时间"
                />
              </el-config-provider>
            </el-form-item>
            <el-form-item label="年份" prop="year">
              <el-input
                v-model="form1.year"
                placeholder="请输入体测的年份"
                :style="{ width: '214px' }"
              ></el-input>
            </el-form-item>
            <el-form-item prop="half.value" label="春/秋">
              <el-select
                v-model="form1.half"
                class="m-2"
                placeholder="选择学期"
                :style="{ width: '214px' }"
              >
                <el-option
                  v-for="item in seasonOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="submitBasicInfo" v-if="addOrModify">
                下一步
              </el-button>
              <el-button type="success" @click="modifyStusInfo" v-if="!addOrModify">
                确认修改
              </el-button>
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
          <h4 :style="{ marginBottom: '20px' }">选择参与的体测教师</h4>
          <el-button-group style="margin-bottom: 20px">
            <el-button @click="choiceAllTeacher" type="success">
              <i class="iconfont icon-true" style="margin-right: 3px"></i>
              一键全选
            </el-button>
            <el-button type="danger" @click="cancelAllTeacher">
              一键取消
              <i class="iconfont icon-false" style="margin-left: 3px"></i>
            </el-button>
          </el-button-group>
          <el-row>
            <el-col :md="16" :sm="16" :xs="24">
              <el-select
                v-model="form1.teachers"
                multiple
                placeholder="选择教师"
                style="width: 100%"
              >
                <el-option
                  v-for="item in teacherOptions"
                  :key="item.pk"
                  :label="item.fields.name"
                  :value="item.pk"
                />
              </el-select>
            </el-col>
          </el-row>
          <div :style="{ height: '20px' }"></div>
          <el-button type="primary" @click="addTask">完成</el-button>
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
  reqGetTask,
  reqUpdateTask,
} from '@/ajax/api.js'
import { ref, reactive, watch, nextTick, computed } from 'vue'
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
  half: { name: '春', value: 1 },
  teachers: [],
  year: '',
})
let teacherOptions = ref([]) // 储存全部的教师数据
const seasonOptions = ref([
  { name: '春', value: 1 },
  { name: '秋', value: 2 },
])

const ruleForms1 = ref(null)
let loading = ref(false)
const filename = ref('')
const addOrModify = ref(true) // 标识是添加还是修改数据, 默认true值代表是添加数据
const status = ref(null)

const title = computed(() => {
  if (status.value === null) {
    return '添加任务'
  } else if (Number(status.value) === 1) {
    return '修改任务基本信息'
  } else if (Number(status.value) === 2 || Number(status.value) === 3) {
    return '完善任务信息'
  }
})

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
const chkRoute = async function () {
  let id = $route.params.id
  if (!id) {
    console.log('没有id')
  } else {
    // 检查status
    loading.value = true

    const res = await reqGetTask(id)
    if (res.code === 200) {
      const data = JSON.parse(res.data)[0]
      // 任务状态为1, 代表已完成三次任务提交, 进入该页面只是修改任务的基本信息
      console.log(data.fields.status)
      status.value = data.fields.status
      if (Number(data.fields.status) === 1) {
        addOrModify.value = false

        task_id.value = Number(id)
        active.value = 3 // 步骤条进行到3
        carousel.value.setActiveItem('step1') // 在第一页修改基本信息
        console.log(data)
        form1.name = data.fields.name
        form1.begin_time = Number(data.fields.begin_time) * 1000
        form1.end_time = Number(data.fields.end_time) * 1000
        form1.half.value = Number(data.fields.half)
        form1.half.name = Number(data.fields.half) === 1 ? '春' : '秋'
        //   form1.half = {
        //     value: Number(data.fields.half),
        //     name: Number(data.fields.half) === 1 ? '春' : '秋',
        //   }
        form1.year = data.fields.year
      }
      // 任务状态为3, 代表提交了基本的任务信息, 没有提交学生的表单
      else if (Number(data.fields.status) === 3) {
        task_id.value = Number(id)
        active.value = 1 // 步骤条进行到1
        carousel.value.setActiveItem('step2')
      } else if (Number(data.fields.status) === 2) {
        // 获取教师名单
        const resAllTeachers = await reqGetAllTeachers()
        if (Number(resAllTeachers.code) === 200) {
          const data = JSON.parse(resAllTeachers.data)
          task_id.value = Number(id)
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
    }
    loading.value = false
  }
}
chkRoute()
/* 监听起始时间 start */
watch(
  () => form1.begin_time,
  () => {
    let begin_timeStamp = new Date(form1.begin_time).getTime()

    if (form1.end_time === '') {
      return
    } else {
      let endTimeStamp = new Date(form1.end_time).getTime()
      if (begin_timeStamp >= endTimeStamp) {
        ElMessage.error('起始时间应该小于截止时间')
        form1.begin_time = ''
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
      const resPostTask = await reqPostTask(
        form1.name,
        begin_time,
        end_time,
        form1.half.value,
        year
      )
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
    $router.push({ path: '/manage/admin/tasklist' })
  } else {
    ElMessage.error(`code:${resPostTeachers.code},msg:${resPostTeachers.msg}`)
    loading.value = false
  }
}

/* 修改体测基本数据 */
const modifyStusInfo = function () {
  console.log({
    task_id: task_id.value,
    name: form1.name,
    begin_time: Number(form1.begin_time) / 1000,
    end_time: Number(form1.end_time) / 1000,
    year: form1.year,
    half: form1.half.value,
  })
  ruleForms1.value.validate(async valid => {
    if (valid) {
      const res = await reqUpdateTask({
        task_id: Number(task_id.value),
        name: form1.name,
        begin_time: Number(form1.begin_time) / 1000,
        end_time: Number(form1.end_time) / 1000,
        year: form1.year,
        half: form1.half.value,
      })
      if (Number(res.code) === 200) {
        ElMessage({
          type: 'success',
          message: '修改成功',
        })
        $router.push('/manage/admin/tasklist')
      } else {
        ElMessage.error('修改失败')
      }
    }
  })
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

/* 一键全选所有教师 */
const choiceAllTeacher = function () {
  // 1.清空表单
  form1.teachers = []
  Array.prototype.forEach.call(teacherOptions.value, teacher => {
    form1.teachers.push(teacher.pk)
  })
}

/* 一键清空 */
const cancelAllTeacher = function () {
  form1.teachers = []
}
</script>

<style scoped lang="scss">
@import './AddTaskView1.scss';
</style>
