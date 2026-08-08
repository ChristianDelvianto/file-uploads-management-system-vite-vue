<script setup lang="ts">
import IconMDIChevronDown from '@/components/svg/mdi/ChevronDown.vue'
import IconMDIChevronUp from '@/components/svg/mdi/ChevronUp.vue'
import IconMDIClose from '@/components/svg/mdi/Close.vue'
import IconMDIUpload from '@/components/svg/mdi/Upload.vue'
import UserUploadList from './UserUploadList.vue'
import { useAuth } from '@/composables/useAuth'
import { useWindow } from '@/composables/useWindow'
import { MIN_WIDTH_SM } from '@/const/window'
import { UploadId, UploadList } from '@/types/upload'
import { createInputFile, validateFiles } from '@/utils/file'
import { createUploadList } from '@/utils/upload'
import { useStore } from 'vuex'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
const store = useStore()
const { userPlan } = useAuth()
const { windowWidth } = useWindow()

const isFullScreen = ref(false)
const showList = ref(true)

const items = computed<{ [id: UploadId]: UploadList }>(() => {
    return store.getters['upload/items']
})
const itemsKey = computed<string[]>(() => {
    return Object.keys(items.value)
            .reverse() // We have to use reverse, to sort from newest to oldest
})
const currentlyUploading = computed<boolean>(() => {
    if (itemsKey.value.length === 0) {
        return false
    }

    const uploads = []

    for (let i = 0; i < itemsKey.value.length; i++) {
        const key = itemsKey.value[i]

        uploads.push(items.value[key])
    }

    return uploads.some((upload: UploadList) => upload.status === 'processing' || upload.status === 'uploading')
})

function clearList(): void {
    if (!currentlyUploading.value) {
        store.dispatch('upload/removeAll')
    }
}
async function newUploads(): Promise<void> {
    const files = await createInputFile()
    if (files.length === 0) return

    const validatedFiles = await validateFiles(files, userPlan.value.limit_bytes)
    if (validatedFiles.length === 0) return

    const uploadsList = await createUploadList(validatedFiles)
    if (uploadsList.length === 0) return

    uploadsList.forEach((upload: UploadList) => {
        store.dispatch('upload/store', upload)
    })
}
function removeList(id: UploadId): void {
    store.dispatch('upload/remove', id)
}
function toggleFullScreen(value: boolean): void {
    document.body.style['overflowY'] = value ? 'hidden' : 'auto'

    isFullScreen.value = value
}

watch(windowWidth, (newValue, oldValue): void => {
    // Reset all to default
    if (newValue >= MIN_WIDTH_SM && oldValue < MIN_WIDTH_SM) {
        isFullScreen.value = false
        showList.value = true

        document.body.style['overflowY'] = 'auto'
    } else if (newValue < MIN_WIDTH_SM && oldValue >= MIN_WIDTH_SM) {
        isFullScreen.value = false
        showList.value = true

        document.body.style['overflowY'] = 'hidden'
    }
})

onBeforeUnmount((): void => {
    // Restore window scroll
    if (windowWidth.value < MIN_WIDTH_SM && isFullScreen.value) {
        document.body.style['overflowY'] = 'auto'
    }
})
</script>

<template>
    <div
        v-if="itemsKey.length !== 0"
        :class="{
            'bg-black/80 flex flex-col inset-0 justify-end size-full z-[3]': isFullScreen,
            'bottom-3 border border-stone-600/30 h-16 right-3 overflow-hidden rounded-xl w-16 z-[1] sm:h-auto sm:rounded-b-none sm:shadow-sm sm:shadow-stone-300/60 md:border-stone-300/60': !isFullScreen
        }"
        class="fixed overflow-hidden
        sm:bottom-0 sm:inset-auto sm:w-96 sm:right-6 sm:rounded-t-xl"
    >
        <!-- Button to enable fullscreen mode -->
        <button
            v-if="windowWidth < MIN_WIDTH_SM && !isFullScreen"
            @click="toggleFullScreen(true)"
            type="button"
            class="bg-blue-600 flex font-bold items-center justify-center leading-0 size-16 text-2xl text-white"
        >
            {{ itemsKey.length }}
        </button>

        <div
            v-if="windowWidth >= MIN_WIDTH_SM || isFullScreen"
            :class="{
                'rounded-t-2xl': isFullScreen
            }"
            class="bg-white border-b border-stone-300/60 flex flex-grow-0 flex-row h-16 items-center justify-between px-3 w-full z-10
            sm:h-auto sm:py-3"
        >
            <span class="font-semibold text-xl">{{ itemsKey.length }} uploads</span>

            <div
                v-if="windowWidth >= MIN_WIDTH_SM"
                class="flex flex-grow-0 flex-row flex-shrink-0 items-center"
            >
                <button
                    @click="showList = !showList"
                    type="button"
                    class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9
                    focus:bg-stone-300/60
                    hover:bg-stone-300/60"
                >
                    <IconMDIChevronDown
                        v-if="showList"
                        color="#000"
                        :size="24"
                    />
                    <IconMDIChevronUp
                        v-else
                        color="#000"
                        :size="24"
                    />
                </button>

                <button
                    v-if="windowWidth >= MIN_WIDTH_SM"
                    @click="clearList"
                    :disabled="currentlyUploading"
                    type="button"
                    class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9
                    focus:bg-stone-300/60
                    hover:bg-stone-300/60"
                >
                    <IconMDIClose color="#000" :size="24" />
                </button>
            </div>

            <div
                v-if="windowWidth < MIN_WIDTH_SM && isFullScreen"
                class="flex flex-grow-0 flex-row flex-shrink-0 gap-3 items-center"
            >
                <button
                    @click="newUploads"
                    type="button"
                    class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9"
                >
                    <IconMDIUpload color="#000" :size="24" />
                </button>

                <button
                    @click="toggleFullScreen(false)"
                    type="button"
                    class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9"
                >
                    <IconMDIChevronDown color="#000" :size="24" />
                </button>
            </div>
        </div>

        <div
            v-show="showList"
            :class="{
                'h-[calc(70vh-4rem)]': windowWidth < MIN_WIDTH_SM,
                'sm:max-h-80': showList,
                'h-0': !showList
            }"
            class="bg-white divide-y divide-stone-300/60 flex flex-col overflow-ellipsis overflow-y-auto w-full z-10
            sm:duration-300 sm:ease-in-out sm:transition-all"
        >
            <UserUploadList
                v-for="id in itemsKey"
                @remove="removeList(id)"
                :item="items[id]"
                :key="id"
            />
        </div>
    </div>
</template>
