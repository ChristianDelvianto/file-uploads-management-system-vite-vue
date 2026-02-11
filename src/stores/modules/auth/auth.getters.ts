import { GetterTree } from 'vuex/types/index.js'
import { StoreState } from './types'

const getters: GetterTree<StoreState, {}> = {
    authenticated: (state) => state.authenticated,
    loggedOut: (state) => state.loggedOut,
    profile: (state) => state.profile,
    role: (state) => state.role,
}

export default getters
