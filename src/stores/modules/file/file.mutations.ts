import { MutationTree } from 'vuex/types/index.js'
import { StoreState, UploadList, UploadStatus } from './types'

const mutations: MutationTree<StoreState> = {
    UPDATE_STATUS: (state, payload: { id: number, status: UploadStatus }) => {
        const upload = state.items.find((item: UploadList) => item.id === payload.id)

        if (upload) {
            upload.status = payload.status

            // Reset progress
            if (payload.status === 'error' || payload.status === 'canceled') {
                upload.progress = 0
            }
        }
    },
    UPDATE_PROGRESS: (state, payload: { id: number, progress: number }) => {
        const upload = state.items.find((item: UploadList) => item.id === payload.id)

        if (upload) {
            upload.progress = payload.progress
        }
    }
}

export default mutations
