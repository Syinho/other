<template>
  <div>
    <h2 :style="{ marginBottom: '20px' }">查看任务</h2>
    <el-descriptions title="体测任务基本信息" :column="2">
      <template #extra>
        <el-popover placement="right" :width="400" trigger="click">
          <template #reference>
            <el-button style="margin-right: 16px">点击导出数据</el-button>
          </template>
          <el-checkbox-group v-model="chkList">
            <el-checkbox :label="item" v-for="(item, index) in key_fileds" :key="index" />
          </el-checkbox-group>
          <div class="btns">
            <el-button @click="exportAll">导出标准数据</el-button>
            <el-button @click="exportSome">导出已勾选的数据</el-button>
          </div>
        </el-popover>
        <a v-if="filename" :download="filename" class="down_a" :href="FILEHOST + filename">
          点击下载{{ filename }}
        </a>
      </template>
      <el-descriptions-item label="任务名">
        {{ pageData.taskData === null ? '' : pageData.taskData.name }}
      </el-descriptions-item>
      <el-descriptions-item label="起始时间">
        {{ pageData.taskData === null ? 0 : handleTime(pageData.taskData.begin_time) }}
      </el-descriptions-item>
      <el-descriptions-item label="学期">
        {{
          pageData.taskData === null
            ? ''
            : pageData.taskData.half === 1
            ? pageData.taskData.year + '春'
            : pageData.taskData.year + '秋'
        }}
      </el-descriptions-item>
      <el-descriptions-item label="截止时间">
        {{ pageData.taskData === null ? 0 : handleTime(pageData.taskData.end_time) }}
      </el-descriptions-item>
    </el-descriptions>
    <el-divider border-style="dashed" />
    <div class="select-container">
      <el-select
        placeholder="选择年级"
        size="small"
        clearable
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
        clearable
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
        clearable
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
        clearable
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
        placeholder="请输入要查询的学号或学生姓名"
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
    >
      <el-table-column prop="fields.student.uid" label="学号" width="130"></el-table-column>
      <el-table-column prop="fields.student.name" label="学生姓名"></el-table-column>
      <!-- 体测项目成绩, 可更改 -->
      <el-table-column prop="fields.height" label="身高"></el-table-column>
      <el-table-column prop="fields.weight" label="体重"></el-table-column>
      <el-table-column prop="fields.jump" label="跳远"></el-table-column>
      <el-table-column prop="fields.flexion" label="坐位体前屈"></el-table-column>
      <el-table-column prop="fields.pull_up" label="引体向上"></el-table-column>
      <el-table-column prop="fields.pulmonary" label="肺活量"></el-table-column>
      <el-table-column prop="fields.left_eye" label="左眼视力"></el-table-column>
      <el-table-column prop="fields.right_eye" label="右眼视力"></el-table-column>
      <el-table-column prop="fields.run50" label="50m"></el-table-column>
      <el-table-column prop="fields.run800" label="800m"></el-table-column>
      <el-table-column prop="fields.run1000" label="1000m"></el-table-column>
      <!-- 体测项目分数, 不可更改 -->
      <el-table-column prop="fields.bmi_score" label="BMI分数"></el-table-column>
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
    <div class="pagination-container">
      <el-pagination
        small
        background
        layout="prev, pager, next"
        :total="count"
        class="mt-4"
        :page-size="pageSize"
        @current-change="switchData"
        :current-page="currentPage"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { translate, reTranslate } from '@/utils/index.js'
