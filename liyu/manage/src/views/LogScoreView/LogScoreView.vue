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
            @cell-mouse-leave="hoverLeave"
            :row-style="{ height: '45px' }"
        >
            <el-table-column prop="fields.student.uid" label="学生UID" width="180" />
            <el-table-column prop="fields.student.name" label="学生姓名" width="180" />
            <el-table-column prop="fields.student.sex" label="性别"></el-table-column>
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="fields.height.value"
                label="身高"
                sortable
            >
                <template #default="scope" v-if="show">
                    <!-- <el-input
                        v-model="scope.row.fields[scope.column.property].value"
                        v-show="scope.row.fields[scope.column.property].showInput"
                        clearable
                        size="small"
                        style="width: 100%"
                        :autofocus="true"
                    ></el-input>
                    <el-text v-show="!scope.row.fields[scope.column.property].showInput">
                        {{ scope.row.fields[scope.column.property].value }}
                    </el-text> -->
                    <el-text>{{ scope.row.fields }}</el-text>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { reqGetStusList } from '@/ajax/api.js'
import { useRoute } from 'vue-router'
const $route = useRoute()
const tableData = ref([])
const loading = ref(false)
const show = ref(false)
// const props = ref([
//     { name: 'adbominal_curl', value: '仰卧起坐' },
//     { name: 'flexion', value: '坐位体前屈' },
//     { name: 'height', value: '身高' },
//     { name: 'jump', value: '跳远' },
//     { name: 'left_eye', value: '左眼' },
//     { name: 'pull_up', value: '引体向上' },
//     { name: 'pulmonary', value: '肺活量' },
//     { name: 'right_eye', value: '右眼' },
//     { name: 'run50', value: '50米' },
//     { name: 'run800', value: '800米' },
//     { name: 'run1000', value: '1000米' },
// ])
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
]

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
        show.value = true
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
    if (row.fields[column.property].showInput) {
        return
    } else {
        hiddenInputs()
        row.fields[column.property].showInput = true
    }
}

const click = function (row, column, cell, event) {
    if (row.fields[column.property].showInput) {
        return
    } else {
        hiddenInputs()
    }
}
const hoverLeave = function (row, column, cell, event) {
    if (!row.fields[column.property].showInput) {
        return
    } else {
        row.fields[column.property].showInput = false
    }
}
</script>

<style scoped lang="scss"></style>
