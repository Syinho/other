<template>
    <div>
        <h2 :style="{ marginBottom: '10px' }">查看体测成绩</h2>
        <el-table
            :data="tableData"
            border
            style="width: 100%"
            max-height="calc(80vh - 120px)"
            :row-key="row => row.pk"
            v-loading="loading"
        >
            <el-table-column label="任务名称" prop="fields.task.name"></el-table-column>
            <el-table-column label="学期" prop="fields.task.half"></el-table-column>
            <el-table-column label="开始时间" prop="fields.task.begin_time"></el-table-column>
            <el-table-column label="结束时间" prop="fields.task.end_time"></el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button link size="small" type="primary" @click="view(scope.row)">
                        查看成绩
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
import { ref } from 'vue'
import { reqGetScore } from '@/ajax/api.js'
import { useRouter } from 'vue-router'
import { handleTime } from '@/utils/index.js'
const $router = useRouter()

/* 数据 */
const tableData = ref([])
const totalData = ref([])
const loading = ref(false)
/* 分页数据 */
let count = ref(0) // 表单数据总数
let pageSize = ref(10) // 限定每页显示20个
let currentPage = ref(1) // 当前页默认为1

/* 1.获取学生自己的uid */
const uid = ref(localStorage.getItem('uid'))

/* 2.根据学生自己的uid发起请求自己的成绩 */
const getScore = async function () {
    loading.value = true

    if (uid.value) {
        const resViewScore = await reqGetScore(uid.value)
        const data = JSON.parse(resViewScore.data)
        console.log(data)
        // 数据处理
        Array.prototype.forEach.call(data, item => {
            if (Number(item.fields.task.half) === 1) {
                item.fields.task.half = item.fields.task.year + '春期'
            } else if (Number(item.fields.task.half) === 2) {
                item.fields.task.half = item.fields.task.year + '秋期'
            }
            item.fields.task.begin_time = handleTime(Number(item.fields.task.begin_time) * 1000)
            item.fields.task.end_time = handleTime(Number(item.fields.task.end_time) * 1000)
        })

        totalData.value = data
        count.value = data.length
        sliceDataByCurrentPage()
    } else {
        ElMessage.error('你UID呢?')
    }
    loading.value = false
}
getScore()

/* 查看成绩 */
const view = function (data) {
    console.log(data)
    localStorage.setItem('score', JSON.stringify(data))
    $router.push({ name: 'viewDetailScore' })
}

/* 分页管理 */
// 根据当前pagination分割数据
function sliceDataByCurrentPage() {
    let startIdx = pageSize.value * (currentPage.value - 1)
    let endIdx = pageSize.value * currentPage.value
    if (endIdx > count.value) {
        endIdx = count.value
    }
    tableData.value = totalData.value.slice(startIdx, endIdx)
}

/* 切换分页按钮, 切换显示数据  */
const switchData = function (pageNum) {
    currentPage.value = pageNum
    sliceDataByCurrentPage()
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
</style>
