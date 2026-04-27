export interface ModuleState {
    items: {}
}

// 'upload_' + new Date().getTime()
export type UploadId = string

export type UploadCategory = 'image' | 'video' | 'audio' | 'document' | 'other'

export type UploadStatus = 'canceled' | 'error' | 'processing' | 'success' | 'uploading'

export interface Upload {
    id: UploadId,
    uuid: string | null,
    status: UploadStatus, // Default 'processing'
    last_chunk_index: number | null,
    chunk_count: number,

    // Metadata
    category: UploadCategory,
    extension: string,
    mime_type: string,
    bytes_size: number,
    original_name: string,
    modified_name: string,
    duration: number | null,

    // Real file
    file: File,
    thumbnail: File | null, // For document & video

    // AbortController
    abort_controller: AbortController | null
}
