<template>
    <el-scrollbar>
        <div id="content">
            <router-view></router-view>
        </div>
    </el-scrollbar>
</template>

<script setup></script>

<style scoped lang="scss">
#content {
    width: 100%;
}
.scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}
</style>
