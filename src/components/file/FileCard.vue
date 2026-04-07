<style scoped>
@import 'tailwindcss';

.thumbnail {
    @apply flex flex-grow-0 flex-shrink-0 items-center justify-center overflow-hidden relative;
}

    .thumbnail::before {
        @apply absolute bg-transparent block inset-0 z-0;

        content: '';
    }
</style>

<script setup lang="ts">
import IconMDIDotsVertical from '@src/components/svg/mdi/DotsVertical.vue'
import IconMDILockOutline from '@src/components/svg/mdi/LockOutline.vue'
import IconMDIPublic from '@src/components/svg/mdi/Public.vue'
import FileCardMenu from '@src/components/file/FileCardMenu.vue'
import { useFileCard } from '@src/composables/useFileCard'
import { FileDB, ViewMode } from '@src/stores/modules/file/types'
import { computed, onBeforeUnmount, provide, ref } from 'vue'

const emit = defineEmits<{
    (eventName: 'open-modal', modalName: string): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    file: FileDB,
    viewMode: ViewMode,
}>>(), {
    viewMode: 'grid',
})

const imageElement = ref()
const imageLoaded = ref(false)
const isMenuOpen = ref(false)

const {
    fileIcon,
    fileName,
    fileSize,
    imageURL,
    showImage,
} = useFileCard(props.file)

provide('file', props.file)
provide('viewMode', computed(() => props.viewMode)) // Has to be 'computed', otherwise, it's not reactive

function loadImage(event: Event): void {
    const image = (event.target as HTMLImageElement)

    if (image.complete) {
        imageLoaded.value = true
    }
}
function openModal(modalName: string): void {
    isMenuOpen.value = false

    emit('open-modal', modalName)
}
function removeImageSrc(): void {
    if (showImage.value) {
        imageElement.value?.removeAttribute('src')
    }
}

onBeforeUnmount((): void => {
    // Cancel image loading when component is unmounted,
    // Saves memory and prevents unnecessary work by browser
    removeImageSrc()
})
</script>

<template>
    <div
        :class="{
            'border border-stone-600/30 flex-col-reverse rounded-xl shadow-lg shadow-stone-600/30': viewMode === 'grid',
            'flex-row gap-3 items-center p-3 md:rounded-xl md:shadow-lg md:shadow-stone-600/15': viewMode === 'list',
        }"
        class="bg-white flex flex-grow-0 flex-shrink relative w-full"
    >
        <!-- Button to covering entire element, easy for user to click - to open file viewer -->
        <button
            @click="openModal('view')"
            :data-testid="`view-button-${file.uuid}`"
            type="button"
            class="absolute bg-transparent inset-0 z-1"
            title="View file"
        >
            <span class="hidden">View file</span>
        </button>

        <div
            :class="{
                'rounded-b-lg pb-[75%] w-full': viewMode === 'grid',
                'rounded-lg size-12': viewMode === 'list',
                'animate-pulse bg-gray-300': showImage && !imageLoaded,
            }"
            class="thumbnail"
        >
            <img
                v-if="showImage"
                @load="loadImage"
                ref="imageElement"
                :src="imageURL"
                alt=""
                draggable="false"
                class="absolute object-cover inset-0 select-none size-full"
            />
            <div
                v-else
                class="absolute bg-gray-300/60 flex flex-grow-0 flex-shrink-0 inset-0 items-center justify-center"
            >
                <component
                    color="#155DFC"
                    :is="fileIcon"
                    :size="viewMode === 'grid' ? 64 : 32"
                    class="absolute"
                />
            </div>

            <span
                v-if="file.visibility === 'public' && viewMode === 'grid'"
                class="absolute bg-gray-600/30 bottom-1.5 flex flex-grow-0 flex-shrink items-center justify-center right-1.5 rounded-full size-9"
            >
                <IconMDIPublic
                    color="#FFF"
                    :size="20"
                />
            </span>
        </div>

        <div
            :class="{
                'border-b border-stone-300 max-w-full': viewMode === 'grid',
                'max-w-[calc(100%-3.75rem)]': viewMode === 'list',
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
                    :class="{
                        'flex flex-grow flex-col gap-0.5 lg:flex-row lg:gap-0 lg:items-center': viewMode === 'list',
                    }"
                    class="overflow-ellipsis overflow-hidden"
                >
                    <div
                        v-text="fileName"
                        :class="{
                            'font-semibold lg:flex-grow-0 lg:flex-shrink-0 lg:max-w-3/5': viewMode === 'list',
                        }"
                        class="leading-snug overflow-ellipsis overflow-hidden whitespace-nowrap w-full"
                    ></div>

                    <div
                        v-if="viewMode === 'list'"
                        class="flex flex-grow flex-row items-center"
                    >
                        <div
                            class="flex flex-grow-0 flex-row flex-shrink gap-1.5 items-center
                            lg:w-1/2"
                        >
                            <template v-if="file.visibility === 'private'">
                                <IconMDILockOutline :size="18" />

                                Private
                            </template>
                            <template v-else-if="file.visibility === 'public'">
                                <IconMDIPublic :size="18" />

                                Public
                            </template>

                            <!-- Shared -->
                        </div>

                        <div
                            class="
                            md:w-1/2"
                        >
                            {{ fileSize }}
                        </div>
                    </div>
                </div>
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
                    focus:bg-stone-300
                    hover:bg-stone-300"
                >
                    <IconMDIDotsVertical :size="20" />
                </button>

                <FileCardMenu
                    v-if="isMenuOpen"
                    @close="isMenuOpen = false"
                    @open-modal="openModal"
                />
            </div>
        </div>
    </div>
</template>
