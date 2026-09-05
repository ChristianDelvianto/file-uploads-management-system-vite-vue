import { UploadList } from '@/types/upload'
import Api from './index'

/**
 * Cancel an upload.
 */
export async function cancelUpload(uuid: string): Promise<void> {
    await Api.patch(`/uploads/${uuid}/cancel`)
}

/**
 * Complete an upload.
 */
export async function completeUpload(uuid: string): Promise<{ used_bytes: number }> {
    const { data } = await Api.patch(`/uploads/${uuid}/complete`)

    return data
}

/**
 * Create new upload and get link to upload chunks.
 */
export async function storeChunkable(payload: UploadList, abortSignal: AbortSignal): Promise<{ uuid: string, url: string }> {
    const formData = new FormData()
    formData.append('bytes_size', payload.bytes_size.toString())
    formData.append('duration', (payload.duration || '').toString())
    formData.append('chunk_count', payload.chunk_count.toString())
    formData.append('thumbnail', payload.thumbnail || '')

    const { data } = await Api.post('/uploads/chunkable', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        signal: abortSignal
                    })

    return data
}

/**
 * Create new upload and send small file.
 */
export async function storeDirectly(payload: UploadList, abortSignal: AbortSignal): Promise<{ used_bytes: number }> {
    const formData = new FormData()
    formData.append('duration', (payload.duration || '').toString())
    formData.append('thumbnail', payload.thumbnail || '')
    formData.append('file', payload.file)

    const { data } = await Api.post('/uploads/direct', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        signal: abortSignal
                    })

    return data
}

/**
 * Upload file chunks.
 */
export async function uploadChunk(uuid: string, index: number, chunk: Blob, abortSignal: AbortSignal): Promise<void> {
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('index', index.toString())

    await Api.post(`/uploads/${uuid}/chunks`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        signal: abortSignal
    })
}
