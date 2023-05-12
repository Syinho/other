<template>
  <div>
    <h2 :style="{ marginBottom: '10px' }">修改学生分数</h2>
    <el-form :model="form" label-width="90px" label-position="left">
      <el-form-item label="姓名">
        <el-col :md="10" :sm="16" :xs="24">
          <el-input v-model="form.student.name" disabled />
        </el-col>
      </el-form-item>
      <el-form-item label="学号">
        <el-col :md="10" :sm="16" :xs="24">
          <el-input v-model="form.student.uid" disabled />
        </el-col>
      </el-form-item>
    </el-form>
    <el-form :model="form" :inline="true" label-width="90px" label-position="left">
      <el-form-item prop="height" label="身高">
        <el-input v-model="form.height" placeholder="请输入学生的身高" />
      </el-form-item>
      <el-form-item prop="weight" label="体重">
        <el-input v-model="form.weight" placeholder="请输入学生的体重" />
      </el-form-item>
      <el-form-item prop="flexion" label="坐位体前屈">
        <el-input v-model="form.flexion" placeholder="请输入学生的坐位体前屈数据" />
      </el-form-item>
      <el-form-item prop="jump" label="跳远">
        <el-input v-model="form.jump" placeholder="请输入学生的跳远数据" />
      </el-form-item>
      <el-form-item prop="pulmonary" label="肺活量">
        <el-input v-model="form.pulmonary" placeholder="请输入学生的肺活量数据" />
      </el-form-item>
      <el-form-item prop="adbominal_curl" label="仰卧起坐">
        <el-input v-model="form.adbominal_curl" placeholder="请输入学生的仰卧起坐数据" />
      </el-form-item>
      <el-form-item prop="pull_up" label="引体向上">
        <el-input v-model="form.pull_up" placeholder="请输入学生的引体向上数据" />
      </el-form-item>
      <el-form-item prop="left_eye" label="左眼视力">
        <el-input v-model="form.left_eye" placeholder="请输入学生的左眼视力数据" />
      </el-form-item>
      <el-form-item prop="right_eye" label="右眼视力">
        <el-input v-model="form.right_eye" placeholder="请输入学生的右眼视力数据" />
      </el-form-item>
      <el-form-item prop="run50" label="50m">
        <el-input v-model="form.run50" placeholder="请输入学生的50m数据" />
      </el-form-item>
      <el-form-item prop="run800" label="800m">
        <el-input v-model="form.run800" placeholder="请输入学生的800m数据" />
      </el-form-item>
      <el-form-item prop="run1000" label="1000m">
        <el-input v-model="form.run1000" placeholder="请输入学生的1000m数据" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain size="small" @click="submit">提交</el-button>
        <el-button type="info" plain size="small" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reqGetScore, reqPutStusScore2 } from '@/ajax/api.js'
import { reHandleTime } from '@/utils/index.js'
const $router = useRouter()
const $route = useRoute()
const form = ref({
  student: {},
})
const stu_uid = $route.query.stu_uid
const task_id = $route.query.task_id
const stu_pk = ref()
const allScore = ref([])

// 初始化学生成绩
const initStusScore = function () {
  let stusScore = localStorage.getItem('editData')
  console.log(stusScore)
  if (!stusScore) {
    ElMessage.error('获取学生成绩数据失败, 请前往查看任务页面重试')
    console.log($route)
    console.log($router)
    $router.back()
  } else {
    stusScore = JSON.parse(stusScore)
    console.log(stusScore)
    form.value = stusScore.fields
    stu_pk.value = stusScore.fields.student.pk
  }
  localStorage.removeItem('editData')
}
initStusScore()

// 根据stu_uid值获取学生的成绩
const getScore = async function () {
  const res = await reqGetScore(stu_uid)
  if (Number(res.code) === 200) {
    const data = JSON.parse(res.data)
    console.log(data)
    const task = Array.prototype.find.call(data, item => {
      return Number(item.pk) === Number(task_id)
    })
    console.log(task)
    stu_pk.value = task.fields.student.pk
    console.log(task)
    form.value = task.fields
    console.log(form.value)
  } else {
    ElMessage.error('从服务器获取指定学生成绩数据失败')
  }
}
// getScore()

// 根据task_id获取全部的学生成绩
const getAllScoreByTaskId = function () {}

const submit = async function () {
  let arr = ['remark', 'student', 'task', 'teacher']
  let reg = /\w+_score/
  let score = {}
  for (let prop in form.value) {
    if (arr.indexOf(prop) === -1 && !reg.test(prop)) {
      console.log(prop)
      if (prop === 'run800' || prop === 'run1000') {
        let reg = /^\d{1,}'{1}\d{0,2}$/
        if (reg.test(String(form.value[prop]))) {
          score[prop] = reHandleTime(form.value[prop])
        } else {
          if (!Boolean(form.value[prop])) {
            score[prop] = form.value[prop]
          } else {
            ElMessage.error(`字段${prop}数据格式有误, 请重新输入`)
            return
          }
        }
      } else {
        if (!Boolean(score[prop])) {
          score[prop] = form.value[prop]
        }
        score[prop] = Number(form.value[prop])
      }
    }
  }

  score.student_id = stu_pk.value
  const data = { task_id, teacher_id: '', score_list: [score] }
  console.log(score)
  const res = await reqPutStusScore2(data)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: res.msg,
    })
    $router.back()
  } else {
    ElMessage.error(res.msg ? res.msg : '修改失败')
  }
}

/* 取消修改, 返回上一页 */
const cancel = function () {
  $router.back()
}
</script>

<style scoped lang="scss"></style>
