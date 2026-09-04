import IconMDICheckCircle from '@/components/svg/mdi/CheckCircle.vue'
import IconMDIClose from '@/components/svg/mdi/Close.vue'
import IconMDIDocument from '@/components/svg/mdi/Document.vue'
import IconMDIError from '@/components/svg/mdi/Error.vue'
import IconMDIFile from '@/components/svg/mdi/File.vue'
import IconMDIImage from '@/components/svg/mdi/Image.vue'
import IconMDILoading from '@/components/svg/mdi/Loading.vue'
import IconMDIMusic from '@/components/svg/mdi/Music.vue'
import IconMDIVideo from '@/components/svg/mdi/Video.vue'
import { UploadList } from '@/types/upload'
import { formatBytesSize } from '@/utils/string'
import { useStore } from 'vuex'
import { type Component, computed } from 'vue'

export const useUploadList = (item: UploadList) => {
    const store = useStore()

    const fileIcon = computed<Component>(() => {
        if (item.category === 'audio') return IconMDIMusic

        if (item.category === 'document') return IconMDIDocument

        if (item.category === 'image') return IconMDIImage

        if (item.category === 'video') return IconMDIVideo

        return IconMDIFile // 'other'
    })
    const fileSize = computed<string>(() => {
        if (!item.bytes_size) return '0 B'
        
        return formatBytesSize(item.bytes_size, 2)
    })
    const progressPercentage = computed<number>(() => {
        if (item.last_chunk_index === null) return 0
    
        const lastChunkIndex = item.last_chunk_index + 1 // Index start from 0
    
        return (lastChunkIndex / item.chunk_count * 100)
    })
    const statusIcon = computed<Component | null>(() => {
        if (item.status === 'canceled') return IconMDIClose

        if (item.status === 'error') return IconMDIError

        if (item.status === 'processing') return IconMDILoading

        if (item.status === 'success') return IconMDICheckCircle

        return null // 'uploading'
    })
    const statusIconColor = computed<string>(() => {
        if (item.status === 'error') return '#E7000B' // text-red-600

        if (item.status === 'success') return '#00A63E' // text-green-600

        return '#4A5565' // text-gray-600
    })

    function cancel(): void {
        store.dispatch('upload/cancel', item.id)
    }
    function retry(): void {
        store.dispatch('upload/retry', item.id)
    }

    return {
        fileIcon,
        fileSize,
        progressPercentage,
        statusIcon,
        statusIconColor,

        cancel,
        retry
    }
}