import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

// 导入全局样式表
import 'assets/css/global.css'

const app = createApp(App)

app.use(Antd)
    .use(router)
    .use(store)
    .mount('#app')
