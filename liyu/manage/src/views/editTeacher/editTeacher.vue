<template>
    <div>
        <h2 :style="{ marginBottom: '10px' }">修改教师账号信息</h2>
        <el-form>
            <el-col :md="10" :sm="16" :xs="24">
                <el-form-item label="教师姓名">
                    <el-input v-model="form.name" placeholder="请填写教师名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :md="10" :sm="16" :xs="24">
                <el-form-item>
                    <el-button @click="confirm" type="primary" plain size="small">
                        确认修改
                    </el-button>
                    <el-button @click="cancel" type="info" plain size="small">取消</el-button>
                </el-form-item>
            </el-col>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reqPutTeacher } from '@/ajax/api.js'
const $route = useRoute()
const $router = useRouter()
const id = $route.params.id
const form = reactive({
    name: '',
})

/* 获取名字 */
const teacher_name = localStorage.getItem('teacher_name')
if (!teacher_name) {
    $router.push('/manage/admin/teachermanage')
} else {
    form.name = teacher_name
    localStorage.removeItem('teacher_name')
}

const confirm = async function () {
    if (form.name === '') {
        ElMessage.error('输入框不可为空')
    } else {
        const res = await reqPutTeacher(id, 'name', form.name)
        if (Number(res.code) === 200) {
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            $router.push('/manage/admin/teachermanage')
        } else {
            ElMessage.error('修改失败')
        }
    }
}

const cancel = function () {
    $router.push('/manage/admin/teachermanage')
}
</script>

<style scoped lang="scss"></style>
