<template>
  <div>
    <h2 :style="{ marginBottom: '10px' }">录入成绩</h2>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      border
      stripe
      max-height="calc(100vh - 250px)"
      :row-key="row => row.pk"
      @cell-dblclick="dbclick"
      @cell-click="click"
      :row-style="{ height: '45px' }"
    >
      <el-table-column prop="fields.student.uid" label="学生UID" width="180" />
      <el-table-column prop="fields.student.name" label="学生姓名" width="180" />
      <el-table-column prop="fields.student.sex" label="性别"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="height"
        label="身高"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="weight"
        label="体重"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="adbominal_curl"
        label="仰卧起坐"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="flexion"
        label="坐位体前屈"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="jump"
        label="跳远"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="pull_up"
        label="引体向上"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="pulmonary"
        label="肺活量"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="left_eye"
        label="左眼"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="right_eye"
        label="右眼"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="run50"
        label="50米"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="run800"
        label="800米"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="120"
        align="center"
        prop="run1000"
        label="1000米"
        sortable
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.fields[scope.column.property].value"
            v-show="scope.row.fields[scope.column.property].showInput"
            @blur="blur(scope)"
            size="small"
            style="width: 100%"
          ></el-input>
          <el-text v-show="!scope.row.fields[scope.column.property].showInput">
            {{ scope.row.fields[scope.column.property].value }}
          </el-text>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { reqGetStusList, reqPutStusScore } from '@/ajax/api.js'
import { useRoute } from 'vue-router'
const $route = useRoute()
const tableData = ref([])
const loading = ref(false)
const props = [
  'adbominal_curl',
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

/* 获取当前体侧任务id */
const task_id = $route.params.pk
/* 获取当前教师id */
const teacher_pk = localStorage.getItem('teacher_pk')

/* 获取学生数据 */
const getStusData = async function () {
  const tea_id = localStorage.getItem('teacher_pk')
  const tas_id = $route.params.pk
  const resStusData = await reqGetStusList(tea_id, tas_id, 1)
  if (Number(resStusData.code) === 200) {
    const data = JSON.parse(resStusData.data)
    // 处理数据
    Array.prototype.forEach.call(data, stu => {
      if (Number(stu.fields.student.sex) === 1) {
        stu.fields.student.sex = '男'
      } else if (Number(stu.fields.student.sex) === 2) {
        stu.fields.student.sex = '女'
      }
      Array.prototype.forEach.call(props, prop => {
        stu.fields[prop] = { showInput: false, value: stu.fields[prop] }
      })
    })
    tableData.value = data
    console.log(data)
  }
}
getStusData()

const hiddenInputs = function () {
  Array.prototype.forEach.call(tableData.value, item => {
    const fields = item.fields
    Array.prototype.forEach.call(props, prop => {
      fields[prop].showInput = false
    })
  })
}

const dbclick = function (row, column, cell, event) {
  if (row.fields[column.property] === undefined) {
    return hiddenInputs()
  }
  if (row.fields[column.property].showInput) {
    return
  } else {
    hiddenInputs()
    row.fields[column.property].showInput = true
  }
}

const click = function (row, column, cell, event) {
  if (row.fields[column.property] === undefined) {
    return hiddenInputs()
  }
  if (row.fields[column.property].showInput) {
    return
  } else {
    hiddenInputs()
  }
}
const blur = async function (scope) {
  console.log(scope)
  const stu_id = scope.row.pk
  const prop = scope.column.property
  const val = scope.row.fields[prop].value
  const score_list = [{ student_id: stu_id }, { [prop]: val }]
  const res = await reqPutStusScore(task_id, teacher_pk, score_list)
  console.log(res)
}
</script>

<style scoped lang="scss"></style>
