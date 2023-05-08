<template>
    <div class="task-list">
        <h2 :style="{ marginBottom: '10px' }">体测任务</h2>
        <div :style="{ marginBottom: '10px' }" class="header">
            <el-button
                type="primary"
                @click="$router.push('/manage/admin/addTask1')"
                v-if="auth === 1"
            >
                <el-icon class="el-icon--left">
                    <Plus />
                </el-icon>
                添加任务
            </el-button>
            <ul class="color-tag">
                <li v-for="(item, index) in colorTag" :key="index">
                    <div>
                        <span :style="{ color: item.color }">{{ item.name }}</span>
                        <div :style="{ background: item.color }"></div>
                    </div>
                </li>
            </ul>
        </div>
        <el-table
            :data="tableData"
            style="width: 98%"
            v-loading="loading"
            border
            :row-key="row => row.pk"
            :row-class-name="tableRowClassName"
        >
            <el-table-column prop="fields.name" label="体测任务" width="180" />
            <el-table-column prop="fields.begin_time" label="起始时间" />
            <el-table-column prop="fields.end_time" label="终止时间" />
            <el-table-column prop="fields.half" label="春/秋"></el-table-column>
            <el-table-column label="操作" fixed="right" width="200" align="center">
                <template #default="scope">
                    <el-button
                        type="primary"
                        link
                        size="small"
                        v-show="auth === 2"
                        @click="logScore(scope.row)"
                    >
                        录入成绩
                    </el-button>
                    <el-button
                        type="warning"
                        link
                        size="small"
                        @click="edit(scope.row)"
                        v-if="auth === 1"
                    >
                        编辑
                    </el-button>
                    <el-button type="default" link size="small" @click="view(scope.row)" v-if="auth===1">
                        查看
                    </el-button>
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
import { reqGetTaskList, reqGetAllTeachers, reqGetTaskListByTeacherId } from '@/ajax/api.js'
import { handleTime } from '@/utils/index.js'
import { useRouter } from 'vue-router'
const $router = useRouter()

const tableData = ref([])
const totalData = ref([])
const loading = ref(false)

const colorTag = [
    { name: '发布中', color: '#E6A23C' },
    { name: '进行中', color: '#F56C6C' },
    { name: '已结束', color: '#909399' },
    { name: '未开始', color: '#67C23A' },
]

// 1.检查当前用户权限
import { chkAuth } from '@/utils/index.js'
const auth = ref(chkAuth(localStorage.getItem('auth')))

/* 分页数据 start */
let count = ref(0) // 表单数据总数
let pageSize = ref(20) // 限定每页显示20个
let currentPage = ref(1) // 当前页默认为1
/* 分页数据 end */

// 根据当前页进行数据分割
const sliceTotalData = function () {
    // 第一页显示0-19
    // 第二页显示20-39
    let startIdx = pageSize.value * (currentPage.value - 1)
    let endIdx = pageSize.value * currentPage.value
    if (endIdx > count.value) {
        endIdx = count.value
    }
    tableData.value = totalData.value.slice(startIdx, endIdx)
}

// 点击分页按钮, 切换显示数据
const switchData = function (pageNum) {
    currentPage.value = pageNum
    sliceTotalData()
}

// 获取体测任务
const getAllTaskList = async function () {
    loading.value = true
    let resTaskList = []
    if (Number(auth.value) === 1) {
        resTaskList = await reqGetTaskList()
    } else if (auth.value === 2) {
        // 获取全部的教师数据
        const resGetAllTeachers = await reqGetAllTeachers()
        if (Number(resGetAllTeachers.code) === 200) {
            const teacher_uid = localStorage.getItem('uid')
            const data = JSON.parse(resGetAllTeachers.data)
            console.log(data)
            const teacher = Array.prototype.find.call(data, item => {
                return Number(item.fields.uid) === Number(teacher_uid)
            })

            const { pk } = teacher
            localStorage.setItem('teacher_pk', pk)
            resTaskList = await reqGetTaskListByTeacherId(pk)
        }
    }
    if (Number(resTaskList.code) === 200) {
        const data = JSON.parse(resTaskList.data)
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            data[i].fields.begin_time = handleTime(data[i].fields.begin_time)
            data[i].fields.end_time = handleTime(data[i].fields.end_time)
            data[i].fields.half = Number(data[i].fields.half) === 1 ? '春' : '秋'
        }
        totalData.value = data
        count.value = totalData.value.length
        sliceTotalData()
    }
    loading.value = false
}
getAllTaskList()

/* 修改按钮 */
const edit = function (data) {
    $router.push('/manage/admin/edittask/' + data.pk)
}

/* 查看按钮 */
const view = function (data) {
    $router.push('/manage/admin/viewtask/' + data.pk)
}

/* 教师前往录入成绩页面 */
const logScore = function (data) {
    $router.push('/manage/teacher/logscore/' + data.pk)
}

/* 给表单设置状态 */
const tableRowClassName = function ({ row }) {
    let timeStamp_end = new Date(row.fields.end_time).getTime()
    let timeStamp_begin = new Date(row.fields.begin_time).getTime()
    // 发布中
    if (Number(row.fields.status) !== 1) {
        return 'publishing-row'
    }
    // 未开始
    else if (Number(timeStamp_begin) > Date.now()) {
        return 'unbegin-row'
    }
    // 已结束
    else if (Number(timeStamp_end) < Date.now()) {
        return 'end-row'
    }
    // 进行中
    else if (Number(timeStamp_begin) <= Date.now() && Number(timeStamp_end) >= Date.now()) {
        return 'progress-row'
    }
}
</script>

<style scoped lang="scss">
@import './TaskListView.scss';
</style>
