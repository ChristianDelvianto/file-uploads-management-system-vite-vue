<script setup lang="ts">
import IconMDIFormatListBulletedSquare from '@src/components/svg/mdi/FormatListBulletedSquare.vue'
import IconMDIViewGridOutline from '@src/components/svg/mdi/ViewGridOutline.vue'
import { ViewMode as FileViewMode } from '@src/stores/modules/file/types'

defineEmits<{
    (eventName: 'update', viewMode: FileViewMode): void
}>()

withDefaults(defineProps<{
    viewMode: FileViewMode,
}>(), {
    viewMode: 'grid',
})
</script>

<template>
    <div class="flex flex-grow-0 flex-row flex-shrink items-center">
        <!-- List -->
        <button
            @click="$emit('update', 'list')"
            :class="{
                'bg-white border-stone-300 z-[0]': viewMode === 'grid',
                'bg-blue-300/60 border-blue-600/60 z-[1]': viewMode === 'list',
            }"
            class="border flex-grow-0 flex-shrink-0 -mr-[1px] px-3 py-1 relative rounded-l-full"
        >
            <IconMDIFormatListBulletedSquare
                :color="viewMode === 'list' ? '#1D4ED8' : undefined"
            />
        </button>

        <!-- Grid -->
        <button
            @click="$emit('update', 'grid')"
            :class="{
                'bg-blue-300/60 border-blue-600/60 z-[1]': viewMode === 'grid',
                'bg-white border-stone-300 z-[0]': viewMode === 'list',
            }"
            class="border flex-grow-0 flex-shrink-0 px-3 py-1 relative rounded-r-full"
        >
            <IconMDIViewGridOutline
                :color="viewMode === 'grid' ? '#1D4ED8' : undefined"
            />
        </button>
    </div>
</template>