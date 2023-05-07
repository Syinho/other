<template>
    <div>
        <h2 :style="{ marginBottom: '10px' }">查看体测评分标准</h2>
        <el-form>
            <el-form-item label="选择年级">
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
            <el-form-item label="选择项目">
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
            <el-form-item label="选择性别">
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
        </el-form>
        <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading"
            border
            :row-key="row => row.id"
            :span-method="objectSpanMethod"
        >
            <el-table-column label="等级" prop="class"></el-table-column>
            <el-table-column label="得分" prop="score"></el-table-column>
            <el-table-column label="体测结果" prop="value"></el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { reqGetScoringStandard } from '@/ajax/api.js'
const select = reactive({
    grade: 'low',
    key: 'bmi',
    gender: 'male',
})
const tableData = ref([])
const loading = ref(false)
const gradeOptions = ref([
    { name: '低年级', value: 'low' },
    { name: '高年级', value: 'high' },
])
const keyOptions = ref([
    { name: '身体质量指数', value: 'bmi' },
    { name: '肺活量', value: 'pulmonary' },
    { name: '50米短跑', value: 'run50' },
    { name: '跳远', value: 'jump' },
    { name: '坐位体前屈', value: 'flexion' },
    { name: '8000米跑', value: 'run800' },
    { name: '1000米跑', value: 'run1000' },
    { name: '仰卧起坐', value: 'adbominal_curl' },
    { name: '引体向上', value: 'pull_up' },
])
const genderOptions = ref([
    { name: '男性', value: 'male' },
    { name: '女性', value: 'female' },
])

/* 获取数据 */
const getData = async function () {
    loading.value = true
    const res = await reqGetScoringStandard(select.key, select.grade)
    if (res.code === 200) {
        const data = JSON.parse(res.data)
        const data_ = JSON.parse(data[select.key])
        const data__ = data_[select.gender]
        console.log(data_[select.gender])
        // 处理数据
        Array.prototype.forEach.call(data__, (item, index) => {
            item.id = index
            const score = Number(item.score)
            if (score >= 90 && score <= 100) {
                item.class = '优秀'
            } else if (score >= 80 && score < 90) {
                item.class = '良好'
            } else if (score >= 60 && score < 80) {
                item.class = '及格'
            } else {
                item.class = '不及格'
            }
        })
        // 数据排序
        Array.prototype.sort.call(data__, function (prev, cur) {
            return Number(cur.score) - Number(prev.score)
        })

        /* 数据处理 */

        for (let i = 0; i < data__.length; i++) {
            let cur = data__[i]
            if (i === 0) {
                cur.rowspan = 1
                cur.colspan = 1
                continue
            }
            let prev = data__[i - 1]
            if (cur.class === prev.class) {
                let firstIndex = Array.prototype.findIndex.call(data__, item => {
                    return item.class === cur.class
                })
                data__[firstIndex].rowspan++
                cur.rowspan = 0
                cur.colspan = 0
            } else {
                cur.rowspan = 1
                cur.colspan = 1
            }
        }
        tableData.value = data__
    } else {
        ElMessage.error('获取数据失败')
    }
    loading.value = false
}
getData()

/*  */
const objectSpanMethod = function ({ row, column, rowIndex, columnIndex }) {
    if (columnIndex === 0) {
        return { rowspan: row.rowspan, colspan: row.colspan }
    }
}
</script>

<style scoped lang="scss"></style>
