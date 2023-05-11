<template>
    <div v-loading="loading">
        <h2 :style="{ marginBottom: '10px' }">学生账号管理</h2>
        <el-table
            :data="tableData"
            style="width: 98%"
            border
            stripe
            :row-key="row => row.pk"
            @cell-dblclick="dbclick"
            @cell-click="click"
            :row-style="{ height: '45px' }"
        >
            <el-table-column prop="fields.uid" label="学号" width="130"></el-table-column>
            <el-table-column prop="college" label="学院">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.fields[scope.column.property].value"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        @blur="blur(scope)"
                        size="small"
                        style="width: 100%; height: 40px"
                    ></el-input>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].value }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column prop="grade" label="年级">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.fields[scope.column.property].value"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        @blur="blur(scope)"
                        size="small"
                        style="width: 100%; height: 40px"
                    ></el-input>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].value }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column prop="major" label="专业">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.fields[scope.column.property].value"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        @blur="blur(scope)"
                        size="small"
                        style="width: 100%; height: 40px"
                    ></el-input>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].value }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column prop="class_name" label="班级">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.fields[scope.column.property].value"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        @blur="blur(scope)"
                        size="small"
                        style="width: 100%; height: 40px"
                    ></el-input>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].value }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.fields[scope.column.property].value"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        @blur="blur(scope)"
                        size="small"
                        style="width: 100%; height: 40px"
                        @keyup.enter.native="
                            e => {
                                enterAndSubmit(e, scope)
                            }
                        "
                    ></el-input>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].value }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别">
                <template #default="scope">
                    <el-select
                        :model-value="scope.row.fields[scope.column.property].name"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        size="small"
                        style="width: 100%; height: 100%"
                        @change="
                            val => {
                                selectChange(val, scope.row.fields.uid)
                            }
                        "
                    >
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].name }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column prop="source" label="学生来源">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.fields[scope.column.property].value"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        @blur="blur(scope)"
                        size="small"
                        style="width: 100%; height: 40px"
                    ></el-input>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].value }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="家庭住址">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.fields[scope.column.property].value"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        @blur="blur(scope)"
                        size="small"
                        style="width: 100%; height: 40px"
                    ></el-input>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].value }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column prop="idcard" label="身份证号">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.fields[scope.column.property].value"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        @blur="blur(scope)"
                        size="small"
                        style="width: 100%; height: 40px"
                    ></el-input>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].value }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column prop="nation" label="民族">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.fields[scope.column.property].value"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        @blur="blur(scope)"
                        size="small"
                        style="width: 100%; height: 40px"
                    ></el-input>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].value }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column label="状态" fixed="right" width="80" align="center">
                <template #default="scope">
                    <el-switch
                        :model-value="Boolean(scope.row.fields.user.status)"
                        @change="
                            val => {
                                switchChange(val, scope)
                            }
                        "
                    />
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
import { ref, reactive } from 'vue'
import { reqGetAllStusList, reqPutStus, reqPutStusStatus, } from '@/ajax/api.js'
const tableData = ref([])
const totalData = ref([])
const loading = ref(false)
const props = [
    'address',
    'brithday',
    'class_name',
    'college',
    'grade',
    'idcard',
    'major',
    'name',
    'nation',
    'sex',
    'source',
]
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

// 点击分页按钮, 切换显示数据
const switchData = function (pageNum) {
    loading.value = true
    currentPage.value = pageNum
    sliceTotalData()
    loading.value = false
}

/* 获取全部的学生列表 */
const getAllStus = async function () {
    loading.value = true
    const res = await reqGetAllStusList()
    if (Number(res.code) === 200) {
        const data = JSON.parse(res.data)
        console.log(data)
        count.value = data.length
        totalData.value = data
        /* 数据处理 */
        Array.prototype.forEach.call(totalData.value, stu => {
            Array.prototype.forEach.call(props, prop => {
                if (prop === 'sex') {
                    stu.fields[prop] = {
                        value: stu.fields[prop],
                        name: Number(stu.fields[prop]) === 1 ? '男' : '女',
                        showInput: false,
                    }
                } else {
                    stu.fields[prop] = { value: stu.fields[prop], showInput: false }
                }
            })
        })
        sliceTotalData()
    }
    loading.value = false
}
getAllStus()

const hiddenInputs = function () {
    Array.prototype.forEach.call(tableData.value, item => {
        const fields = item.fields
        Array.prototype.forEach.call(props, prop => {
            fields[prop].showInput = false
        })
    })
}

const click = function (row, column, cell, event) {
    if (row.fields[column.property] === undefined) {
        return hiddenInputs()
    } else {
        if (row.fields[column.property].showInput) {
            return
        } else {
            hiddenInputs()
        }
    }
}

const blur = async function (scope) {
    loading.value = true
    const stu_id = scope.row.fields.uid
    const prop = scope.column.property
    const val = scope.row.fields[prop].value

    console.log(stu_id, prop, val)
    let payload = { uid: stu_id, key: prop, value: val }
    const res = await reqPutStus(payload)
    console.log(res)
    if (Number(res.code) === 200) {
        ElMessage({
            type: 'success',
            message: '修改成功',
        })
    } else {
        ElMessage.error('修改失败')
    }
    loading.value = false
}

const dbclick = function (row, column, cell, event) {
    console.log(column.property)
    console.log(row.fields[column.property])
    if (row.fields[column.property] === undefined) {
        return hiddenInputs()
    } else {
        if (row.fields[column.property].showInput) {
            return
        } else {
            hiddenInputs()
            row.fields[column.property].showInput = true
        }
    }
}

const selectChange = async function (val, uid) {
    loading.value = true
    console.log(val, uid)
    const row = Array.prototype.find.call(tableData.value, row => {
        return Number(row.fields['uid']) === Number(uid)
    })
    console.log(row)
    if (Number(val) === 1) {
        row.fields['sex'].name = '男'
        row.fields['sex'].value = val
        console.log(row)
    } else {
        row.fields['sex'].name = '女'
        row.fields['sex'].value = val
    }
    const stu_id = row.fields.uid
    const prop = 'sex'
    const val_ = row.fields[prop].value
    let payload = { uid: stu_id, key: prop, value: val_ }
    const res = await reqPutStus(payload)
    console.log(res)
    if (Number(res.code) === 200) {
        ElMessage({
            type: 'success',
            message: '修改成功',
        })
        hiddenInputs()
    } else {
        ElMessage.error('修改失败')
    }
    loading.value = false
}

const switchChange = async function (val, scope) {
    console.log(val, scope)
    loading.value = true
    if (val) {
        scope.row.fields.user.status = 1
    } else {
        scope.row.fields.user.status = 0
    }
    const res = await reqPutStusStatus(scope.row.fields.uid, scope.row.fields.user.status)
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

const enterAndSubmit = function (val,scope) {
  console.log(val,scope)
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
