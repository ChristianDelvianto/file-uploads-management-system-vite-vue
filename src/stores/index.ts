import { createStore } from 'vuex'
import modules from './modules'

const store = createStore({
    strict: true,
    modules,
})

export default store
