<template>
    <div id="main">
        <el-container>
            <el-header height="80px" class="header-container">
                <div class="header">
                    <h1>后台管理系统</h1>
                    <el-popover placement="top-start" :width="100" trigger="hover">
                        <template #reference>
                            <div class="user-info">
                                <i class="iconfont icon-user" style="color: '#ccc'"></i>
                                <span>{{ name }}</span>
                            </div>
                        </template>
                        <!-- <el-text size="small">{{ '用户 ' + name }}</el-text> -->
                        <el-button type="danger" size="small" style="width: 100%" @click="logout">
                            退出登录
                        </el-button>
                    </el-popover>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-scrollbar>
                        <navBar></navBar>
                    </el-scrollbar>
                </el-aside>
                <el-main style="height: calc(100vh - 80px)">
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
import { useRouter } from 'vue-router'
const name = ref(localStorage.getItem('name'))
const $router = useRouter()
/* 退出登录 */
const logout = function () {
    localStorage.clear()
    $router.push('/login_register')
}
</script>

<style scoped lang="scss">
@import './MainView.scss';
</style>
