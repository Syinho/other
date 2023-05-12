<template>
    <h2 :style="{ marginBottom: '10px' }">教师账号管理</h2>
    <el-button
        type="primary"
        :style="{ marginBottom: '10px' }"
        @click="$router.push('/manage/admin/addteacher')"
    >
        <el-icon class="el-icon--left"><Plus /></el-icon>
        添加教师
    </el-button>
    <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        border
        stripe
        :row-key="row => row.pk"
    >
        <el-table-column prop="fields.uid" label="职工号"></el-table-column>
        <el-table-column prop="fields.name" label="教师姓名"></el-table-column>
        <el-table-column label="编辑">
            <template #default="scope">
                <el-button
                    @click="edit(scope.row.fields.uid, scope.row.fields.name)"
                    plain
                    size="small"
                    type="primary"
                >
                    编辑
                </el-button>
            </template>
        </el-table-column>
        <el-table-column label="状态更改">
            <template #default="scope">
                <el-switch
                    :model-value="Boolean(scope.row.fields.user.status)"
                    @change="
                        val => {
                            switchChange(val, scope)
                        }
                    "
                ></el-switch>
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
</template>

<script setup>
import { ref } from 'vue'
import { reqGetAllTeachers, reqPutTeacherStatus } from '@/ajax/api.js'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const $router = useRouter()
const tableData = ref([])
const totalData = ref([])

const loading = ref(false)
/* 分页数据 start */
let count = ref(0) // 表单数据总数
let pageSize = ref(10) // 限定每页显示20个
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

/* 获取全部的教师账号 */
/* 获取全部教师数据 */
const getAllTeachers = async function () {
    loading.value = true
    const resAllTeachers = await reqGetAllTeachers()
    if (Number(resAllTeachers.code) === 200) {
        const data = JSON.parse(resAllTeachers.data)
        count.value = data.length
        totalData.value = data
        sliceTotalData()
    }

    loading.value = false
}
getAllTeachers()

const edit = function (pk, name) {
    localStorage.setItem('teacher_name', name)
    $router.push(`/manage/admin/editteacher/${pk}`)
}

/* 修改状态 */
const switchChange = async function (val, scope) {
    loading.value = true
    if (val) {
        scope.row.fields.user.status = 1
    } else {
        scope.row.fields.user.status = 0
    }
    const res = await reqPutTeacherStatus(scope.row.fields.uid, scope.row.fields.user.status)
    if (Number(res.code) === 200) {
        ElMessage({
            type: 'success',
            message: '修改状态成功',
        })
    } else {
        ElMessage.error('修改状态失败')
    }

    loading.value = false
}

// 点击分页按钮, 切换显示数据
const switchData = function (pageNum) {
    currentPage.value = pageNum
    sliceTotalData()
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
