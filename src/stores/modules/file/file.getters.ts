import { GetterTree } from 'vuex/types/index.js'
import { StoreState } from './types'

const getters: GetterTree<StoreState, {}> = {
    items: (state) => (state.items),
}

export default getters
