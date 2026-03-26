<script setup lang="ts">
import IconMDIChevronDown from '@src/components/svg/mdi/ChevronDown.vue'
import IconMDIChevronUp from '@src/components/svg/mdi/ChevronUp.vue'
import IconMDIUpload from '@src/components/svg/mdi/Upload.vue'
import UserUploadList from './UserUploadList.vue'
import { useWindow } from '@src/composables/useWindow'
import { useStore } from 'vuex'
import { createUploadList, getFileType, validateFile } from '@src/utils/file'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
const store = useStore()
const { windowWidth } = useWindow()

const fullScreenEnabled = ref(false)
const showList = ref(true)

const uploads = computed(() => store.getters['file/items'])

function filesSelect(event: Event): void {
    const input = (event.target as HTMLInputElement)
    const files = Array.prototype.slice.call(input.files)

    if (files.length) {
        files.forEach((file: File) => {
            const fileType = getFileType(file)

            if (validateFile(file) && fileType) {
                const fileName = file.name
                const uploadList = createUploadList(fileType, fileName, file)

                store.dispatch('file/store', uploadList)
            } else {
                console.error('File does not pass validation:')
                console.log(file)
            }
        })
    }

    // Reset input value
    input.removeEventListener('change', filesSelect)
    input.value = ''
}
function createInputFile(): void {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.addEventListener('change', filesSelect, { once: true })
    input.click()
}
function clearList(id: number): void {
    store.commit('file/CLEAR_ITEM', id)
}
function retryUpload(id: number): void {
    store.dispatch('file/retry', id)
}
function toggleFullScreen(value: boolean): void {
    if (value) {
        document.body.style['overflowY'] = 'hidden'
    } else {
        document.body.style['overflowY'] = 'scroll'
    }

    fullScreenEnabled.value = value
}

watch(windowWidth, (newValue, oldValue) => {
    // Reset all to default
    if (newValue >= 640 && oldValue < 640) {
        fullScreenEnabled.value = false
        showList.value = true

        document.body.style['overflowY'] = 'scroll'
    } else if (newValue < 640 && oldValue >= 640) {
        fullScreenEnabled.value = false
        showList.value = true

        document.body.style['overflowY'] = 'scroll'
    }
})

onBeforeUnmount(() => {
    if (windowWidth.value < 640 && fullScreenEnabled.value) {
        document.body.style['overflowY'] = 'scroll'
    }
})
</script>

<template>
    <div
        v-if="uploads.length"
        :class="{
            'bg-gray-900/60 flex flex-col inset-0 justify-end size-full z-[3]': fullScreenEnabled,
            'bottom-3 border border-stone-300 h-16 right-3 overflow-hidden rounded-xl w-16 z-[1] sm:h-auto sm:rounded-b-none sm:shadow-sm sm:shadow-stone-300': !fullScreenEnabled,
        }"
        class="fixed overflow-hidden
        sm:border sm:border-stone-300 sm:bottom-0 sm:inset-auto sm:w-96 sm:right-6 sm:rounded-t-xl"
    >
        <!-- Button to enable fullscreen mode -->
        <button
            v-if="windowWidth < 640 && !fullScreenEnabled"
            @click="toggleFullScreen(true)"
            type="button"
            class="bg-blue-600 flex font-bold items-center justify-center leading-0 size-16 text-2xl text-white"
        >
            {{ uploads.length }}
        </button>

        <div
            v-if="windowWidth >= 640 || fullScreenEnabled"
            :class="{
                'rounded-t-2xl': fullScreenEnabled,
            }"
            class="bg-white border-b border-stone-300 flex flex-grow-0 flex-row h-16 items-center justify-between px-3 w-full z-10
            sm:h-auto sm:py-3"
        >
            <span class="font-bold text-xl">{{ uploads.length }} uploads</span>

            <button
                v-if="windowWidth >= 640"
                @click="showList = !showList"
                type="button"
                class="bg-gray-300 flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9"
            >
                <IconMDIChevronDown v-if="showList" :size="24" />
                <IconMDIChevronUp v-else :size="24" />
            </button>

            <div
                v-if="windowWidth < 640 && fullScreenEnabled"
                class="flex flex-grow-0 flex-row flex-shrink-0 gap-1.5 items-center"
            >
                <button
                    @click="createInputFile"
                    type="button"
                    class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9"
                >
                    <IconMDIUpload :size="24" />
                </button>

                <button
                    @click="toggleFullScreen(false)"
                    type="button"
                    class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9"
                >
                    <IconMDIChevronDown :size="24" />
                </button>
            </div>
        </div>

        <div
            v-show="showList"
            :class="{
                'h-[calc(80vh-4rem)]': windowWidth < 640,
                'sm:max-h-80': showList,
                'h-0': !showList,
            }"
            class="bg-white divide-y divide-stone-300 flex flex-col overflow-ellipsis overflow-y-auto w-full z-10
            sm:duration-300 sm:ease-in-out sm:transition-all"
        >
            <UserUploadList
                v-for="upload in uploads"
                @remove="clearList(upload.id)"
                @retry="retryUpload(upload.id)"
                :key="upload.id"
                :item="upload"
            />
        </div>
    </div>
</template>
