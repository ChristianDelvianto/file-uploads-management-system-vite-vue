import './style.css'
import { createApp } from 'vue'
import store from './stores'
import router from './router'
import Api from './services'
import App from './App.vue'

declare global {
    const APP_NAME: string;
    const APP_VERSION: string
}

// Set API default base URL
Api.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
Api.defaults.timeout = 60_000

const vue = createApp(App)
vue.use(store)
vue.use(router)

vue.config.globalProperties.$APP_NAME = APP_NAME
vue.config.globalProperties.$APP_VERSION = APP_VERSION

router.isReady()
.then((): void => {
    // Set initial width
    store.commit('window/SET_WIDTH', window.innerWidth)

    // When user resizing the window, store window's inner width
    window.addEventListener('resize', (): void => {
        store.commit('window/SET_WIDTH', window.innerWidth)
    })

    vue.mount('#app')
})
