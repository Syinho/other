<template>
    <div>
        <h2 :style="{ marginBottom: '10px' }">录入成绩</h2>
        <el-button
            type="primary"
            style="margin-bottom: 20px; position: relative"
            :disabled="!allowUpload"
        >
            <input
                type="file"
                name=""
                ref="file"
                id="file"
                @change="fileChange"
                accept=".xlsx,.xls"
                :disabled="!allowUpload"
                :class="{ inactive: !allowUpload }"
            />
            上传学生成绩EXCEL表单
            <div class="fileInfo" v-if="filename">
                <span>{{ filename }}</span>
                <span class="iconfont icon-aui-icon-correct"></span>
            </div>
        </el-button>
        <el-button type="primary" style="margin-bottom: 20px" @click="download">
            获取成绩模板
        </el-button>
        <a :href="fileSrc" type="download" ref="downloadFile" id="downloadFile" v-if="fileSrc">
            点击下载模板文件
        </a>
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
import { FILEHOST } from '@/ajax/env.js'
import { reqGetStusList, reqPutStusScore, reqPostStusScore, reqGetDownload } from '@/ajax/api.js'
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
const file = ref(null)
const filename = ref('')
const downloadFile = ref(null)
/* 分页数据 */
let count = ref(0) // 表单数据总数
let pageSize = ref(20) // 限定每页显示20个
let currentPage = ref(1) // 当前页默认为1
let allowUpload = ref(true)

/* 获取当前体侧任务id */
const task_id = $route.params.pk
/* 获取当前教师id */
const teacher_pk = localStorage.getItem('teacher_pk')

/* 获取学生数据 */
const getStusData = async function () {
    loading.value = true
    const tea_id = localStorage.getItem('teacher_pk')
    const tas_id = $route.params.pk
    const resStusData = await reqGetStusList(tea_id, tas_id, currentPage.value)
    if (Number(resStusData.code) === 200) {
        count.value = Number(resStusData.page_count) * pageSize.value
        const data = JSON.parse(resStusData.data)
        console.log(data)
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
    }
    loading.value = false
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
    const stu_id = scope.row.fields.student.pk
    const prop = scope.column.property
    const val = scope.row.fields[prop].value
    const score_list = [{ student_id: stu_id, [prop]: val }]
    const res = await reqPutStusScore(task_id, teacher_pk, score_list)
    console.log(res)
}

/* 主动跳页 */
const switchData = async function (pageNum) {
    loading.value = true
    const tea_id = localStorage.getItem('teacher_pk')
    const tas_id = $route.params.pk
    currentPage.value = pageNum
    const resStusData = await reqGetStusList(tea_id, tas_id, currentPage.value)
    if (Number(resStusData.code) === 200) {
        count.value = Number(resStusData.page_count) * pageSize.value
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
    }
    loading.value = false
}

/* 点击上传学生成绩文件 */
const fileChange = async function () {
    // 判断是否有文件
    if (file.value.files.length === 0) {
        filename.value = ''
        return
    }
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
    allowUpload.value = false
    filename.value = file.value.files[0].name
    let f = new FormData()
    f.append('task_id', $route.params.pk)
    f.append('file', file.value.files[0])
    const res = await reqPostStusScore(f)
    if (Number(res.code) === 200) {
        ElMessage({
            type: 'success',
            message: '上传文件成功, 请刷新查看',
        })
    } else {
        ElMessage.error('上传文件失败')
        file.value.value = null // 清空文件
        filename.value = ''
    }
    allowUpload.value = true
}

/* 下载成绩模板 */
let fileSrc = ref('')
const download = async function () {
    const res = await reqGetDownload(task_id, teacher_pk)
    console.log(res)
    if (Number(res.code) === 200) {
        fileSrc.value = `${FILEHOST}${res.filename}`
        // downloadFile.value.dispatchEvent(new MouseEvent('click'))
        // document.querySelector('#downloadFile').dispatchEvent(new MouseEvent('click'))
        // var myClick = new MouseEvent('click', {
        //     view: window,
        //     bubbles: true,
        //     cancelable: true,
        // })
        // document.querySelector('#downloadFile').dispatchEvent(myClick)
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
#file {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    cursor: pointer;
    &.inactive {
        cursor: not-allowed;
    }
}
.fileInfo {
    width: 150px;
    text-indent: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    line-height: 30px;
    vertical-align: bottom;
    position: absolute;
    top: 0;
    right: -150px;
    color: green;
    font-size: 12px;
}

#downloadFile {
    color: green;
    font-size: 12px;
    text-decoration: underline;
}
</style>
