import { MutationTree } from 'vuex/types/index.js'
import { StoreState } from './types'

const mutations: MutationTree<StoreState> = {
    SET_WIDTH: (state, payload: number) => {
        state.width = payload
    }
}

export default mutations
