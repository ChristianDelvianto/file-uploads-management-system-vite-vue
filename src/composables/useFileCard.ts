import IconMDIDocument from '@/components/svg/mdi/Document.vue'
import IconMDIImage from '@/components/svg/mdi/Image.vue'
import IconMDIFile from '@/components/svg/mdi/File.vue'
import IconMDIMusic from '@/components/svg/mdi/Music.vue'
import IconMDIVideo from '@/components/svg/mdi/Video.vue'
import { FileDB, Shared } from '@/types/file'
import { User } from '@/types/user'
import { formatBytesSize } from '@/utils/string'
import { type Component, computed, Ref } from 'vue'

export const useFileCard = (item: Ref<FileDB | null>) => {
    const fileIcon = computed<Component>(() => {
        if (!item.value) return IconMDIFile
        
        switch (item.value.category) {
            case 'audio':
                return IconMDIMusic
            case 'document':
                return IconMDIDocument
            case 'image':
                return IconMDIImage
            case 'video':
                return IconMDIVideo
            default:
                return IconMDIFile
        }
    })
    const fileName = computed<string>(() => {
        if (!item.value || !item.value.name || !item.value.extension) return 'null'

        return `${item.value.name}.${item.value.extension}`
    })
    const fileSize = computed<string>(() => {
        if (!item.value) return '0 B'
        
        return formatBytesSize(item.value.bytes_size, 2)
    })
    const imageURL = computed<string | null>(() => {
        if (!item.value) return null

        return item.value.thumbnail_url || item.value.storage_url
    })
    const owner  = computed<User | null>(() => {
        if (!item.value || !item.value.user) return null

        return item.value.user
    })
    const shared = computed<Shared[]>(() => {
        if (!item.value || item.value.visibility === 'private' || item.value.visibility === 'public') return []

        return item.value.shared || []
    })
    const showImage = computed<boolean>(() => {
        return !!item.value?.thumbnail_url || !!item.value?.storage_url
    })

    return {
        fileIcon,
        fileName,
        fileSize,
        imageURL,
        owner,
        shared,
        showImage
    }
}
