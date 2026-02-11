import { ActionTree } from 'vuex/types/index.js'
import { createAccount, getAccountInfo, issueNewToken, revokeCurrentToken } from '@src/services/auth.service'
import {
    CheckAuthResponse,
    LoginRequest,
    LoginResponse,
    SignupRequest,
    SignupResponse,
    StoreState,
} from './types'

const actions: ActionTree<StoreState, {}> = {
    check: async ({ commit }): Promise<CheckAuthResponse> => {
        const data = await getAccountInfo()

        commit('AUTHENTICATED', { profile: data.profile, role: data.role })

        return data
    },
    login: async ({ commit }, payload: LoginRequest): Promise<LoginResponse> => {
        const data = await issueNewToken(payload)

        commit('AUTHENTICATED', { profile: data.profile, role: data.role })

        localStorage.setItem('token', data.token)

        return data
    },
    logout: async ({ commit }): Promise<void> => {
        await revokeCurrentToken()

        localStorage.removeItem('token')

        commit('LOG_OUT')
    },
    loggedOut: ({ commit }): void => {
        commit('LOGGED_OUT')
    },
    signup: async ({ commit }, payload: SignupRequest): Promise<SignupResponse> => {
        const data = await createAccount(payload)

        commit('AUTHENTICATED', { profile: data.profile, role: data.role })

        localStorage.setItem('token', data.token)

        return data
    },
}

export default actions
