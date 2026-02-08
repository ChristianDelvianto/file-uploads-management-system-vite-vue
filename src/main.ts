import './style.css'
import store from './stores'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'

const vue = createApp(App)
vue.use(store)
vue.use(router)

router.isReady()
    .then(() => {
        vue.mount('#app')
    })
