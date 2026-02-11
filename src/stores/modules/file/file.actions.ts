import { ActionTree } from 'vuex/types/index.js'
import { storeNewFile } from '@src/services/file.service'
import { StoreState, UploadList } from './types'

const actions: ActionTree<StoreState, {}> = {
    store: async ({ commit }, payload: UploadList): Promise<void> => {
        try {
            await storeNewFile(payload)

            commit('UPDATE_STATUS', { id: payload.id, status: 'success' })
        } catch (err) {
            console.error('Error occured when storing uploading new file:')
            console.error(err)
            
            commit('UPDATE_STATUS', { id: payload.id, status: 'error' })

            commit('UPDATE_PROGRESS', { id: payload.id, progress: 0 })
        }
    },
}

export default actions
