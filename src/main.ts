import './style.css'
import { createApp } from 'vue'
import store from './stores'
import router from './router'
import Api from './services'
import App from './App.vue'

// Set Api's base URL
Api.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

const vue = createApp(App)
vue.use(store)
vue.use(router)

router.isReady()
    .then(() => {
        vue.mount('#app')
    })
