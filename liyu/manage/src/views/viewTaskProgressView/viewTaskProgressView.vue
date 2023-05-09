<template>
    <div>
        <h2 :style="{ marginBottom: '10px' }">查看任务完成情况</h2>
        <el-table
            :data="tableData"
            border
            style="width: 98%"
            stripe
            :max-height="'calc(80vh - 180px)'"
            :row-key="row => row.pk"
            v-loading="loading"
        >
            <el-table-column label="职工号" prop="teacher__uid" align="center"></el-table-column>
            <el-table-column label="教师姓名" prop="teacher__name" align="center"></el-table-column>
            <el-table-column
                label="已登记学生数"
                prop="already_count"
                align="center"
            ></el-table-column>
            <el-table-column label="总学生数" prop="total_count" align="center"></el-table-column>
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
import { reqViewTaskProgress, reqGetAllTeachers } from '@/ajax/api.js'
import { useRoute, useRouter } from 'vue-router'
const $router = useRouter()
const $route = useRoute()
const id = $route.params.id
const tableData = ref([])
const totalData = ref([])
const loading = ref(false)
/* 1.分页数据 */
let count = ref(0) // 表单数据总数
let pageSize = ref(20) // 限定每页显示20个
let currentPage = ref(1) // 当前页默认为1
const getTaskProgress = async function () {
    loading.value = true
    const res_teachers = await reqGetAllTeachers()
    if (res_teachers.code === 200) {
        const data = JSON.parse(res_teachers.data)
        console.log(data)
    }
    const res = await reqViewTaskProgress(id)
    if (Number(res.code) === 200) {
        const data = JSON.parse(res.data)
        console.log(data)
        totalData.value = data
        count.value = data.length
        sliceDataByCurrentPage()
    } else {
        ElMessage.error('请求数据失败')
    }
    loading.value = false
}
getTaskProgress()

/* 4.分页管理 */
// 根据当前pagination分割数据
function sliceDataByCurrentPage() {
    count.value = totalData.value.length

    let startIdx = pageSize.value * (currentPage.value - 1)
    let endIdx = pageSize.value * currentPage.value
    if (endIdx > count.value) {
        endIdx = count.value
    }
    tableData.value = totalData.value.slice(startIdx, endIdx)
}

/* 5.切换分页按钮, 切换显示数据  */
const switchData = function (pageNum) {
    currentPage.value = pageNum
    sliceDataByCurrentPage()
}
</script>

<style scoped lang="scss">
.pagination-container {
    width: 98%;
    height: 50px;
    border: 1px solid #ebeef5;
    border-top: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 15px;
}
</style>
