export interface ModuleState {
    items: {
        [key: string]: Upload
    }
}

export type UploadId = string

export type UploadCategory = 'audio' | 'document' | 'image' | 'other' | 'video'

export type UploadStatus = 'canceled' | 'error' | 'processing' | 'success' | 'uploading'

export interface UploadList {
    id: UploadId,
    uuid: string | null, // Will have value when we upload big files (chunkable upload)
    url: string | null, // URL to upload chunks
    status: UploadStatus, // Default 'processing'
    is_cancelable: boolean,
    is_chunkable: boolean,
    last_chunk_index: number | null,
    chunk_count: number,

    // Metadata
    category: UploadCategory,
    mime_type: string,
    bytes_size: number,
    original_name: string,
    modified_name: string,
    duration: number | null,

    file: File,
    thumbnail: File | null, // For document & video

    // AbortController
    abort_controller: AbortController
}
