<template>
    <h2 :style="{ marginBottom: '20px' }">数据统计</h2>
    <el-select v-model="value1" multiple placeholder="请选择您要查看的字段" style="width: 240px">
        <el-option
            v-for="item in options_fields"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
    </el-select>
    <el-select v-model="value1" multiple placeholder="请选择您要查看的数据类型" style="width: 240px">
        <el-option
            v-for="item in options_dataType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
    </el-select>
</template>

<script setup>
import {ref,reactive} from 'vue'
import {reqStatisticalData} from '@/ajax/api.js'
const options_fields=ref([{name:''}])
const options_dataType=ref([])

</script>

<style scoped lang="scss"></style>
