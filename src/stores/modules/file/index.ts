import getters from './file.getters'
import state from './file.state'
import mutations from './file.mutations'
import actions from './file.actions'
import { Module } from 'vuex/types/index.js'
import { StoreState } from './types'

const fileModule: Module<StoreState, {}> = {
    namespaced: true,
    getters,
    state,
    mutations,
    actions,
}

export default fileModule
