<template>
    <div id="blank">
        <div class="content">
            <div>您访问的是空白页面, 或者您的账号没有权限访问该页面</div>
            <div class="btns">
                <button @click="$router.push('/login_register')">点击返回登录页面</button>
                <button>点击返回后台首页</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
const $router=useRouter()
</script>

<style scoped lang="scss">
#blank {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    background-color: #000;
    & > .content {
        width: 800px;
        height: 500px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        & > div:nth-of-type(1) {
            font-size: 30px;
            text-align: center;
        }
        & > .btns {
            width: 100%;
            height: 200px;
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
            margin-top: 50px;
            & > button {
                width: 150px;
                height: 60px;
                line-height: 60px;
                text-align: center;
                background-color: #000;
                color: #fff;
                border: 1px solid #fff;
                cursor: pointer;
                border-radius: 15px;
                transition: .3s;
                &:hover{
                  background-color: #fff;
                  color: #000;
                }
            }
        }
    }
}
</style>
