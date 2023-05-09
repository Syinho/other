<template>
    <h2 :style="{ marginBottom: '20px' }">数据统计</h2>
    <el-form>
        <el-form-item label="体测项目选择">
            <el-select
                v-model="form.fields"
                multiple
                placeholder="请选择您要查看的字段"
                style="width: 240px"
                size="small"
                @change="disable"
            >
                <el-option
                    v-for="item in options_fields"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="数据类型选择">
            <el-select
                v-model="form.data"
                multiple
                placeholder="请选择您要查看的数据类型"
                style="width: 240px"
                size="small"
                @change="disable"
            >
                <el-option
                    v-for="item in options_dataType"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button @click="query" type="primary" size="small">执行查询</el-button>
        </el-form-item>
    </el-form>
    <div>
        <el-descriptions
            :title="translate(field)"
            v-for="(field, index) in fields"
            :key="'field' + index"
            column="2"
            border
        >
            <el-descriptions-item :label="item" v-for="(item, index) in data">
                {{ queryResult[field][item] }}
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { translateObj, translate } from '@/utils/index.js'
import { reqStatisticalData } from '@/ajax/api.js'
import { useRoute, useRouter } from 'vue-router'
const $router = useRouter()
const $route = useRoute()
const task_id = $route.params.id
const options_fields = ref(translateObj)
const options_dataType = ref([
    { name: '最大值', value: 'max' },
    { name: '最小值', value: 'min' },
    { name: '良好', value: 'good' },
    { name: '及格', value: 'median' },
    { name: '优秀', value: 'excellent' },
    { name: '及格', value: 'qualified' },
    { name: '不及格', value: 'unqualified' },
])
const translate_ = ref({
    max: '最大值',
    min: '最小值',
    good: '良好',
    median: '及格',
    excellent: '优秀',
    qualified: '及格',
    unqualified: '不及格',
})
const form = reactive({
    fields: [],
    data: [],
})
watch(
    () => form.fields,
    newval => {
        console.log(newval)
    }
)
const show = ref(false)
const queryResult = ref({})
const fields = ref([])
const data = ref([])
const query = async function () {
    const res = await reqStatisticalData({ task_id, items: form.fields, statics_names: form.data })
    if (res.code === 200) {
        const data_ = JSON.parse(res.data)
        queryResult.value = data_
        fields.value = form.fields
        data.value = form.data
        show.value = true
    } else {
        ElMessage.error(res.msg ? res.msg : '查询错误')
    }
}
const disable = function () {
    fields.value = []
    data.value = []
}
</script>

<style scoped lang="scss">
@import './ViewTaskData.scss';
</style>
