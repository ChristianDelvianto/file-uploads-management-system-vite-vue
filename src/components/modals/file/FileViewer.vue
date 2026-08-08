<style scoped>
@import 'tailwindcss';

img, video {
    @apply select-none z-10;
}

img {
    @apply object-contain;
}
</style>

<script setup lang="ts">
import PageError from '@/components/page/PageError.vue'
import PageLoading from '@/components/page/PageLoading.vue'
import IconMDILoading from '@/components/svg/mdi/Loading.vue'
import FileViewerMenu from './FileViewerMenu.vue'
import FileViewerEditLayout from './FileViewerEditLayout.vue'
import FileViewerDetailLayout from './FileViewerDetailLayout.vue'
import FileViewerNavigation from './FileViewerNavigation.vue'
import { usePage } from '@/composables/usePage'
import { useWindow } from '@/composables/useWindow'
import { getStreamURL, requestDownloadLink } from '@/services/file.service'
import { FileDB, FileStatus } from '@/types/file'
import { downloadContent } from '@/utils/file'
import { onBeforeUnmount, provide, reactive, ref, toRef, watch } from 'vue'
import { isAxiosError, isCancel } from 'axios'
const { isPageError, isPageLoading, pageErrorCode, pageIsError, pageLoading } = usePage()
const { windowWidth } = useWindow()

const emit = defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'unauthorized'): void,
    (eventName: 'not-found'): void,
    (eventName: 'updated', value: FileDB): void,
    (eventName: 'status-updated', value: FileStatus): void
}>()

const props = withDefaults(defineProps<Readonly<{
    file: FileDB | null,
    open?: boolean
}>>(), {
    open: false
})

const abortController = new AbortController()
const mediaElement = ref()
const streamURL = ref('')
const layout = reactive<{ [key: string]: boolean }>({
    activity: false,
    detail: false,
    edit: false,
    menu: false
})
const loading = reactive<{ [key: string]: boolean }>({
    edit: false,
    download: false,
    stream: false
})

const fileRef = toRef(() => props.file)

provide('file', fileRef)

function close(): void {
    if (!loading.edit) {
        emit('close')
    }
}
async function download(): Promise<void> {
    if (!props.file || loading.download) {
        return
    }

    loading.download = true

    try {
        const { url } = await requestDownloadLink(props.file.uuid)
        const fileName = `${props.file.name}.${props.file.extension}`

        downloadContent(url, fileName)
    } catch (err: unknown) {
        let errCode = 0

        if (isAxiosError(err) && err.response?.status) {
            errCode = err.response?.status

            if (errCode === 403) {
                emit('unauthorized')

                // Create window notification to notify user that they are unauthorized to view the content (403)

                return
            } else if (errCode === 404) {
                emit('not-found')

                // Create window notification to notify user that the file not found (404)

                return
            }
        }

        // Create window notification to notify user for unknown error
    } finally {
        loading.download = false
    }
}
async function loadStreamURL(): Promise<void> {
    if (!props.file || isPageLoading.value) {
        return
    }

    pageLoading(true)

    try {
        const { status, url } = await getStreamURL(props.file.uuid, abortController.signal)

        if (props.file.status !== status) {
            emit('status-updated', status)
        }

        if (url) {
            streamURL.value = url
        }
    } catch (err: unknown) {
        if (isCancel(err)) {
            return
        }

        let errCode = 0

        if (isAxiosError(err) && err.response?.status) {
            errCode = err.response?.status

            if (errCode === 403) {
                emit('unauthorized')

                // Create window notification to notify user that they are unauthorized to view the content (403)

                return
            }
            
            if (errCode === 404) {
                emit('not-found')

                // Create window notification to notify user that the file not found (404)

                return
            }
        }

        pageIsError(errCode)
    } finally {
        pageLoading(false)
    }
}
function mediaLoadError(event: Event): void {
    console.warn('Error media load')
    console.log(event.target)

    // 
}
function removeMediaSrc(): void {
    mediaElement.value?.removeAttribute('src')
}
function toggleLayout(layoutName: string | null): void {
    Object.keys(layout).forEach((key: string) => {
        layout[key] = false
    })

    if (layoutName) {
        layout[layoutName] = true
    }
}

