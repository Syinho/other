<template>
  <div id="app">
    <div id="main">
      <div
        id="loginInterface"
        v-loading="loading"
        element-loading-background="rgba(255, 255, 255, 0.5)"
      >
        <div id="loginImg">
          <div id="circle">
            <div id="leftCloud" class="cloud"></div>
            <div id="rightCloud" class="cloud"></div>
          </div>
          <div id="starsArea">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
          </div>
          <div id="meteor">
            <div class="meteor"></div>
            <div class="meteor"></div>
          </div>
          <p id="title">MANAGE</p>
        </div>
        <div id="login">
          <header>
            <span style="top: 0">登 录</span>
            <span style="top: 70px">注 册</span>
          </header>
          <section>
            <form>
              <div class="form">
                <input type="text" name="" id="user" placeholder="UID" v-model="form.uid" />
              </div>
              <div class="form">
                <input
                  type="password"
                  name=""
                  id="pwd"
                  placeholder="密码"
                  v-model="form.password"
                />
              </div>
              <div class="register-input" :class="isLogin ? 'inactive' : 'active'">
                <div class="form name">
                  <input
                    type="text"
                    name=""
                    id="name"
                    placeholder="用户名"
                    v-model="form.register_name"
                    :disabled="isDisabled"
                  />
                </div>
                <div class="form confirm">
                  <input
                    type="password"
                    name=""
                    id="confirm-pwd"
                    placeholder="再次输入密码"
                    v-model="form.register_password"
                    :disabled="isDisabled"
                  />
                </div>
              </div>
              <input type="button" value="登录" class="btn" @click="login" />
              <input type="button" value="注册" class="btn" id="btn" @click="register" />
            </form>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { reqPostLogin, reqPostRegister } from '@/ajax/api.js'
import md5 from 'md5'
import { useRouter } from 'vue-router'
import { chkAuth } from '@/utils/index.js'
const $router = useRouter()
const form = reactive({
  uid: '', // 用户id
  password: '', // 密码
  register_name: '', // 注册时用户名
  register_password: '', // 注册时再次输入的密码
})
let isDisabled = ref(false)
let loading = ref(false)
let isLogin = ref(true) // 标识当前是否是登录界面

let login = function () {}

let register = function () {}

const clearForm = function () {
  form.uid = form.password = form.register_name = form.register_password = ''
}

onMounted(() => {
  let onoff = true
  let oLog = document.getElementsByTagName('header')[0].getElementsByTagName('span')[0]
  let oSign = document.getElementsByTagName('header')[0].getElementsByTagName('span')[1]

  randomStar()

  function randomStar() {
    let starData = []
    for (let i = 0; i < 10; i++) {
      let randomBorder = Math.floor(Math.random() * 11 + 5) // [5,15]
      let randomTop = Math.floor(Math.random() * 401 + 50)
      let randomLeft = Math.floor(Math.random() * 391 + 50)
      check({
        top: randomTop,
        left: randomLeft,
      })
      starData.push({
        border: randomBorder,
        top: randomTop,
        left: randomLeft,
      })
    }

    const aStar = document.getElementsByClassName('star')
    for (let i = 0; i < aStar.length; i++) {
      aStar[i].style.width = aStar[i].style.height = starData[i].border + 'px'
      aStar[i].style.top = starData[i].top + 'px'
      aStar[i].style.left = starData[i].left + 'px'
    }

    const aMeteor = document.getElementsByClassName('meteor')
    aMeteor[0].style.top = starData[starData.length - 2].top + 'px'
    aMeteor[0].style.left = starData[starData.length - 2].left + 'px'
    aMeteor[1].style.top = starData[starData.length - 1].top + 'px'

    aMeteor[1].style.left = starData[starData.length - 1].left + 'px'

    function check(obj) {
      starData.forEach((item, index, arr) => {
        if (item.top == obj.top && item.left == obj.left) {
          randomTop = Math.floor(Math.random() * 401 + 50)
          randomLeft = Math.floor(Math.random() * 391 + 50)
          arguments.callee({
            top: randomTop,
            left: randomLeft,
          })
        }
      })
    }
  }

  login = async function () {
    if (onoff) {
      // 1.登录且处于登录界面
      // 2.检查username, password的值是否存在
      // 2.1 检查值是否存在
      if (form.uid === '') {
        return ElMessage.error('用户ID不可为空')
      } else if (form.password === '') {
        return ElMessage.error('密码不可为空')
      }
      loading.value = true
      const resLogin = await reqPostLogin(form.uid, form.password)
      console.log(resLogin)
      if (Number(resLogin.code) === 200) {
        ElMessage({
          type: 'success',
          message: '登录成功',
        })
        const data = JSON.parse(resLogin.data)[0]
        console.log(data)
        const { name, token, auth } = data.fields
        const { pk } = data
        localStorage.setItem('name', name)
        localStorage.setItem('token', token)
        localStorage.setItem('auth', md5(auth))
        localStorage.setItem('pk', pk)
        loading.value = false

        // 管理员, 前往管理员页面
        if (Number(auth) === 1) {
          $router.push('/manage/admin/tasklist')
        }

        // 教师, 前往教师页面
        if (Number(auth) === 2) {
          $router.push('/manage/teacher/tasklist')
        }
      } else {
        loading.value = false
      }
    } else {
      clearForm()
      oLog.style.top = 0
      oSign.style.top = 70 + 'px'
      isLogin.value = true
      isDisabled.value = true
      onoff = true
    }
  }

  register = async function () {
    if (!onoff) {
      // 注册且位于注册界面
      // 1.检查注册数据
      // const resRegister = await reqPostRegister(form.uid,form.register_name,form.password)
      // console.log(resRegister)
    } else {
      clearForm()
      oSign.style.top = 0
      oLog.style.top = 70 + 'px'
      isLogin.value = false
      isDisabled.value = false
      onoff = false
    }
  }
})
</script>

<style scoped lang="css">
@import './LoginView.css';
</style>
