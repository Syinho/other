<template>
    <div>
        <h2 :style="{ marginBottom: '10px' }">添加教师</h2>
        <el-form
            :model="form"
            label-width="150px"
            ref="ruleForms"
            :rules="rules"
            v-loading="loading"
        >
            <el-form-item prop="uid" label="职工号">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.uid" placeholder="请输入职工号"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item prop="name" label="教师姓名">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.name" placeholder="请输入教师姓名"></el-input>
                </el-col>
            </el-form-item>
            <!-- 点击提交表单 -->
            <el-form-item>
                <el-button type="primary" @click="onSubmit">添加教师</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { reqPostNewTeacher } from '@/ajax/api.js'
import { useRouter } from 'vue-router'
const $router = useRouter()
let loading = ref(false)
const form = reactive({
    uid: '',
    name: '',
})
const ruleForms = ref(null)
/* 校验规则 */
const rules = reactive({
    name: [
        {
            required: true,
            message: '请填写教师名',
            trigger: 'blur',
        },
    ],
    uid: [
        {
            required: true,
            message: '请填写UID',
            trigger: 'blur',
        },
    ],
})

/* 提交表单 */
const onSubmit = function () {
    ruleForms.value.validate(async valid => {
        if (valid) {
            loading.value = true
            const resAddNewTeacher = await reqPostNewTeacher(form.uid, form.name)
            if (Number(resAddNewTeacher.code) === 200) {
                console.log(resAddNewTeacher)
                ElMessage({
                    type: 'success',
                    message: resAddNewTeacher.msg,
                })
                $router.push('/manage/admin/teachermanage')
            } else {
                ElMessage.error(resAddNewTeacher.msg ? resAddNewTeacher.msg : '注册失败')
            }
            loading.value = false
        }
    })
}
</script>

<style scoped lang="scss"></style>
