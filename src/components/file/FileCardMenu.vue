<script setup lang="ts">
import IconMDIAccessTime from '@src/components/svg/mdi/AccessTime.vue'
import IconMDIBinOutline from '@src/components/svg/mdi/BinOutline.vue'
import IconMDIFileEditOutline from '@src/components/svg/mdi/FileEditOutline.vue'
import IconMDIFileRestoreOutline from '@src/components/svg/mdi/FileRestoreOutline.vue'
import IconMDIInformationOutline from '@src/components/svg/mdi/InformationOutline.vue'
import IconMDILockOutline from '@src/components/svg/mdi/LockOutline.vue'
import IconMDIShareVariantOutline from '@src/components/svg/mdi/ShareVariantOutline.vue'
import IconMDITrayDownload from '@src/components/svg/mdi/TrayDownload.vue'
import { FileDB, ViewMode } from '@src/stores/modules/file/types'
import { downloadFile } from '@src/utils/file'
import { useStore } from 'vuex'
import { ComputedRef, inject } from 'vue'
const store = useStore()

defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'open-modal', modalName: string): void,
}>()

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
            'md:right-8 md:-top-2': viewMode === 'grid',
            'md:right-6 md:-top-3': viewMode === 'list',
        }"
        class="bg-black/80 fixed flex inset-0 items-end p-3 w-full z-[2]
        md:absolute md:bg-transparent md:inset-auto md:w-72"
    >
        <!-- Click to close -->
        <button
            @click="$emit('close')"
            type="button"
            class="absolute bg-transparent inset-0 z-1
            md:hidden"
            title="View this file"
        >
            <span class="hidden">Close</span>
        </button>

        <div
            class="bg-white flex flex-col pb-3 rounded-xl w-full z-[2]
            md:border md:border-stone-300 md:overflow-hidden md:pb-0 md:shadow-md md:shadow-stone-300/60"
        >
            <div
                class="flex flex-row items-center justify-end px-3
                md:hidden"
            >
                <!--  -->
            </div>

            <div class="flex flex-col p-3">
                <button
                    @click="{}"
                    type="button"
                    class="flex flex-grow flex-shrink gap-4 items-center p-2 rounded-xl text-lg
                    hover:bg-stone-300/30"
                >
                    <IconMDIInformationOutline />

                    Detail
                </button>

                <template v-if="file.deleted_at">
                    <button
                        @click="{}"
                        type="button"
                        class="flex flex-grow flex-shrink gap-4 items-center p-2 rounded-xl text-lg
                        hover:bg-stone-300/30"
                    >
                        <IconMDIBinOutline />

                        Delete permanently
                    </button>

                    <button
                        @click="$emit('open-modal', 'restore')"
                        type="button"
                        class="flex flex-grow flex-shrink gap-4 items-center p-2 rounded-xl text-lg
                        hover:bg-stone-300/30"
                    >
                        <IconMDIFileRestoreOutline />

                        Restore
                    </button>
                </template>
                <template v-else>
                    <button
                        @click="{}"
                        type="button"
                        class="flex flex-grow flex-shrink gap-4 items-center p-2 rounded-xl text-lg
                        hover:bg-stone-300/30"
                    >
                        <IconMDIAccessTime />

                        View log
                    </button>

                    <button
                        @click="{}"
                        type="button"
                        class="flex flex-grow flex-shrink gap-4 items-center p-2 rounded-xl text-lg
                        hover:bg-stone-300/30"
                    >
                        <IconMDILockOutline />

                        Manage access
                    </button>

                    <button
                        @click="download"
                        type="button"
                        class="flex flex-grow flex-shrink gap-4 items-center p-2 rounded-xl text-lg
                        hover:bg-stone-300/30"
                    >
                        <IconMDITrayDownload />

                        Download
                    </button>

                    <button
                        @click="{}"
                        type="button"
                        class="flex flex-grow flex-shrink gap-4 items-center p-2 rounded-xl text-lg
                        hover:bg-stone-300/30"
                    >
                        <IconMDIShareVariantOutline />

                        Share
                    </button>

                    <button
                        @click="$emit('open-modal', 'delete')"
                        type="button"
                        class="flex flex-grow flex-shrink gap-4 items-center p-2 rounded-xl text-lg
                        hover:bg-stone-300/30"
                    >
                        <IconMDIBinOutline />

                        Delete
                    </button>

                    <button
                        @click="$emit('open-modal', 'edit')"
                        type="button"
                        class="flex flex-grow flex-shrink gap-4 items-center p-2 rounded-xl text-lg
                        hover:bg-stone-300/30"
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
