<template>
    <div>
        <h2 :style="{ marginBottom: '10px' }">修改学生分数</h2>
        <el-form :model="form" label-width="80px">
            <el-form-item prop="height" label="身高">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.height" placeholder="请输入学生的身高" />
                </el-col>
            </el-form-item>
            <el-form-item prop="weight" label="体重">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.weight" placeholder="请输入学生的体重" />
                </el-col>
            </el-form-item>
            <el-form-item prop="flexion" label="坐位体前屈">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.flexion" placeholder="请输入学生的坐位体前屈数据" />
                </el-col>
            </el-form-item>
            <el-form-item prop="jump" label="跳远">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.jump" placeholder="请输入学生的跳远数据" />
                </el-col>
            </el-form-item>
            <el-form-item prop="pulmonary" label="肺活量">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.pulmonary" placeholder="请输入学生的肺活量数据" />
                </el-col>
            </el-form-item>
            <el-form-item prop="adbominal" label="仰卧起坐">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.adbominal" placeholder="请输入学生的仰卧起坐数据" />
                </el-col>
            </el-form-item>
            <el-form-item prop="pull_up" label="引体向上">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.pull_up" placeholder="请输入学生的引体向上数据" />
                </el-col>
            </el-form-item>
            <el-form-item prop="left_eye" label="左眼视力">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.left_eye" placeholder="请输入学生的左眼视力数据" />
                </el-col>
            </el-form-item>
            <el-form-item prop="right_eye" label="右眼视力">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.right_eye" placeholder="请输入学生的右眼视力数据" />
                </el-col>
            </el-form-item>
            <el-form-item prop="run50" label="50m">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.run50" placeholder="请输入学生的50m数据" />
                </el-col>
            </el-form-item>
            <el-form-item prop="run800" label="800m">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.run800" placeholder="请输入学生的800m数据" />
                </el-col>
            </el-form-item>
            <el-form-item prop="run1000" label="1000m">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.run1000" placeholder="请输入学生的1000m数据" />
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain size="small" @click="submit">提交</el-button>
                <el-button type="info" plain size="small">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reqGetScore, reqPutStusScore } from '@/ajax/api.js'
const $router = useRouter()
const $route = useRoute()
const form = ref({})
const stu_uid = $route.query.stu_uid
const task_id = $route.query.task_id
const stu_pk = ref()
// 根据stu_uid值获取学生的成绩
const getScore = async function () {
    const res = await reqGetScore(stu_uid)
    console.log(res)
    if (Number(res.code) === 200) {
        const data = JSON.parse(res.data)
        console.log(data)
        const task = Array.prototype.find.call(data, item => {
            return Number(item.pk) === Number(task_id)
        })
        stu_pk.value = task.fields.student.pk
        console.log(task)
        form.value = { ...task.fields }
        console.log(form.value)
    }
}
getScore()

const submit = async function () {
    let arr = ['remark', 'student', 'task', 'teacher']
    let reg = /\w+_score/
    let score = {}
    for (let prop in form.value) {
        if (arr.indexOf(prop) === -1 && !reg.test(prop)) {
            console.log(prop)
            score[prop] = form.value[prop]
        }
    }
    console.log(score)
    score.student_id = stu_pk.value
    const data = { task_id, score_list: [score] }
    const res = await reqPutStusScore(data)
    console.log(res)
}
</script>

<style scoped lang="scss"></style>
