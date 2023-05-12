import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入reset
import '@/assets/scss/reset.scss'
// 引入iconfont
import '@/assets/scss/iconfont.css'

// import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(router)

app.mount('#app')

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }
