import { DOCX_TYPE, PDF_TYPE, WORD_TYPE } from '@/const/file'
import { UPLOAD_CHUNK_SIZE } from '@/const/upload'
import {
    cancelUpload,
    completeUpload,
    storeChunkable,
    storeDirectly,
    uploadChunk
} from '@/services/upload.service'
import { ModuleState, UploadId, UploadList } from '@/types/upload'
import {
    generateDocxThumbnail,
    generatePdfThumbnail,
    generateVideoThumbnail,
    getAudioDuration,
    getVideoDuration
} from '@/utils/file'
import { ActionContext } from 'vuex/types/index.js'
import { isCancel } from 'axios'

/**
 * Cancel the upload.
 */
async function cancel(context: ActionContext<ModuleState, {}>, uploadId: UploadId): Promise<void> {
    try {
        const upload: UploadList = context.getters['items'][uploadId]

        if (!upload || upload.status === 'canceled') {
            return
        }

        upload.abort_controller.abort()

        // Send request to backend, to mark the upload is canceled,
        // so that the backend will not accept any more actions.
        if (upload.uuid) {
            cancelUpload(upload.uuid)
        }

        context.commit('SET_ITEM_STATUS', { id: uploadId, value: 'canceled' })
    } catch (err: unknown) {
        console.error('Error occured when attempting to cancel:')
        console.error(err)
    }
}

/**
 * Remove an upload list.
 */
export function remove(context: ActionContext<ModuleState, {}>, uploadId: UploadId): void {
    context.commit('REMOVE_ITEM', uploadId)
}

/**
 * Remove all upload lists.
 */
async function removeAll(context: ActionContext<ModuleState, {}>): Promise<void> {
    return new Promise((resolve) => {
        context.commit('REMOVE_ALL_ITEMS')

        resolve()
    })
}

/**
 * Retry the upload.
 */
async function retry(context: ActionContext<ModuleState, {}>, uploadId: UploadId): Promise<void> {
    try {
        const upload: UploadList = context.getters['items'][uploadId]

        // Do not allow retry if upload is not found or already canceled
        if (!upload || upload.status === 'canceled') {
            return
        }

        context.commit('SET_ITEM_STATUS', { id: uploadId, value: 'processing' })

        /**
         * The reasaon we are not using else if,
         * in case if the upload are missing required thumbnail or duration,
         * we will generate it again before uploading.
         */
        if (upload.category === 'audio' && upload.duration === null) {
            const audioDuration = await getAudioDuration(upload.file)

            context.commit('SET_ITEM_DURATION', { id: upload.id, value: audioDuration })
        }

        if (upload.category === 'document' && upload.mime_type === DOCX_TYPE && upload.thumbnail === null) {
            const docxThumbnail = await generateDocxThumbnail(upload.file)

            context.commit('SET_ITEM_THUMBNAIL', { id: uploadId, value: docxThumbnail })
        }

        if (upload.category === 'document' && upload.mime_type === PDF_TYPE && upload.thumbnail === null) {
            const pdfThumbnail = await generatePdfThumbnail(upload.file)

            context.commit('SET_ITEM_THUMBNAIL', { id: uploadId, value: pdfThumbnail })
        }

        if (upload.category === 'video' && upload.duration === null) {
            const videoDuration = await getVideoDuration(upload.file)

            context.commit('SET_ITEM_DURATION', { id: uploadId, value: videoDuration })
        }

        if (upload.category === 'video' && upload.thumbnail === null) {
            const videoThumbnail = await generateVideoThumbnail(upload.file)

            context.commit('SET_ITEM_THUMBNAIL', { id: uploadId, value: videoThumbnail })
        }

        let usedBytes: number = 0

        if (upload.is_chunkable) {
            let uuid: string | null = null

            context.commit('SET_ITEM_STATUS', { id: uploadId, value: 'uploading' })

            if (upload.uuid === null) {
                const start = 0
                const end = start + UPLOAD_CHUNK_SIZE

                const firstChunk = upload.file.slice(start, end)

                // Get upload link and uuid for chunkable upload
                const { url, uuid: responseUuid } = await storeChunkable(upload, firstChunk, upload.abort_controller.signal)

                context.commit('SET_ITEM_LAST_CHUNK_INDEX', { id: upload.id, value: 0 })
                context.commit('SET_ITEM_UUID', { id: upload.id, value: responseUuid })
                // context.commit('SET_UPLOAD_URL', { id: upload.id, value: url })

                uuid = responseUuid
            } else {
                uuid = upload.uuid
            }

            // Upload chunks
            if ((upload.last_chunk_index + 1) < upload.chunk_count) {
                await uploadFileChunks(context, uuid, upload)
            }

            // Mark as complete
            const { used_bytes } = await completeUpload(uuid)

            usedBytes = used_bytes
        } else { // Small file
            const { used_bytes } = await storeDirectly(upload, upload.abort_controller.signal)

            usedBytes = used_bytes
        }

        context.commit('SET_ITEM_STATUS', { id: uploadId, value: 'success' })

        // Update user's used_bytes
        context.commit('auth/SET_USED_BYTES', usedBytes, { root: true })
    } catch (err: unknown) {
        console.error('Error occured:')
        console.error(err)

        if (isCancel(err)) {
            context.commit('SET_ITEM_STATUS', { id: uploadId, value: 'canceled' })
        } else {
            context.commit('SET_ITEM_STATUS', { id: uploadId, value: 'error' })
        }
    }
}

