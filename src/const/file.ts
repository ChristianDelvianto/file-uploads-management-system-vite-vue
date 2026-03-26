// In bytes
export const UPLOAD_FILE_MAX_SIZE: number = import.meta.env.VITE_UPLOAD_FILE_MAX_SIZE ?? (50 * 1024 * 1024) // 50Mb

export const ALLOWED_DOCUMENT_TYPES: string[] = [
    'application/msword',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
];
