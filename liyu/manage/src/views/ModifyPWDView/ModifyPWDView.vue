<template>
    <div>
        <h2 :style="{ marginBottom: '10px' }">修改您的密码</h2>
        <el-form :model="form" label-width="140px" ref="ruleForms" :rules="rules">
            <el-form-item prop="name" label="用户">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.name" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item prop="pwd" label="输入密码">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.pwd" type="password"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item prop="repwd" label="再次输入密码">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.repwd" type="password"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="confirm">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { reqPutPwd } from '@/ajax/api.js'
import { useRouter } from 'vue-router'
const $router = useRouter()

/* 页面数据 */
const form = reactive({
    name: localStorage.getItem('name'),
    pwd: '',
    repwd: '',
})
const ruleForms = ref(null)
/* 密码自定义规则 */
const chkPWD = (rule, value, callback) => {
    console.log(value)
    if (form.pwd === value) {
        return callback()
    }
    callback(new Error('两次密码输入不一致'))
}
const rules = reactive({
    pwd: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
        { min: 6, max: 18, message: '密码长度应在6-18位', trigger: 'blur' },
    ],
    repwd: [
        {
            required: true,
            message: '请再次输入密码用以确认',
            trigger: 'blur',
        },
        {
            validator: chkPWD,
            trigger: 'blur',
        },
    ],
})

/* 获取使用者信息 */

/* 确认修改 */
const confirm = function () {
    ruleForms.value.validate(async valid => {
        if (valid) {
            const res = await reqPutPwd(localStorage.getItem('uid'), form.pwd)
            if (Number(res.code) === 200) {
                ElMessage({
                    type: 'success',
                    message: '修改成功',
                })
                $router.push('/login_register')
            } else {
                ElMessage.error('修改失败')
            }
        }
    })
}
</script>

<style scoped lang="scss"></style>
