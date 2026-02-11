import { AxiosProgressEvent } from 'axios'
import Api from './index'
import store from '@src/stores'
import { FileDB, UploadList } from '@src/stores/modules/file/types'

/**
 * 
 */
export const storeNewFile = async (payload: UploadList): Promise<FileDB> => {
    const formData = {
        file: payload.file,
        thumbnail: payload.thumbnail ?? '',
    }

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent): void => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))

            store.commit('file/UPDATE_PROGRESS', { id: payload.id, progress: percentCompleted })
        }
    }

    const res = await Api.post('/files', formData, config)

    return res.data
}

/**
 * 
 */
export const deleteFile = async (id: number): Promise<void> => {
    await Api.delete(`/files/${id}`)
}
