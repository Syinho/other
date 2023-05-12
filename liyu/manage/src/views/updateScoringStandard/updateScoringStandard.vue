<template>
    <div v-loading="loading">
        <h2 :style="{ marginBottom: '10px' }">修改体测评分标准</h2>
        <el-form :model="select" label-width="90px" label-position="left">
            <el-form-item label="年级">
                <el-select
                    v-model="select.grade"
                    class="m-2"
                    placeholder="选择年级"
                    size="small"
                    @change="getData"
                >
                    <el-option
                        v-for="item in gradeOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="项目">
                <el-select
                    v-model="select.key"
                    class="m-2"
                    placeholder="选择项目"
                    size="small"
                    @change="getData"
                >
                    <el-option
                        v-for="item in keyOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="性别">
                <el-select
                    v-model="select.gender"
                    class="m-2"
                    placeholder="选择性别"
                    size="small"
                    @change="getData"
                >
                    <el-option
                        v-for="item in genderOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form :model="form[select.gender]" label-position="left" label-width="90">
                <el-form-item
                    v-for="(item, index) in form[select.gender]"
                    :label="String(item.score) + '分'"
                    :key="index"
                >
                    <template #default="scope">
                        <el-input v-model="item.value" />
                    </template>
                </el-form-item>
            </el-form>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">修改评分标准</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { reqGetScoringStandard, reqPutScoringStandard } from '@/ajax/api.js'
import { handle_time, reHandleTime } from '@/utils/index.js'
const loading = ref(false)
const ruleForms = ref(null)
const select = reactive({
    // 下拉框的选择
    grade: 'low',
    key: 'bmi',
    gender: 'male',
    name: '身体质量指数',
})
const form = ref({})
const form_standard = ref({})
const gradeOptions = ref([
    { name: '低年级', value: 'low' },
    { name: '高年级', value: 'high' },
])
const keyOptions = ref([
    { name: '身体质量指数', value: 'bmi' },
    { name: '肺活量', value: 'pulmonary' },
    { name: '跳远', value: 'jump' },
    { name: '坐位体前屈', value: 'flexion' },
    { name: '50m', value: 'run50' },
    { name: '800m', value: 'run800' },
    { name: '1000m', value: 'run1000' },
    { name: '仰卧起坐', value: 'adbominal_curl' },
    { name: '引体向上', value: 'pull_up' },
])
const genderOptions = ref([
    { name: '男性', value: 'male' },
    { name: '女性', value: 'female' },
])

const getData = async function () {
    loading.value = true
    const key_Select = keyOptions.value.find(item => {
        return item.value === select.key
    })
    select.name = key_Select.name
    const res = await reqGetScoringStandard(select.key, select.grade)
    if (Number(res.code === 200)) {
        const data = JSON.parse(res.data)
        console.log(JSON.parse(data[select.key])[select.gender])

        let arr = ['run800', 'run1000']
        if (arr.indexOf(select.key) === -1) {
            console.log(1)
            form.value = JSON.parse(data[select.key])
        } else {
            console.log(2)
            const data_ = JSON.parse(data[select.key])
            let maleArr = data_['male']
            console.log(maleArr)
            let femaleArr = data_['female']
            for (let i = 0; i < maleArr.length; i++) {
                maleArr[i].value = handle_time(maleArr[i].value)
            }
            for (let i = 0; i < femaleArr.length; i++) {
                femaleArr[i].value = handle_time(femaleArr[i].value)
            }
            form.value = data_
        }
    }
    loading.value = false
}
getData()

const onSubmit = async function () {
    loading.value = true
    // 检查不允许有空字符串
    const maleArr = form.value['male']
    const femaleArr = form.value['female']

    for (let i = 0; i < maleArr.length; i++) {
        if (maleArr[i].value === '') {
            ElMessage.error(`男性的${maleArr[i].score}分字段表单项不可为空`)
            loading.value = false
            return
        }
    }
    for (let i = 0; i < femaleArr.length; i++) {
        if (femaleArr[i].value === '') {
            ElMessage.error(`女性的${femaleArr[i].score}分字段表单项不可为空`)
            loading.value = false
            return
        }
    }
    console.log(form)
    let arr = ['run800', 'run1000']
    if (arr.indexOf(select.key) !== -1) {
        for (let i = 0; i < maleArr.length; i++) {
            maleArr[i].value = reHandleTime(maleArr[i].value)
        }
        for (let i = 0; i < femaleArr.length; i++) {
            femaleArr[i].value = reHandleTime(femaleArr[i].value)
        }
    }
    let obj = { [select.key]: form.value }
    console.log(obj)
    const res = await reqPutScoringStandard(select.key, select.grade, obj)
    if (res.code === 200) {
        ElMessage({
            type: 'success',
            message: res.msg ? res.msg : '修改成功',
        })
    } else {
        ElMessage.error(res.msg ? res.msg : '修改失败')
    }
    loading.value = false
}
</script>

<style scoped lang="scss">
.slider-demo-block {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
}
.slider-demo-block .el-slider {
    margin-top: 0;
    margin-left: 12px;
}
.slider-demo-block .demonstration {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    line-height: 44px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
}
.slider-demo-block .demonstration + .el-slider {
    flex: 0 0 70%;
}
</style>
