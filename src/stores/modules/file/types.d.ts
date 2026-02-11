export type UploadStatus = 'preparing' | 'error' | 'canceled' | 'uploading' | 'success'

export interface UploadList {
    id: number,
    file: File,
    name: string,
    status: UploadStatus,
    progress: number,
    extension: string,
    thumbnail: File | null, // For image and video
    thumbnailSrc: string | null,
}

export interface FileDB {
    id: number,
    extension: string,
    mime_type: string,
    original_name: string,
    size: number,
    thumbnail: string | null,
    storage_path: string,
    created_at: string,
    updated_at: string,
}

export interface StoreState {
    items: Upload[],
}
