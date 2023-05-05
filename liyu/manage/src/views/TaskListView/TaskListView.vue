<template>
    <div class="task-list">
        <h2 :style="{ marginBottom: '10px' }">体测任务</h2>
        <el-button
            type="primary"
            :style="{ marginBottom: '10px' }"
            @click="$router.push('/manage/admin/addTask1')"
            v-show="auth === 1"
        >
            <el-icon class="el-icon--left"><Plus /></el-icon>
            添加任务
        </el-button>
        <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading"
            border
            max-height="calc(100vh - 250px)"
            :row-key="row => row.pk"
            :row-class-name="tableRowClassName"
        >
            <el-table-column prop="fields.name" label="体测任务" width="180" />
            <el-table-column prop="fields.begin_time" label="起始时间" />
            <el-table-column prop="fields.end_time" label="终止时间" />
            <el-table-column prop="fields.half" label="春/秋"></el-table-column>
            <el-table-column label="操作" fixed="right" width="200">
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
                    <el-button type="warning" link size="small" @click="edit(scope.row)">
                        编辑
                    </el-button>
                    <el-button type="default" link size="small" @click="view(scope.row)">
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
            const tea_id = localStorage.getItem('pk')
            const data = JSON.parse(resGetAllTeachers.data)
            const teacher = Array.prototype.find.call(data, item => {
                return Number(item.fields.user) === Number(tea_id)
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
const edit = function () {}

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
    if (Number(row.fields.status) === 1) {
        return 'success-row'
    } else if (row.fields.status === 2) {
        return 'warning-row'
    } else if (row.fields.status === 3) {
        return 'danger-row'
    } else {
        return ''
    }
}
</script>

<style scoped lang="scss">
.pagination-container {
    width: 100%;
    height: 50px;
    border: 1px solid #ebeef5;
    border-top: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 15px;
}
.task-list {
    & :deep(.el-table .warning-row) {
        background: #e6a23c;
    }

    & :deep(.el-table .success-row) {
        background: rgba(103, 194, 58, 0.3);
    }

    & :deep(.el-table .danger-row) {
        background: #f56c6c;
    }
}
</style>
