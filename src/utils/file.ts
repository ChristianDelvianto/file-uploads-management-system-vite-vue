import { ALLOWED_DOCUMENT_TYPES, UPLOAD_FILE_MAX_SIZE } from '@src/const/file'
import { UploadList } from '@src/stores/modules/file/types'

/**
 * 
 * @param file 
 * @returns 
 */
export async function generatePDFThumbnail(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        // 
    })
}

/**
 * 
 * @param file 
 * @returns 
 */
export async function generateVideoThumbnail(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const canvas: HTMLCanvasElement = document.createElement('canvas')
        const video: HTMLVideoElement = document.createElement('video')
        const videoSrc: string = window.URL.createObjectURL(file)

        function onLoadedMetadata(event: Event): void {
            const videoEl = (event.target as HTMLVideoElement)

            // Set canvas dimensions
            canvas.height = videoEl.videoHeight
            canvas.width = videoEl.videoWidth

            // To avoid black screen for thumbnail
            videoEl.currentTime = 1
        }

        function onSeeked(event: Event): void {
            const videoEl = (event.target as HTMLVideoElement)

            // Set dimension again, to ensure
            canvas.height = videoEl.videoHeight
            canvas.width = videoEl.videoWidth

            const canvasContext = canvas.getContext('2d')
            canvasContext!.drawImage(videoEl, 0, 0, canvas.width, canvas.height)

            canvas.toBlob((blob): void => {
                if (blob) {
                    const thumbnailFile = new File([blob], `thumbnail_${new Date().getTime()}.jpeg`, { type: 'image/jpeg' })

                    resolve(thumbnailFile)
                } else {
                    reject(new Error('Failed to create thumbnail'))
                }

                // Cleanup
                window.URL.revokeObjectURL(videoSrc)

                video.removeEventListener('loadedmetadata', onLoadedMetadata)
                video.removeEventListener('seeked', onSeeked)

                // Free up memory
                video.src = ''
            })
        }

        video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true })
        video.addEventListener('seeked', onSeeked, { once: true })

        // Set video's attibutes
        video.controls = false
        video.preload = 'metadata'        
        video.src = videoSrc
        video.volume = 0
    })
}

/**
 * 
 * @param file 
 * @returns 
 */
export function createUploadList(fileType: string, fileName: string, file: File): UploadList {
    return {
        id: new Date().getTime(), 
        type: fileType,
        file,
        name: fileName,
        status: 'processing',
        progress: 0,
        thumbnail: null,
    }
}

/**
 * 
 * @param file 
 * @returns 
 */
export function getFileType(file: File): string | null {
    const type = file.type

    if (type.startsWith('image/')) {
        return 'image'
    }

    if (type.startsWith('audio/')) {
        return 'audio'
    }
    
    if (type.startsWith('video/')) {
        return 'video'
    }

    if (ALLOWED_DOCUMENT_TYPES.includes(type)) {
        return 'document'
    }

    return null
}

/**
 * 
 * @param file 
 * @returns 
 */
export function validateFile(file: File): boolean {
    const type = file.type
    const size = file.size

    if (!type) {
        console.warn('File type is not defined')
        return false
    } else if (size > UPLOAD_FILE_MAX_SIZE) {
        console.warn('File size exceeds the maximum limit:', size, 'KB')
        return false
    } else if (type.startsWith('application/') && !ALLOWED_DOCUMENT_TYPES.includes(type)) {
        console.warn('File type is not allowed:', type)
        return false
    }

    return true
}
