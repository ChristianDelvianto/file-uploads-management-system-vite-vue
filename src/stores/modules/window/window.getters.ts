import { GetterTree } from 'vuex/types/index.js'
import { StoreState } from './types'

const getters: GetterTree<StoreState, {}> = {
    width: (state) => state.width,
}

export default getters
