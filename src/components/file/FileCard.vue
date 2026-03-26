<style scoped>
@import 'tailwindcss';

.thumbnail {
    @apply bg-gray-300 flex flex-grow-0 flex-shrink-0 items-center justify-center overflow-hidden relative;
}

    .thumbnail::before {
        @apply absolute bg-transparent block inset-0 z-0;

        content: '';
    }
</style>

<script setup lang="ts">
import IconMDIDotsVertical from '@src/components/svg/mdi/DotsVertical.vue'
import IconMDIImage from '@src/components/svg/mdi/Image.vue'
import IconMDIMusic from '@src/components/svg/mdi/Music.vue'
import IconMDIPlayCircle from '@src/components/svg/mdi/PlayCircle.vue'
import IconMDIVideo from '@src/components/svg/mdi/Video.vue'
import FileCardMenu from '@src/components/file/FileCardMenu.vue'
import { FileDB, ViewMode } from '@src/stores/modules/file/types'
import { computed, provide, ref } from 'vue'

defineEmits<{
    (eventName: 'open:delete-modal'): void,
    (eventName: 'open:edit-modal'): void,
    (eventName: 'open:view-modal'): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    file: FileDB,
    viewMode: ViewMode,
}>>(), {
    viewMode: 'grid',
})

const imageLoaded = ref(false)
const isMenuOpen = ref(false)

const fileIcon = computed(() => {
    if (props.file.category === 'audio') {
        return IconMDIMusic
    }

    if (props.file.category === 'image') {
        return IconMDIImage
    }

    if (props.file.category === 'video') {
        return IconMDIVideo
    }

    return IconMDIImage
})
const imageURL = computed(() => {
    return props.file.thumbnail_url ?? props.file.storage_url
})
const showImage = computed(() => {
    return (props.file.thumbnail_url || props.file.category === 'image')
})

provide('file', props.file)
provide('viewMode', computed(() => props.viewMode)) // Has to be 'computed', otherwise, it's not reactive

function loadImage(event: Event): void {
    const image = (event.target as HTMLImageElement)

    if (image.complete) {
        imageLoaded.value = true
    }
}
</script>

<template>
    <div
        :data-testid="file.uuid"
        :class="{
            'border border-stone-300/90 flex-col-reverse rounded-lg shadow shadow-stone-300/90': viewMode === 'grid',
            'flex-row gap-3 items-center p-3 md:rounded-xl md:shadow md:shadow-stone-300/90': viewMode === 'list',
        }"
        class="bg-white flex flex-grow-0 flex-shrink relative w-full"
    >
        <!-- Button to covering entire element, easy for user to click - to open file viewer -->
        <button
            @click="$emit('open:view-modal')"
            :data-testid="`view-button-${file.uuid}`"
            type="button"
            class="absolute bg-transparent inset-0 z-1"
            title="View this file"
        >
            <span class="hidden">View this file</span>
        </button>

        <div
            :class="{
                'rounded-b-lg pb-[75%] w-full': viewMode === 'grid',
                'rounded-lg size-16': viewMode === 'list',
                'animate-pulse': showImage && !imageLoaded,
            }"
            class="thumbnail"
        >
            <img
                v-if="showImage"
                @load="loadImage"
                :src="imageURL"
                alt=""
                draggable="false"
                class="absolute object-cover inset-0 select-none size-full"
            />
            <div
                v-else
                class="absolute flex flex-grow-0 flex-shrink-0 inset-0 items-center justify-center"
            >
                <component
                    color="#155DFC"
                    :is="fileIcon"
                    :size="viewMode === 'grid' ? 64 : 32"
                    class="absolute"
                />
            </div>

            <span
                v-if="file.category === 'video'"
                :class="{
                    'bottom-1.5 right-1.5': viewMode === 'grid',
                    'bottom-[calc(50%-15.75px)] left-[calc(50%-15.75px)]': viewMode === 'list',
                }"
                class="absolute bg-gray-600/30 flex flex-grow-0 flex-shrink items-center justify-center rounded-full size-9"
            >
                <IconMDIPlayCircle
                    color="#FFF"
                    :size="20"
                />
            </span>
        </div>

        <div
            :class="{
                'max-w-full': viewMode === 'grid',
                'max-w-[calc(100%-4.75rem)]': viewMode === 'list',
            }"
            class="flex flex-grow flex-shrink items-center overflow-ellipsis w-full"
        >
            <div
                :class="{
                    'gap-1.5 items-center pl-3 py-2': viewMode === 'grid',
                }"
                class="flex flex-grow flex-shrink overflow-ellipsis overflow-hidden w-full"
            >
                <component
                    v-if="viewMode === 'grid'"
                    :is="fileIcon"
                    color="#155DFC"
                    class="flex-grow-0 flex-shrink-0"
                />

                <div
                    v-text="file.name"
                    class="leading-snug overflow-ellipsis overflow-hidden whitespace-nowrap w-full"
                ></div>
            </div>

            <div
                :class="{
                    'pr-1.5': viewMode === 'grid',
                }"
                class="flex-grow-0 flex-shrink-0 relative"
            >
                <button
                    @click="isMenuOpen = !isMenuOpen"
                    type="button"
                    class="flex flex-grow-0 flex-shrink-0 items-center justify-center relative rounded-full size-9 z-1
                    focus:bg-stone-300/90
                    hover:bg-stone-300/90"
                >
                    <IconMDIDotsVertical :size="20" />
                </button>

                <FileCardMenu
                    v-if="isMenuOpen"
                    @close="isMenuOpen = false"
                    @open:delete-modal="$emit('open:delete-modal')"
                    @open:edit-modal="$emit('open:edit-modal')"
                />
            </div>
        </div>
    </div>
</template>
