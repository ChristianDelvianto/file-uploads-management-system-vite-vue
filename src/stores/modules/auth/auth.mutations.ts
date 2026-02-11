import { MutationTree } from 'vuex/types/index.js'
import { LoginResponse, StoreState } from './types'

const mutations: MutationTree<StoreState> = {
    AUTHENTICATED: (state, { profile, role }: LoginResponse) => {
        state.authenticated = true
        state.profile = profile
        state.role = role
    },
    LOGOUT: (state) => {
        state.loggedOut = true
    },
    LOGGED_OUT: (state) => {
        state.authenticated = false
        state.profile = null
        state.role = 'user'
    }
}

export default mutations
