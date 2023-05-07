<template>
    <div>
        <h2 :style="{ marginBottom: '10px' }">修改体测评分标准</h2>
        <el-form :model="form" label-width="90px" v-loading="loading">
            <el-form-item label="key">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-input v-model="form.key" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="年级选择">
                <el-col :md="10" :sm="16" :xs="24">
                    <el-select v-model="form.grade" style="width: 100%">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="权重值修改">
                <div class="slider-demo-block" v-for="(item, index) in form.value">
                    <span class="demonstration">{{ item.name }}</span>
                    <el-slider v-model="item.value" :min="0.0" :max="1.0" :step="0.01" />
                    <span :style="{ marginLeft: '10px', width: '40px' }">{{ item.value }}</span>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">修改评分标准</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const loading = ref(false)
const ruleForms = ref(null)
const rules = reactive({})

const options = ref([
    { name: '低年级', value: 'low' },
    { name: '高年级', value: 'high' },
])

const form = reactive({
    key: 'end_score',
    grade: 'low',
    value: [
        { name: '身体质量指数', key: 'bmi', value: 0.15 },
        { name: '肺活量', key: 'pulmonary', value: 0.15 },
        { name: '跳远', key: 'jump', value: 0.1 },
        { name: '坐位体前屈', key: 'flexion', value: 0.1 },
        { name: '长跑?', key: 'runlong', value: 0.2 },
        { name: '卷曲?', key: 'curlorup', value: 0.1 },
    ],
})
const keyOptions = ref([
    { name: '身体质量指数', key: 'bmi', value: 0.15 },
    { name: '肺活量', key: 'pulmonary', value: 0.15 },
    { name: '跳远', key: 'jump', value: 0.1 },
    { name: '坐位体前屈', key: 'flexion', value: 0.1 },
    { name: '长跑?', key: 'runlong', value: 0.2 },
    { name: '卷曲?', key: 'curlorup', value: 0.1 },
])

const onSubmit = function () {}
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
