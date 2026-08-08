<style scoped>
@import 'tailwindcss';

.thumbnail {
    @apply overflow-hidden relative;
}

    .thumbnail::before {
        @apply absolute bg-transparent block inset-0 z-0;

        content: '';
    }
</style>

<script setup lang="ts">
import IconMDIImage from '@/components/svg/mdi/Image.vue'
import IconMDIImageBrokenVariant from '@/components/svg/mdi/ImageBrokenVariant.vue'
import IconMDILoading from '@/components/svg/mdi/Loading.vue'
import IconMDIPublic from '@/components/svg/mdi/Public.vue'
import IconMDIUserMultiple from '@/components/svg/mdi/UserMultiple.vue'
import { FileDB, FileViewMode } from '@/types/file'
import { type Component, inject, ref, type ToRef } from 'vue'

const props = withDefaults(defineProps<Readonly<{
    fileIcon: Component,
    fileName: string,
    imageURL: string | null,
    showImage: boolean,
    viewMode: FileViewMode
}>>(), {
    imageURL: null,
    showImage: false
})

const file = inject<Readonly<ToRef<FileDB | null>>>('file', ref(null))

const imageError = ref(false)
const imageLoaded = ref(false)
const imageLoading = ref(true)

function loadError(event: Event): void {
    imageError.value = true
    imageLoading.value = false
}
function loadImage(event: Event): void {
    const image = (event.target as HTMLImageElement)

    imageError.value = !image.complete
    imageLoaded.value = image.complete
    imageLoading.value = false
}
</script>

<template>
    <div
        :class="{
            'mb-3 mx-auto pb-[calc(70%-0.75rem)] rounded-b-xl w-[calc(100%-1.5rem)]': $props.viewMode === 'grid',
            'rounded-md size-12': $props.viewMode === 'list',
            'animate-pulse': imageLoading && $props.showImage
        }"
        class="thumbnail"
    >
        <!-- Render Image Track -->
        <div v-if="imageURL && $props.showImage">
            <img
                @contextmenu.prevent
                @error="loadError"
                @load="loadImage"
                ref="imageElement"
                :alt="fileName"
                :src="imageURL"
                draggable="false"
                :class="{
                    'opacity-100': !imageError && imageLoaded,
                    'opacity-0 z-0': !imageLoaded
                }"
                class="absolute object-cover inset-0 rounded-lg select-none size-full"
            />

            <div
                v-if="file?.status === 'completed' && !imageLoaded"
                class="absolute bg-white flex items-center justify-center rounded-lg size-full"
            >
                <IconMDIImage
                    v-if="imageLoading"
                    :size="viewMode === 'grid' ? 72 : 24"
                />
                <IconMDIImageBrokenVariant
                    v-else-if="imageError"
                    :size="viewMode === 'grid' ? 72 : 24"
                />
            </div>
        </div>

        <!-- Render Fallback File Icons -->
        <div
            v-else
            class="absolute bg-white flex flex-grow-0 flex-shrink-0 inset-0 items-center justify-center rounded-xl"
        >
            <component
                color="#155DFC"
                :is="fileIcon"
                :size="$props.viewMode === 'grid' ? 72 : 24"
            />
        </div>

        <!-- Progress Overlay Track -->
        <div
            v-if="file?.status !== 'completed'"
            class="absolute bg-black/30 flex flex-col gap-3 inset-0 items-center justify-center rounded-t-lg z-0"
        >
            <template v-if="file?.status === 'failed'">
                <!-- @todo -->
            </template>
            <template v-else-if="file?.status === 'processing'">
                <IconMDILoading
                    color="#FFF"
                    :size="$props.viewMode === 'grid' ? 48 : 24"
                />

                <span
                    v-if="file?.status === 'processing' && $props.viewMode === 'grid'"
                    class="text-white"
                >Processing</span>
            </template>
        </div>

        <!-- Privacy Status Indicator Badges -->
        <span
            v-if="file?.visibility !== 'private' && $props.viewMode === 'grid'"
            class="absolute bg-gray-600/40 bottom-1.5 flex flex-grow-0 flex-shrink items-center justify-center right-1.5 rounded-full size-9"
        >
            <IconMDIPublic
                v-if="file?.visibility === 'public'"
                color="#FFF"
                :size="20"
            />
            <IconMDIUserMultiple
                v-else-if="file?.visibility === 'shared'"
                color="#FFF"
                :size="20"
            />
        </span>
    </div>
</template>
