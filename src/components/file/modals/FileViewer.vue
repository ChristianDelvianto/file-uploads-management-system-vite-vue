<style scoped>
@import 'tailwindcss';

img, video {
    @apply select-none z-10;
            /* sm:max-h-[calc(100vh-7rem)]; */

    /* block-size: inherit !important; */
}

img {
    @apply object-contain;
}
</style>

<script setup lang="ts">
import FileViewerMenu from './FileViewerMenu.vue'
import FileViewerEditLayout from './FileViewerEditLayout.vue'
import FileViewerDetailLayout from './FileViewerDetailLayout.vue'
import FileViewerLogLayout from './FileViewerLogLayout.vue'
import FileViewerNavigation from './FileViewerNavigation.vue'
import { useAuth } from '@src/composables/useAuth'
import { useWindow } from '@src/composables/useWindow'
import { FileDB } from '@src/stores/modules/file/types'
import { downloadFile } from '@src/utils/file'
import { useStore } from 'vuex'
import { computed, onBeforeUnmount, provide, reactive, watch } from 'vue'
const store = useStore()
const { authenticated, profile } = useAuth()
const { windowWidth } = useWindow()

defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'update-file', value: FileDB): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    asModal?: boolean,
    file?: FileDB,
    open?: boolean,
}>>(), {
    asModal: true,
    open: false,
})

const fileLayout = reactive({
    detail: false,
    edit: false,
    log: false,
    menu: false,
})

const file = computed(() => {
    if (props.asModal) {
        return {
            ...props.file,
            user: {
                id: profile.value.id,
            }
        }
    }

    return props.file
})

provide('asModal', props.asModal)
provide('file', file)

async function download(): Promise<void> {
    if (!props.file) {
        return
    }

    try {
        const url = await store.dispatch('file/getDownloadLink', props.file.uuid)

        const fileName = props.file.name + '.' + props.file.extension

        downloadFile(url, fileName)
    } catch (err) {
        window.alert('Error while attempting to download')
    }
}
function loadError(event: Event): void {
    console.warn('Error media load')

    const error = (event.target.error as MediaError)

    console.log(error)
}
function toggleLayout(layoutName: string | null): void {
    // Reset all layout (Set all value to false)
    Object.keys(fileLayout).forEach((key: string) => {
        fileLayout[key] = false
    })

    // Then we will set the right one to true (if modalName != null)
    if (layoutName) {
        fileLayout[layoutName] = true
    }
}

watch(windowWidth, (newValue, oldValue) => {
    if (newValue >= 640 && oldValue < 640) {
        fileLayout.menu = false
    }
})
watch(() => props.open, (newValue) => {
    if (newValue) {
        document.body.style['overflowY'] = 'hidden'

        // Non-deleted file
        if (props.file && !props.file.deleted_at) {
            // Send XHR request
            store.dispatch('file/storeViewLog', props.file.uuid)
        }
    } else {
        // Reset all layout to false
        toggleLayout(null)

        document.body.style['overflowY'] = 'auto'
    }
})

onBeforeUnmount((): void => {
    if (props.asModal) {
        document.body.style['overflowY'] = 'auto'
    }
})
</script>

<template>
    <div
        v-if="!$props.asModal || $props.asModal && $props.open"
        :class="{
            'bg-black/80 fixed inset-0 z-60': $props.asModal,
            'bg-black': !$props.asModal,
        }"
        class="min-h-screen"
    >
        <div class="flex flex-grow flex-row flex-shrink h-full">
            <div class="flex flex-col flex-grow flex-shrink h-full overflow-ellipsis overflow-hidden w-full">
                <!-- Navigation -->
                <FileViewerNavigation
                    @close="$emit('close')"
                    @download="download"
                    @open-layout="toggleLayout"
                />

                <div class="flex flex-grow flex-shrink h-[calc(100vh-4rem)] items-center w-full z-10">
                    <!-- Click to close -->
                    <button
                        v-if="$props.asModal"
                        @click="$emit('close')"
                        type="button"
                        class="bg-transparent bottom-0 fixed h-[inherit] w-full z-0"
                    ></button>

                    <audio
                        v-if="file.category === 'audio'"
                        @error="loadError"
                        @contextmenu="$event => $event.preventDefault()"
                        :src="file.storage_url"
                        controls="true"
                        controlsList="nodownload"
                        preload="metadata"
                        class="px-3 w-full
                        sm:px-0
                        md:max-w-3xl md:mx-auto"
                    />
                    <img
                        v-else-if="file.category === 'image'"
                        @contextmenu="$event => $event.preventDefault()"
                        :src="file.storage_url"
                        draggable="false"
                        class="max-h-full w-full
                        md:h-[calc(100%-3rem)] md:max-h-auto md:mx-auto md:w-auto"
                    />
                    <video
                        v-else-if="file.category === 'video'"
                        @contextmenu="$event => $event.preventDefault()"
                        @error="loadError"
                        :poster="file.thumbnail_url"
                        :src="file.storage_url"
                        controls="true"
                        controlsList="nodownload nofullscreen"
                        playsinline="true"
                        preload="metadata"
                        class="max-h-full
                        md:h-[calc(100%-3rem)] md:max-h-auto md:mx-auto"
                    />
                </div>
            </div>

            <FileViewerDetailLayout
                @close="toggleLayout(null)"
                :file="file"
                :open="fileLayout.detail"
            />
            <FileViewerEditLayout
                @close="toggleLayout(null)"
                @update-file="{}"
                :file="file"
                :open="fileLayout.edit"
            />
            <FileViewerLogLayout
                @close="toggleLayout(null)"
                :open="authenticated && profile.id === file.user.id && fileLayout.log"
                :uuid="file.uuid"
            />
            <FileViewerMenu
                @close="toggleLayout(null)"
                @toggle-layout="toggleLayout"
                :open="fileLayout.menu"
            />
        </div>
    </div>
</template>
