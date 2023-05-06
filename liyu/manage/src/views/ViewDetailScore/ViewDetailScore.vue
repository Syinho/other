<template>
    <h2 :style="{ marginBottom: '10px' }">查看体测成绩</h2>
    <el-descriptions :title="detail.fields.task.name" :column="1" v-if="detail !== null">
        <el-descriptions-item v-for="(item, index) in list" :label="item.key">
            {{ item.value === null ? '未录入' : item.value }}
        </el-descriptions-item>
    </el-descriptions>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const $router = useRouter()
const detail = ref(null)
const list = ref([])

const getScore = function () {
    const score = localStorage.getItem('score')

    if (!score) {
        $router.push('/manage/student/viewscore')
    } else {
        const scoreData = JSON.parse(score)
        detail.value = scoreData
        console.log(detail.value)
        localStorage.removeItem('score')
        // 处理数据
        let arr = ['task', 'student', 'teacher', 'remark']
        let reg = /_score/g
        for (const prop in scoreData.fields) {
            console.log(prop)
            if (arr.indexOf(prop) === -1 && !reg.test(prop)) {
                list.value.push({ key: prop, value: scoreData.fields[prop] })
            }
        }
        console.log(list.value)
    }
}
getScore()
</script>

<style scoped lang="scss"></style>
