<template>
  <h2 :style="{ marginBottom: '20px' }">数据统计</h2>
  <el-form>
    <el-form-item label="体测项目选择">
      <el-select
        v-model="form.fields"
        multiple
        placeholder="请选择您要查看的字段"
        style="width: 240px"
        @change="disable"
        size="default"
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
        @change="disable"
      >
        <el-option
          v-for="item in options_dataType"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-button-group style="margin-left: 20px">
        <el-button @click="choiceAlldataType" type="success">
          <i class="iconfont icon-true" style="margin-right: 3px"></i>
          一键全选
        </el-button>
        <el-button type="danger" @click="cancelAlldataType">
          一键取消
          <i class="iconfont icon-false" style="margin-left: 3px"></i>
        </el-button>
      </el-button-group>
    </el-form-item>
    <el-form-item>
      <el-button @click="query" type="primary" size="default">执行查询</el-button>
    </el-form-item>
  </el-form>
  <div v-for="(field, index) in fields" style="margin-bottom: 15px">
    <el-descriptions :title="translate(field)" :key="'field' + index" :column="1">
      <el-descriptions-item :label="trans(item)" v-for="(item, index) in data">
        {{
          arr_.indexOf(item) === -1
            ? queryResult[field][item]
            : Number(queryResult[field][item] * 100).toFixed(2) + '%'
        }}
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
  { name: '良好率', value: 'good' },
  { name: '中位数', value: 'median' },
  { name: '优秀率', value: 'excellent' },
  { name: '及格率', value: 'qualified' },
  { name: '不及格率', value: 'unqualified' },
])
const translate_ = {
  max: '最大值',
  min: '最小值',
  good: '良好率',
  median: '中位数',
  excellent: '优秀率',
  qualified: '及格率',
  unqualified: '不及格率',
}
let arr_ = ref(['good', 'excellent', 'qualified', 'unqualified'])
const trans = function (key) {
  return translate_[key]
}
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

/* 意见全选 */
const choiceAlldataType = function () {
  // 1.清空所有
  form.data = []
  Array.prototype.forEach.call(options_dataType.value, data_type => {
    form.data.push(data_type.value)
  })
}
const cancelAlldataType = function () {
  form.data = []
}
</script>

<style scoped lang="scss">
@import './ViewTaskData.scss';
</style>
