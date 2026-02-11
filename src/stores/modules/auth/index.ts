import getters from './auth.getters'
import state from './auth.state'
import mutations from './auth.mutations'
import actions from './auth.actions'
import { Module } from 'vuex/types/index.js'
import { StoreState } from './types'

const authModule: Module<StoreState, {}> = {
    namespaced: true,
    getters,
    state,
    mutations,
    actions,
}

export default authModule
