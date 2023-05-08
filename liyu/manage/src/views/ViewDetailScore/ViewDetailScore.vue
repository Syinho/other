<template>
    <h2 :style="{ marginBottom: '10px' }">查看体测成绩</h2>
    <!-- <el-descriptions :title="detail.fields.task.name" :column="1" v-if="detail !== null">
        <el-descriptions-item v-for="(item, index) in list" :label="item.key">
            {{ item.value === null ? '未录入' : item.value }}
        </el-descriptions-item>
    </el-descriptions> -->
    <el-table :data="tableData" style="width: 100%" v-loading="loading" border stripe>
        <el-table-column prop="name" label="项目" align="center"></el-table-column>
        <el-table-column prop="part" label="数据" align="center"></el-table-column>
        <el-table-column prop="value" label="分数" align="center"></el-table-column>
    </el-table>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { translate } from '@/utils/index.js'
const $router = useRouter()
const detail = ref(null)
const list = ref([])
const tableData = ref([{}])
const loading = ref(false)
const initData = ref([])

const getScore = function () {
    const score = localStorage.getItem('score')

    if (!score) {
        $router.push('/manage/student/viewscore')
    } else {
        const scoreData = JSON.parse(score)
        detail.value = scoreData
        localStorage.removeItem('score')
        console.log(scoreData)
        // 处理数据
        let arr = ['task', 'student', 'teacher']
        for (const prop in scoreData.fields) {
            if (arr.indexOf(prop) === -1) {
                initData.value.push({ key: prop, value: scoreData.fields[prop] })
            }
        }
        for (let i = 0; i < initData.value.length; i++) {
            let reg = /_score/g
            let item = initData.value[i]
            if (reg.test(item.key)) {
                let key_ = tran(item.key)
                let scoreObj = {
                    name: key_,
                    value: item.value,
                    part: '',
                }
                console.log(item)
                if (item.key === 'bmi_score') {
                    if (scoreData.fields['height']) {
                        scoreObj.part += `身高${scoreData.fields['height']}`
                    }
                    if (scoreData.fields['weight']) {
                        scoreObj.part += `体重${scoreData.fields['weight']}`
                    }
                } else if (item.key === 'pulmonary_score') {
                    scoreObj.part = scoreData.fields['pulmonary']
                        ? scoreData.fields['pulmonary']
                        : ''
                } else if (item.key === 'run50_score') {
                    scoreObj.part = scoreData.fields['run50'] ? scoreData.fields['run50'] : ''
                } else if (item.key === 'jump_score') {
                    scoreObj.part = scoreData.fields['jump'] ? scoreData.fields['jump'] : ''
                } else if (item.key === 'flexion_score') {
                    scoreObj.part = scoreData.fields['flexion'] ? scoreData.fields['flexion'] : ''
                } else if (item.key === 'runlong_score') {
                    scoreObj.part = scoreData.fields['run800']
                        ? scoreData.fields['run800']
                        : scoreData.fields['run1000']
                } else if (item.key === 'curlorup_score') {
                    scoreObj.part = scoreData.fields['pull_up']
                        ? scoreData.fields['pull_up']
                        : scoreData.fields['adbominal_curl']
                }
                tableData.value.push(scoreObj)
            }
        }
        tableData.value.shift()
        console.log(tableData.value)
    }
}
getScore()

function tran(key) {
    let reg = /(\w+)_score/g
    if (reg.test(key)) {
        return translate[RegExp.$1]
    } else {
        return translate[key]
    }
}
</script>

<style scoped lang="scss"></style>
