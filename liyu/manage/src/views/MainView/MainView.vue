<template>
  <div id="main">
    <el-container>
      <el-header height="80px" class="header-container">
        <div class="header">
          <h1>后台管理系统</h1>
          <div class="user-info">
            <i class="iconfont icon-user" style="color: '#ccc'"></i>
            <span>{{ name }}</span>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-scrollbar>
            <navBar></navBar>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <content></content>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import navBar from '@/components/NavBar/NavBar.vue'
import content from '@/components/Content/Content.vue'
const name = ref(localStorage.getItem('name'))
</script>

<style scoped lang="scss">
@import './MainView.scss';
</style>
