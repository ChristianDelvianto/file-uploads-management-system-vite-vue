import getters from './window.getters'
import state from './window.state'
import mutations from './window.mutations'
import actions from './window.actions'
import { Module } from 'vuex/types/index.js'
import { StoreState } from './types'

const windowModule: Module<StoreState, {}> = {
    namespaced: true,
    getters,
    state,
    mutations,
    actions,
}

export default windowModule
