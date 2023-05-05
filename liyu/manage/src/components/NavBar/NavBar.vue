<template>
  <el-menu :default-active="activeIndex" class="el-menu-vertical-demo nav-bar-content" router>
    <el-menu-item index="1" v-if="Number(auth) === 3">
      <el-icon><Document /></el-icon>
      <span>体测成绩</span>
    </el-menu-item>
    <el-menu-item index="/manage/admin/tasklist" v-show="auth === 1">
      <el-icon><Tickets /></el-icon>
      <span>体测任务</span>
    </el-menu-item>
    <el-menu-item index="/manage/teacher/tasklist" v-show="auth === 2">
      <el-icon><Tickets /></el-icon>
      <span>体测任务</span>
    </el-menu-item>
    <el-sub-menu index="/manage/admin/userManage" v-if="Number(auth) === 1">
      <template #title>
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/manage/admin/teachermanage">
          <template #title>
            <el-icon><User /></el-icon>
            <span>教师账号管理</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/manage/admin/studentmanage">
          <template #title>
            <el-icon><User /></el-icon>
            <span>学生账号管理</span>
          </template>
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="4">
      <el-icon><Notebook /></el-icon>
      <span>评分标准</span>
    </el-menu-item>
    <el-menu-item index="5">
      <el-icon><Setting /></el-icon>
      <span>修改密码</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const $router = useRouter()
const $route = useRoute()
const showChildrenMenu = ref(false)
// 1.检查当前用户权限
import { chkAuth } from '@/utils/index.js'
const taskListRoute = ref('')

const auth = ref(chkAuth(localStorage.getItem('auth')))
console.log(auth.value)
if (auth === 1) {
  taskListRoute.value = '/manage/admin/tasklist'
} else if (auth === 2) {
  taskListRoute.value = '/manage/teacher/tasklist'
}
const data = ref([
  { label: '体测成绩' },
  { label: '评分标准' },
  {
    label: '用户管理',
    children: [{ label: '教师账号管理' }, { label: '学生账号管理' }],
  },
])

/* 默认路由 */
const activeIndex = ref($route.path)
</script>

<style scoped lang="scss">
@import './NavBar.scss';
</style>
