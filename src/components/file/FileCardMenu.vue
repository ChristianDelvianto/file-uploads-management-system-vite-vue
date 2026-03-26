<script setup lang="ts">
import IconMDIAccessTime from '@src/components/svg/mdi/AccessTime.vue'
import IconMDIBinOutline from '@src/components/svg/mdi/BinOutline.vue'
import IconMDIClose from '@src/components/svg/mdi/Close.vue'
import IconMDIFileEditOutline from '@src/components/svg/mdi/FileEditOutline.vue'
import IconMDIInformationOutline from '@src/components/svg/mdi/InformationOutline.vue'
import IconMDIShareVariantOutline from '@src/components/svg/mdi/ShareVariantOutline.vue'
import IconMDITrayDownload from '@src/components/svg/mdi/TrayDownload.vue'
import { FileDB, ViewMode } from '@src/stores/modules/file/types'
import { downloadFile } from '@src/utils/file'
import { useStore } from 'vuex'
import { ComputedRef, inject } from 'vue'
const store = useStore()

defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'open:delete-modal'): void,
    (eventName: 'open:edit-modal'): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    // $props.enableRestore should be set when user in deleted route
    // To enable restore deleted file
    enableRestore?: boolean,
}>>(), {
    enableRestore: false,
})

const file = inject<Readonly<FileDB>>('file')
const viewMode = inject<ComputedRef<Readonly<ViewMode>>>('viewMode')

async function download(): Promise<void> {
    if (!file) {
        return
    }

    try {
        const url = await store.dispatch('file/getDownloadLink', file.uuid)

        downloadFile(url, file.name)
    } catch (err) {
        console.warn('Error while attempting to download')
    }
}
</script>

<template>
    <div
        :class="{
            'md:right-10': viewMode === 'grid',
            'md:right-9': viewMode === 'list',
        }"
        class="bg-gray-900/80 fixed flex inset-0 items-end w-full z-[2]
        md:absolute md:bg-transparent md:inset-auto md:top-0 md:w-72"
    >
        <div
            class="bg-white flex flex-col pb-3 pt-3 rounded-t-xl w-full
            md:border md:border-stone-300 md:overflow-hidden md:py-0 md:rounded-xl md:shadow-md md:shadow-stone-300/60"
        >
            <div
                class="flex flex-row items-center justify-end px-3
                md:hidden"
            >
                <button
                    @click="$emit('close')"
                    class="rounded p-1.5
                    hover:bg-gray-300/60"
                >
                    <IconMDIClose :size="20" />
                </button>
            </div>

            <div class="flex flex-col p-3">
                <button
                    @click="{}"
                    type="button"
                    class="border-b border-stone-300 flex flex-grow flex-shrink gap-3 items-center px-1.5 p-2 text-lg
                    hover:bg-stone-300"
                >
                    <IconMDIInformationOutline />

                    Detail
                </button>

                <template v-if="$props.enableRestore">
                    <button
                        @click="{}"
                        type="button"
                        class="border-b border-stone-300 flex flex-grow flex-shrink gap-3 items-center px-1.5 p-2 text-lg
                        hover:bg-stone-300"
                    >
                        <IconMDIBin />

                        Restore
                    </button>
                </template>
                <template v-else>
                    <button
                        @click="download"
                        type="button"
                        class="border-b border-stone-300 flex flex-grow flex-shrink gap-3 items-center px-1.5 p-2 text-lg
                        hover:bg-stone-300"
                    >
                        <IconMDIAccessTime />

                        View log
                    </button>

                    <button
                        @click="download"
                        type="button"
                        class="border-b border-stone-300 flex flex-grow flex-shrink gap-3 items-center px-1.5 p-2 text-lg
                        hover:bg-stone-300"
                    >
                        <IconMDITrayDownload />

                        Manage access
                    </button>

                    <button
                        @click="download"
                        type="button"
                        class="border-b border-stone-300 flex flex-grow flex-shrink gap-3 items-center px-1.5 p-2 text-lg
                        hover:bg-stone-300"
                    >
                        <IconMDITrayDownload />

                        Download
                    </button>

                    <button
                        @click="download"
                        type="button"
                        class="border-b border-stone-300 flex flex-grow flex-shrink gap-3 items-center px-1.5 p-2 text-lg
                        hover:bg-stone-300"
                    >
                        <IconMDIShareVariantOutline />

                        Share
                    </button>

                    <button
                        @click="$emit('open:delete-modal')"
                        type="button"
                        class="border-b border-stone-300 flex flex-grow flex-shrink gap-3 items-center px-1.5 p-2 text-lg
                        hover:bg-stone-300"
                    >
                        <IconMDIBinOutline />

                        Delete
                    </button>

                    <button
                        @click="$emit('open:edit-modal')"
                        type="button"
                        class="border-b border-stone-300 flex flex-grow flex-shrink gap-3 items-center px-1.5 p-2 text-lg
                        hover:bg-stone-300"
                    >
                        <IconMDIFileEditOutline />

                        Edit
                    </button>
                </template>
            </div>

            <div
                class="px-3
                md:hidden"
            >
                <button
                    @click="$emit('close')"
                    type="button"
                    class="bg-gray-300/60 font-semibold py-1.5 rounded-full text-center text-lg w-full"
                >Close</button>
            </div>
        </div>  
    </div>
</template>
