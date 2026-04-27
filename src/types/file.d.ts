import { UploadCategory } from './upload'
import { User } from './user'

export interface ModuleState {}

export type FileViewMode = 'grid' | 'list'

export type FileVisibility = 'private' | 'public' | 'shared'

export interface FileDB {
    uuid: string,
    visibility: FileVisibility,
    category?: UploadCategory,
    extension: string,
    name: string,
    bytes_size: number,
    thumbnail_url: string | null,
    // storage_url: string,
    created_at: string,
    updated_at: string,
    deleted_at?: string,
    user?: User
}
