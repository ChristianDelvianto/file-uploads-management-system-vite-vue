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
    .then((): void => {
        // Set initial width
        store.commit('window/SET_WIDTH', window.innerWidth)

        // When user resizing the window
        window.addEventListener('resize', (): void => {
            store.commit('window/SET_WIDTH', window.innerWidth)
        }, false)

        vue.mount('#app')
    })
