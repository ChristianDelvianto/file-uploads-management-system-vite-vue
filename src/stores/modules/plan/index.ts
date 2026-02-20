import getters from './plan.getters'
import state from './plan.state'
import mutations from './plan.mutations'
import actions from './plan.actions'
import { Module } from 'vuex/types/index.js'
import { StoreState } from './types'

const planModule: Module<StoreState, {}> = {
    namespaced: true,
    getters,
    state,
    mutations,
    actions,
}

export default planModule
