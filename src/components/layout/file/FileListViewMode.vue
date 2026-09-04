<script setup lang="ts">
import IconMDIFormatListBulletedSquare from '@/components/svg/mdi/FormatListBulletedSquare.vue'
import IconMDIViewGrid from '@/components/svg/mdi/ViewGrid.vue'
import { FileViewMode } from '@/types/file'

defineEmits<{
    (eventName: 'update', viewMode: FileViewMode): void
}>()

withDefaults(defineProps<Readonly<{
    viewMode: FileViewMode
}>>(), {
    viewMode: 'grid'
})
</script>

<template>
    <div class="flex flex-grow-0 flex-row flex-shrink items-center">
        <!-- List -->
        <button
            @click="$emit('update', 'list')"
            :class="{
                'bg-white border-stone-600/30 z-[0] md:border-stone-600/60': $props.viewMode === 'grid',
                'bg-blue-300/60 border-blue-900/30 z-1': $props.viewMode === 'list'
            }"
            class="border duration-300 ease-in-out flex-grow-0 flex-shrink-0 -mr-[1px] px-3 py-1 relative rounded-l-full transition-colors"
        >
            <IconMDIFormatListBulletedSquare
                :color="$props.viewMode === 'list' ? '#1D4ED8' : '#000'"
            />
        </button>

        <!-- Grid -->
        <button
            @click="$emit('update', 'grid')"
            :class="{
                'bg-blue-300/60 border-blue-900/30 z-1': $props.viewMode === 'grid',
                'bg-white border-stone-600/30 z-[0] md:border-stone-600/60': $props.viewMode === 'list'
            }"
            class="border duration-300 ease-in-out flex-grow-0 flex-shrink-0 px-3 py-1 relative rounded-r-full transition-colors"
        >
            <IconMDIViewGrid
                :color="$props.viewMode === 'grid' ? '#1D4ED8' : '#000'"
            />
        </button>
    </div>
</template>