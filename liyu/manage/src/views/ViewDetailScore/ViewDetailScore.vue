<template>
    <h2 :style="{ marginBottom: '10px' }">查看体测成绩</h2>
    <!-- <el-descriptions :title="detail.fields.task.name" :column="1" v-if="detail !== null">
        <el-descriptions-item v-for="(item, index) in list" :label="item.key">
            {{ item.value === null ? '未录入' : item.value }}
        </el-descriptions-item>
    </el-descriptions> -->
    <el-table :data="tableData" style="width: 100%" v-loading="loading" border stripe>
        <el-table-column prop="name" label="项目"></el-table-column>
        <el-table-column prop="fields.name" label="项目组成分数"></el-table-column>
        <el-table-column prop="value" label="分数"></el-table-column>
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
        // 处理数据
        let arr = ['task', 'student', 'teacher', 'remark']
        for (const prop in scoreData.fields) {
            if (arr.indexOf(prop) === -1) {
                list.value.push({ key: prop, value: scoreData.fields[prop] })
            }
        }
        initData.value = list.value
        console.log(initData.value)
        // let score_obj
        // for (let i = 0; i < initData.value.length; i++) {
        //     let reg = /_score/g
        //     let item = initData.value[i]
        //     if (reg.test(item.key)) {
        //         let key_ = tran(item.key)
        //         let score_obj={ name: key_, value: item.value }
        //         if(item==='bmi_score'){
        //            const wh_score= Array.prototype.filter.call(initData,obj=>{
        //                 if(obj.key==='width'||obj.key==='height'){
        //                     return true
        //                 }
        //             })
        //             for(let i=0;i<wh_score;i++){

        //             }
        //         }
        //         tableData.value.push({ name: key_, value: item.value })

        //     }
        // }
        // tableData.value.shift()
        // console.log(tableData.value)
    }
}
getScore()

function tran(key) {
    let reg = /(\w+)_score/g
    if (reg.test(key)) {
        return translate[RegExp.$1] + '分数'
    } else {
        return translate[key]
    }
}
</script>

<style scoped lang="scss"></style>
