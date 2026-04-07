import IconMDIDocument from '@src/components/svg/mdi/Document.vue'
import IconMDIImage from '@src/components/svg/mdi/Image.vue'
import IconMDIFile from '@src/components/svg/mdi/File.vue'
import IconMDIMusic from '@src/components/svg/mdi/Music.vue'
import IconMDIVideo from '@src/components/svg/mdi/Video.vue'
import { FileDB } from '@src/stores/modules/file/types'
import { type Component, computed } from 'vue'

export const useFileCard = (item: FileDB) => {
    const fileIcon = computed<Component>(() => {
        if (item.category === 'audio') {
            return IconMDIMusic
        }

        if (item.category === 'document') {
            return IconMDIDocument
        }

        if (item.category === 'image') {
            return IconMDIImage
        }

        if (item.category === 'video') {
            return IconMDIVideo
        }

        return IconMDIFile
    })
    const fileName = computed(() => {
        if (item.name && item.extension) {
            return `${item.name}.${item.extension}`
        }
        
        return 'Null'
    })
    const fileSize = computed(() => {
        // GB
        if (item.bytes_size >= 1073_741_824) {
            return `${(item.bytes_size / 1_073_741_824).toFixed(2)} GB`
        }

        // MB
        if (item.bytes_size >= 1_048_576) {
            return `${(item.bytes_size / 1_048_576).toFixed(0)} MB`
        }

        // KB
        return `${(item.bytes_size / 1_024).toFixed(0)} KB`
    })
    const imageURL = computed(() => {
        return item.thumbnail_url ?? item.storage_url
    })
    const showImage = computed(() => {
        return (item.thumbnail_url || item.category === 'image')
    })

    return {
        fileIcon,
        fileName,
        fileSize,
        imageURL,
        showImage,
    }
}