watch(windowWidth, (newValue, oldValue): void => {
    if (newValue >= 640 && oldValue < 640) {
        layout.menu = false
    }
})
watch(() => props.open, async (newValue): Promise<void> => {
    if (newValue) {
        document.body.style['overflowY'] = 'hidden'

        // Get stream URL
        if (props.file?.category === 'audio' || props.file?.category === 'video') {
            await loadStreamURL()
        }
    } else {
        removeMediaSrc()

        // Reset all layout to false
        toggleLayout(null)

        document.body.style['overflowY'] = 'auto'
    }
})

onBeforeUnmount((): void => {
    removeMediaSrc()

    if (isPageLoading.value) {
        abortController.abort()
    }

    document.body.style['overflowY'] = 'auto'
})
</script>

<template>
    <div
        v-if="$props.open"
        class="bg-black/80 fixed inset-0 min-h-screen z-60"
    >
        <div
            v-if="$props.file"
            class="flex flex-grow flex-row flex-shrink h-full"
        >
            <div class="flex flex-col flex-grow flex-shrink h-full overflow-ellipsis overflow-hidden w-full">
                <!-- Navigation -->
                <FileViewerNavigation
                    @close="close"
                    @download="download"
                    @open-layout="toggleLayout"
                />

                <PageLoading
                    v-if="isPageLoading"
                    icon-color="#FFF"
                    class="h-[calc(100vh-4rem)]"
                />
                <PageError
                    v-else-if="isPageError"
                    @retry="loadStreamURL"
                    :error-code="pageErrorCode"
                    class="h-[calc(100vh-4rem)] text-white!"
                />
                <div
                    v-else-if="fileRef.status === 'processing'"
                    class="flex flex-col flex-grow flex-shrink gap-3 h-[calc(100vh-4rem)] items-center justify-center text-lg text-white w-full z-10"
                >
                    <IconMDILoading color="#FFF" :size="64" />

                    File is currently in process, please come back later.
                </div>
                <div
                    v-else
                    class="flex flex-grow flex-shrink h-[calc(100vh-4rem)] items-center w-full z-10"
                >
                    <audio
                        v-if="fileRef.category === 'audio'"
                        @error="mediaLoadError"
                        @contextmenu="$event => $event.preventDefault()"
                        ref="mediaElement"
                        :src="streamURL"
                        controls="true"
                        controlsList="nodownload"
                        preload="metadata"
                        class="mx-auto px-3 relative w-full z-[1]
                        sm:px-0
                        md:max-w-3xl"
                    />
                    <img
                        v-else-if="fileRef.category === 'image'"
                        @contextmenu="$event => $event.preventDefault()"
                        ref="mediaElement"
                        :src="fileRef.storage_url"
                        draggable="false"
                        class="max-h-full mx-auto relative w-full z-[1]
                        md:h-[calc(100%-3rem)] md:max-h-auto md:w-auto"
                    />
                    <video
                        v-else-if="fileRef.category === 'video'"
                        @contextmenu="$event => $event.preventDefault()"
                        @error="mediaLoadError"
                        ref="mediaElement"
                        :poster="fileRef.thumbnail_url"
                        :src="streamURL"
                        controls="true"
                        controlsList="nodownload"
                        playsinline="true"
                        preload="metadata"
                        class="max-h-full mx-auto relative z-[1]
                        md:h-[calc(100%-3rem)] md:max-h-auto"
                    />
                </div>
            </div>

            <FileViewerDetailLayout
                @close="toggleLayout(null)"
                :file="fileRef"
                :open="layout.detail"
            />
            <FileViewerEditLayout
                @close="toggleLayout(null)"
                @updated="{}"
                :file="fileRef"
                :open="layout.edit"
            />
            <FileViewerMenu
                @close="toggleLayout(null)"
                @toggle-layout="toggleLayout"
                :open="layout.menu"
            />
        </div>
        <div class="text-white">
            File is NULL
        </div>
    </div>
</template>
