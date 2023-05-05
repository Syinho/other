import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import { chkAuth } from '../utils/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由前置守卫
router.beforeEach((to, from) => {
  const auth = chkAuth(localStorage.getItem('auth'))
  const token = localStorage.getItem('token')
  const name = localStorage.getItem('name')
  // 1.如果是前往登录页面, 不设置条件放行
  if (to.path === '/login_register') {
    return true
  }
  // 2.如果权限, token, name有一样没有, 那么跳转login_register页面
  if ((!auth || !token || !name) && to.path !== '/login_register') {
    return { name: 'login_register' }
  }
  // 3.检查路由是否包含/admin/
  let reg_admin = /admin/g
  if (reg_admin.test(to.path)) {
    // 1.2 包含的话检查auth
    if (Number(auth) === 1) {
      return true
    } else {
      return { name: 'blank' }
    }
  }

  // 4.检查路由是否包含/teacher
  let reg_teacher = /teacher/g
  if (reg_teacher.test(to.path)) {
    if (Number(auth) === 2) {
      return true
    } else {
      return { name: 'blank' }
    }
  }
  return true
})

export default router