import { FILEHOST } from '@/ajax/env.js'
import {
  reqGetTask,
  reqViewTaskProgress,
  reqGetAllStusClassInfo,
  reqScore,
  reqPutStusScore,
  reqExportAll,
  reqExportSome,
} from '@/ajax/api.js'
import { useRoute, useRouter } from 'vue-router'
import { handleTime, handle_time } from '@/utils/index.js'
import { Search } from '@element-plus/icons-vue'
const filename = ref('') // 标识导出的文件名, 同时标识是否显示下载
const pageData = reactive({
  taskData: ref(null),
})
const $route = useRoute()
const $router = useRouter()
const searchParams = reactive({
  // 各个搜索框的结果集合
  task_id: $route.params.id, // 当前任务id
  grade: '', // 当前年级, 下拉框决定
  page_num: 1, // 标识表单展示的当前页码, 需要与总页数作区分
  college: '', // 当前学院, 下拉框决定
  major: '', // 当前专业, 下拉框决定
  class_name: '', // 当前班级, 下拉框决定
  search_key: 'student__uid', // 当前搜索范围选择, 搜索下拉框决定
  search_value: '', // 当前搜索值, 搜索input值决定
})
const chkList = ref([]) // 导出时勾选的多选框集合
const fileds = ref([]) //
const props = [
  // 可以被允许导出的属性
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
const loading = ref(false)
const tableData = ref([]) // 表单展示数据
const searchOptions = ref([
  { name: '学号', value: 'student__uid' },
  { name: '学生姓名', value: 'student__name' },
])
/* 分页数据 */
let count = ref(0) // 表单数据总数
let pageSize = ref(20) // 限定每页显示20个
let currentPage = ref(1) // 当前页默认为1
// let allowUpload = ref(true)

/* 1.获取指定的任务数据 */
const getTaskById = async function () {
  const id = $route.params.id
  searchParams.task_id = id
  const resGetTask = await reqGetTask(id)
  if (Number(resGetTask.code) === 200) {
    const data = JSON.parse(resGetTask.data)
    pageData.taskData = data[0].fields
    // console.log(pageData.taskData)
    /* 
      begin_time: 1683129600
      end_time: 1684425600
      half: 1
      name: "待会删除"
      status: 2
      year: 2023
    */
  }
}
getTaskById()
const schoolInfomation = ref([])
/* 获取班级,专业,学院,年级信息, 并初始化grade下拉框 */
const getInfo = async function () {
  const res = await reqGetAllStusClassInfo()
  if (res.code === 200) {
    schoolInfomation.value = JSON.parse(res.data)
    // 初始化gradeOptions即grade下拉框的值
    Array.prototype.forEach.call(schoolInfomation.value, info => {
      if (gradeOptions.value.indexOf(info.fields.grade) === -1) {
        gradeOptions.value.push(info.fields.grade)
      }
    })
    // 对下拉框的值进行排序
    Array.prototype.sort.call(gradeOptions.value, function (a, b) {
      return Number(a) - Number(b)
    })
  }
}

/* 4.获取全部的学生成绩 */
let gradeOptions = ref([])
let collegeOptions = ref([])
let majorOptions = ref([])
let classOptions = ref([])
let key_fileds = ref([]) // 所有的可选的导出字段, 即成绩字段
const getScore = async function () {
  const id = $route.params.id
  loading.value = true
  const res = await reqScore({
    task_id: searchParams.task_id,
    page_num: 1, // 第一次加载时只加载第一页
  })
  count.value = Number(res.page_count) * 20 // 赋值当前的表单的总的数据长度
  // console.log(pageCount.value) // 43
  if (Number(res.code) === 200) {
    const data = JSON.parse(res.data)
    // console.log(data)
    /* 
    [
    {
        "model": "main.score",
        "pk": 1400,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 62,
                "uid": "201824571101",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "刘**",
                "sex": 2,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1401,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 63,
                "uid": "201824571102",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "肖**",
                "sex": 2,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1402,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 64,
                "uid": "201824571103",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "唐**",
                "sex": 2,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1403,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 65,
                "uid": "201824571104",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "张**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1404,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 66,
                "uid": "201824571105",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "吉**",
                "sex": 2,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1405,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 67,
                "uid": "201824571106",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "谢**",
                "sex": 2,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "彝族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1406,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 68,
                "uid": "201824571107",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "罗**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1407,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 69,
                "uid": "201824571108",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "冉**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "土家族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1408,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 70,
                "uid": "201824571109",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "冯**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1409,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 71,
                "uid": "201824591101",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "罗**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1410,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 72,
                "uid": "201824591102",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "周**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1411,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 73,
                "uid": "201824591103",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "李**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1412,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 74,
                "uid": "201824591104",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "伯**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1413,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 75,
                "uid": "201824591105",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "胡**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1414,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 76,
                "uid": "201824591106",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "王**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1415,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 77,
                "uid": "201824591107",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "范**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1416,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 78,
                "uid": "201824591108",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "高**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "苗族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1417,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 79,
                "uid": "201824591109",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 1,
                "name": "许**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1418,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 80,
                "uid": "201824591201",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 2,
                "name": "曾**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "苗族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    },
    {
        "model": "main.score",
        "pk": 1419,
        "fields": {
            "task": {
                "name": "待会删除",
                "year": 2023,
                "half": 1,
                "begin_time": 1683129600,
                "end_time": 1684425600
            },
            "student": {
                "pk": 81,
                "uid": "201824591202",
                "college": "材料科学与工程学院",
                "grade": 2018,
                "major": "材料成型及控制工程",
                "class_name": 2,
                "name": "谭**",
                "sex": 1,
                "brithday": 971107200,
                "source": "******",
                "address": "******",
                "idcard": "200000200010101000",
                "nation": "汉族"
            },
            "height": null,
            "weight": null,
            "pulmonary": null,
            "run50": null,
            "jump": null,
            "flexion": null,
            "run800": null,
            "run1000": null,
            "adbominal_curl": null,
            "pull_up": null,
            "left_eye": null,
            "right_eye": null,
            "bmi_score": null,
            "pulmonary_score": null,
            "run50_score": null,
            "jump_score": null,
            "flexion_score": null,
            "runlong_score": null,
            "curlorup_score": null,
            "end_score": null,
            "teacher": null,
            "remark": ""
        }
    }
]
*/

    // 数据处理
    /* 对于run800与run1000字段的值进行处理,转换成m's的格式  */
    Array.prototype.forEach.call(data, stu => {
      if (stu.fields.run800) {
        stu.fields.run800 = handle_time(stu.fields.run800)
      }
      if (stu.fields.run1000) {
        stu.fields.run1000 = handle_time(stu.fields.run1000)
      }
    })

    if (data.length > 0) {
      // 因为每一个学生的体测字段都一样, 所以只获取第一个学生的体测字段
      const keys = Object.keys(data[0].fields)
      // 排除以下四个后, 剩下的就是体测项目字段
      let arr = ['task', 'student', 'teacher', 'remark']
      // 对keys中的体测字段进行翻译成汉语
      const newKeys = Array.prototype.map.call(keys, item => {
        if (arr.indexOf(item) !== -1) {
        } else {
          return translate(item)
        }
      })
      // 将空白字段从里面排除
      const compact = arr => arr.filter(item => Boolean(item))
      key_fileds.value = compact(newKeys)
      console.log(key_fileds.value)
      /* 
        [
          "身高",
          "体重",
          "肺活量",
          "50m",
          "跳远",
          "坐位体前屈",
          "800m",
          "1000m",
          "引体向上",
          "左眼视力",
          "右眼视力",
          "身高/体重得分",
          "肺活量得分",
          "50m得分",
          "跳远得分",
          "坐位体前屈得分",
          "800m/1000m得分",
          "仰卧起坐",
          "最终得分"
        ]
      */
    }
    tableData.value = data
  } else {
    ElMessage.error('获取学生分数失败')
  }
  loading.value = false
}
getInfo()
getScore()

/* 切换select */
const selectChange = async function (val, key) {
  searchParams[key] = val
  console.log(schoolInfomation.value)
  loading.value = true
  // key为grade, 那么清除college, major, class的数据
  if (key === 'grade') {
    collegeOptions.value = []
    majorOptions.value = []
    classOptions.value = []
    searchParams.college = ''
    searchParams.major = ''
    searchParams.class_name = ''
    if (val !== '') {
      // 根据新的grade数据得到college数据
      Array.prototype.forEach.call(schoolInfomation.value, info => {
        if (info.fields.grade === val && collegeOptions.value.indexOf(info.fields.college) === -1) {
          collegeOptions.value.push(info.fields.college)
        }
      })
    }
  }

  // key为college, 那么清除major,class的数据
  if (key === 'college') {
    majorOptions.value = []
    classOptions.value = []
    searchParams.major = ''
    searchParams.class_name = ''
    if (val !== '') {
      // 根据新的college数据得到major的数据
      Array.prototype.forEach.call(schoolInfomation.value, info => {
        if (info.fields.college === val && majorOptions.value.indexOf(info.fields.major) === -1) {
          console.log(majorOptions.value)
          console.log()
          majorOptions.value.push(info.fields.major)
        }
      })
    }
  }
  // key为major, 那么清除class的数据
  if (key === 'major') {
    classOptions.value = []
    searchParams.class_name = []
    if (val !== '') {
      // 根据新的major数据得到classOptions数据
      Array.prototype.forEach.call(schoolInfomation.value, info => {
        if (info.fields.major === val && classOptions.value.indexOf(info.fields.class_id) === -1) {
          classOptions.value.push(info.fields.class_id)
        }
      })
      // 对classOptions的数据进行排序处理
      Array.prototype.sort.call(classOptions.value, function (a, b) {
        return Number(a) - Number(b)
      })
    }
  }
  let paramsObj = {}
  for (const prop in searchParams) {
    // 只要search_value没有值, 就跳过增加search_key
    if (prop === 'search_key' && searchParams['search_value'] === '') {
      continue
    } else if (prop === 'search_key' && searchParams['search_value'] !== '') {
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
  // 更改当前页面的总的数据数量
  count.value = res.page_count
  if (Number(res.code) === 200) {
    const data = JSON.parse(res.data)
    tableData.value = data
  } else {
    tableData.value = []
    ElMessage.error('没有获取到任何值')
    // 修改el-pagination的数据
    count.value = 0
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
  if (Number(res.code) === 200) {
    const data = JSON.parse(res.data)
    tableData.value = data
  } else {
    ElMessage.error('获取数据失败')
  }
  loading.value = false
}

/* 跳转编辑页面 */
const edit = function (data) {
  // 从tableData中筛选出当前学生pk值一致的成绩数据
  const data_ = Array.prototype.find.call(tableData.value, stus => {
    return Number(stus.fields.student.pk) === Number(data.fields.student.pk)
  })
  // console.log(data_)
  localStorage.setItem('editData', JSON.stringify(data_))
  $router.push({
    path: '/manage/admin/editstuscore',
    query: { stu_uid: data.fields.student.uid, task_id: $route.params.id },
  })
}

/* 导出全部 */
const exportAll = async function () {
  const res = await reqExportAll($route.params.id)
  if (res.code === 200) {
    filename.value = res.filename
  }
}

const exportSome = async function () {
  let newArr = Array.prototype.map.call(chkList.value, item => {
    return reTranslate(item)
  })
  const res = await reqExportSome($route.params.id, newArr)
  if (res.code === 200) {
    filename.value = res.filename
  }
}

// 点击分页按钮, 切换显示数据
const switchData = async function (pageNum) {
  loading.value = true
  searchParams.page_num = pageNum
  currentPage.value = pageNum
  let paramsObj = {}
  for (const prop in searchParams) {
    // 只要search_value没有值, 就跳过增加search_key
    if (prop === 'search_key' && searchParams['search_value'] === '') {
      continue
    } else if (prop === 'search_key' && searchParams['search_value'] !== '') {
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
  // 向服务器发起新的请求
  const res = await reqScore(paramsObj)
  console.log(paramsObj)
  console.log(res)
  if (Number(res.code) === 200) {
    const data = JSON.parse(res.data)
    tableData.value = data
  } else {
    tableData.value = []
    ElMessage.error('没有获取到任何值')
    // 修改el-pagination的数据
    count.value = 0
  }
  loading.value = false
}
</script>

<style scoped lang="scss">
@import './viewTaskView.scss';
</style>
