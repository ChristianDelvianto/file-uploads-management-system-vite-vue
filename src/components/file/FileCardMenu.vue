<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import IconMDIBinOutline from '@/components/svg/mdi/BinOutline.vue'
import IconMDIFileEditOutline from '@/components/svg/mdi/FileEditOutline.vue'
import IconMDIFileRestoreOutline from '@/components/svg/mdi/FileRestoreOutline.vue'
import IconMDIInformationOutline from '@/components/svg/mdi/InformationOutline.vue'
import IconMDILockOutline from '@/components/svg/mdi/LockOutline.vue'
import IconMDIShareVariantOutline from '@/components/svg/mdi/ShareVariantOutline.vue'
import IconMDITrayDownload from '@/components/svg/mdi/TrayDownload.vue'
import { useAuth } from '@/composables/useAuth'
import { useFileCard } from '@/composables/useFileCard'
import { requestDownloadLink } from '@/services/file.service'
import { FileDB, FileViewMode } from '@/types/file'
import { downloadContent } from '@/utils/file'
import { computed, ComputedRef, inject, ref, type ToRef } from 'vue'
const { profile } = useAuth()

defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'open-modal', modalName: string): void
}>()

const file = inject<Readonly<ToRef<FileDB | null>>>('file', ref(null))
const viewMode = inject<Readonly<ComputedRef<FileViewMode>>>('viewMode')

const isOwner = computed(() => {
    return profile.value?.id === file.value?.user?.id
})

const { fileIcon, fileName } = useFileCard(file)

async function download(): Promise<void> {
    if (!file.value) {
        return
    }

    try {
        const { url } = await requestDownloadLink(file.value.uuid)

        downloadContent(url, fileName.value)
    } catch (err: unknown) {
        window.alert('Error while attempting to download')
    }
}
</script>

<template>
    <div
        :class="{
            'md:right-8': viewMode === 'grid',
            'md:right-6': viewMode === 'list'
        }"
        class="bg-black/80 fixed flex inset-0 items-end p-3 w-full z-[2]
        md:absolute md:bg-transparent md:inset-auto md:-top-3 md:w-72"
    >
        <div
            class="bg-white flex flex-col pb-3 rounded-xl w-full z-[2]
            md:border md:border-stone-300/30 md:overflow-hidden md:pb-0 md:rounded-xl md:shadow-md md:shadow-stone-300/60"
        >
            <div
                class="border-b border-stone-300/60 flex flex-row gap-3 items-center overflow-ellipsis overflow-hidden p-3 w-full
                md:hidden"
            >
                <span class="flex flex-grow-0 flex-shrink-0 items-center justify-center size-8">
                    <component
                        color="#155DFC"
                        :is="fileIcon"
                        :size="24"
                    />
                </span>

                <div
                    v-text="fileName"
                    class="font-semibold overflow-ellipsis overflow-hidden text-lg whitespace-nowrap"
                ></div>
            </div>

            <div
                class="flex flex-col pb-1.5 px-1.5
                md:pt-1.5"
            >
                <button
                    @click="$emit('open-modal', 'detail')"
                    type="button"
                    class="flex flex-grow flex-shrink gap-3 items-center p-2 rounded-lg text-lg
                    hover:bg-stone-300/60"
                >
                    <IconMDIInformationOutline color="#000" />

                    Details
                </button>

                <!-- Menu when file trashed -->
                <template v-if="file?.deleted_at">
                    <button
                        @click="$emit('open-modal', 'trash')"
                        type="button"
                        class="flex flex-grow flex-shrink gap-3 items-center p-2 rounded-lg text-lg
                        hover:bg-stone-300/60"
                    >
                        <IconMDIBinOutline color="#000" />

                        Delete forever
                    </button>

                    <button
                        @click="$emit('open-modal', 'restore')"
                        type="button"
                        class="flex flex-grow flex-shrink gap-3 items-center p-2 rounded-lg text-lg
                        hover:bg-stone-300/60"
                    >
                        <IconMDIFileRestoreOutline color="#000" />

                        Restore
                    </button>
                </template>
                <template v-else>
                    <button
                        v-if="isOwner"
                        @click="$emit('open-modal', 'visibility')"
                        type="button"
                        class="flex flex-grow flex-shrink gap-3 items-center p-2 rounded-lg text-lg
                        hover:bg-stone-300/60"
                    >
                        <IconMDILockOutline color="#000" />

                        Manage visibility
                    </button>

                    <button
                        @click="download"
                        type="button"
                        class="flex flex-grow flex-shrink gap-3 items-center p-2 rounded-lg text-lg
                        hover:bg-stone-300/60"
                    >
                        <IconMDITrayDownload color="#000" />

                        Download
                    </button>

                    <button
                        v-if="isOwner"
                        @click="$emit('open-modal', 'share')"
                        type="button"
                        class="flex flex-grow flex-shrink gap-3 items-center p-2 rounded-lg text-lg
                        hover:bg-stone-300/60"
                    >
                        <IconMDIShareVariantOutline color="#000" />

                        Share
                    </button>

                    <button
                        v-if="isOwner"
                        @click="$emit('open-modal', 'trash')"
                        type="button"
                        class="flex flex-grow flex-shrink gap-3 items-center p-2 rounded-lg text-lg
                        hover:bg-stone-300/60"
                    >
                        <IconMDIBinOutline color="#000" />

                        Move to trash
                    </button>

                    <button
                        v-if="isOwner"
                        @click="$emit('open-modal', 'rename')"
                        type="button"
                        class="flex flex-grow flex-shrink gap-3 items-center p-2 rounded-lg text-lg
                        hover:bg-stone-300/60"
                    >
                        <IconMDIFileEditOutline color="#000" />

                        Rename
                    </button>
                </template>
            </div>

            <div
                class="px-3
                md:hidden"
            >
                <Button
                    @click="$emit('close')"
                    class="bg-stone-50 stone-300/60 font-semibold py-1.5 rounded-full! text-center text-lg w-full"
                >Go back</Button>
            </div>
        </div>  
    </div>
</template>
