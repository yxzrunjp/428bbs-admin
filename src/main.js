import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VueCookies from 'vue-cookies'
import Message from '@/utils/Message.js'
import { Confirm } from '@/utils/Confirm.js'

// 自定义组件
import Table from '@/components/Table.vue'
import Avatar from '@/components/Avatar.vue'
import Cover from '@/components/Cover.vue'
import Dialog from '@/components/Dialog.vue'

import '@/assets/scss/reset.scss'
import '@/assets/icon/iconfont.css'

const app = createApp(App)

const store = createPinia()
const piniaPlugin = (context) => {
    console.log(`初始化Store`, context.store);
}
store.use(piniaPlugin)
app.use(store)
app.use(router)

app.component('Table', Table)
app.component('Avatar', Avatar)
app.component('Cover', Cover)
app.component('Dialog', Dialog)

app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.Message = Message
app.config.globalProperties.Confirm = Confirm

app.mount('#app')