/**
 * Process upload and send request to backend.
 */
async function store(context: ActionContext<ModuleState, {}>, upload: UploadList): Promise<void> {
    try {
        context.commit('NEW_ITEM', upload)

        if (upload.category === 'audio') {
            const audioDuration = await getAudioDuration(upload.file)

            context.commit('SET_ITEM_DURATION', { id: upload.id, value: audioDuration })
        }

        if (upload.category === 'document' && upload.mime_type === DOCX_TYPE) {
            const docxThumbnail = await generateDocxThumbnail(upload.file)

            context.commit('SET_ITEM_THUMBNAIL', { id: upload.id, value: docxThumbnail })
        }

        if (upload.category === 'document' && upload.mime_type === PDF_TYPE) {
            const pdfThumbnail = await generatePdfThumbnail(upload.file)

            context.commit('SET_ITEM_THUMBNAIL', { id: upload.id, value: pdfThumbnail })
        }
        
        if (upload.category === 'video') {
            const videoDuration = await getVideoDuration(upload.file)
            context.commit('SET_ITEM_DURATION', { id: upload.id, value: videoDuration })

            const videoThumbnail = await generateVideoThumbnail(upload.file)
            context.commit('SET_ITEM_THUMBNAIL', { id: upload.id, value: videoThumbnail })
        }

        let usedBytes: number = 0

        if (upload.is_chunkable) {
            const start = 0
            const end = start + UPLOAD_CHUNK_SIZE

            const firstChunk = upload.file.slice(start, end)

            const { url, uuid } = await storeChunkable(upload, firstChunk, upload.abort_controller.signal)

            context.commit('SET_ITEM_LAST_CHUNK_INDEX', { id: upload.id, value: 0 })
            context.commit('SET_ITEM_UUID', { id: upload.id, value: uuid })
            context.commit('SET_ITEM_STATUS', { id: upload.id, value: 'uploading' })
            // context.commit('SET_UPLOAD_URL', { id: upload.id, value: url })

            // See function uploadFileChunks() below for more details
            await uploadFileChunks(context, uuid, upload)

            // Mark as complete
            const { used_bytes } = await completeUpload(uuid)

            usedBytes = used_bytes
        } else {
            context.commit('SET_ITEM_STATUS', { id: upload.id, value: 'uploading' })

            const { used_bytes } = await storeDirectly(upload, upload.abort_controller.signal)

            usedBytes = used_bytes
        }

        context.commit('SET_ITEM_STATUS', { id: upload.id, value: 'success' })

        // Update user's used_bytes
        context.commit('auth/SET_USED_BYTES', usedBytes, { root: true })
    } catch (err: unknown) {
        console.error('Error occured:')
        console.error(err)

        if (isCancel(err)) {
            context.commit('SET_ITEM_STATUS', { id: upload.id, value: 'canceled' })
        } else {
            context.commit('SET_ITEM_STATUS', { id: upload.id, value: 'error' })
        }
    }
}

/**
 * Upload file chunks using while loop.
 */
async function uploadFileChunks(context: ActionContext<ModuleState, {}>, uuid: string, upload: UploadList): Promise<void> {
    let index = upload.last_chunk_index
                ? upload.last_chunk_index + 1
                : 1

    while (index < upload.chunk_count) {
        const start = index * UPLOAD_CHUNK_SIZE
        const end = start + UPLOAD_CHUNK_SIZE
        const chunk = upload.file.slice(start, end)

        await uploadChunk(uuid, index, chunk, upload.abort_controller.signal)

        // Update last_chunk_index, to reflect upload progess
        context.commit('SET_ITEM_LAST_CHUNK_INDEX', { id: upload.id, value: index })

        index++
    }
}

export default {
    cancel,
    remove,
    removeAll,
    retry,
    store
}
