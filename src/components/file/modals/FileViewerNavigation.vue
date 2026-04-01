<script setup lang="ts">
import IconMDIAccount from '@src/components/svg/mdi/Account.vue'
import IconMDIClose from '@src/components/svg/mdi/Close.vue'
import IconMDIDotsVertical from '@src/components/svg/mdi/DotsVertical.vue'
import IconMDIFileDocumentBoxSearchOutline from '@src/components/svg/mdi/FileDocumentBoxSearchOutline.vue'
import IconMDIFileEditOutline from '@src/components/svg/mdi/FileEditOutline.vue'
import IconMDIInformationOutline from '@src/components/svg/mdi/InformationOutline.vue'
import IconMDITrayDownload from '@src/components/svg/mdi/TrayDownload.vue'
import { useAuth } from '@src/composables/useAuth'
import { ComputedRef, inject } from 'vue'
const { authenticated, profile } = useAuth()

defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'download'): void,
    (eventName: 'open:detail-layout'): void,
    (eventName: 'open:edit-layout'): void,
    (eventName: 'open:log-layout'): void,
    (eventName: 'open:menu-layout'): void,
}>()

const asModal = inject<Readonly<boolean>>('asModal', false)
const file = inject<ComputedRef<Readonly<FileDB>>>('file')
</script>

<template>
    <div
        class="flex flex-grow flex-row flex-shrink gap-1.5 h-16 items-center pr-1.5 relative z-10 w-full
        sm:gap-3 sm:pr-3"
    >
        <div
            :class="{
                'pl-3': !asModal,
            }"
            class="flex flex-grow flex-row flex-shrink items-center overflow-ellipsis overflow-hidden whitespace-nowrap"
        >
            <button
                v-if="asModal"
                @click="$emit('close')"
                type="button"
                class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-12"
            >
                <IconMDIClose color="#FFF" />
            </button>

            <h1
                v-text="file.name"
                class="font-semibold overflow-ellipsis overflow-hidden text-white text-xl"
            ></h1>
        </div>

        <!-- Buttons -->
        <div class="flex flex-grow-0 flex-row flex-shrink-0 gap-1 items-center">
            <button
                @click="$emit('open:detail-layout')"
                type="button"
                title="View file detail"
                class="flex-grow-0 flex-shrink-0 hidden items-center justify-center rounded-full size-12
                sm:flex"
            >
                <IconMDIInformationOutline color="#FFF" />
            </button>

            <button
                v-if="asModal || authenticated && profile.id === file.user.id"
                @click="$emit('open:log-layout')"
                type="button"
                title="View file logs"
                class="flex-grow-0 flex-shrink-0 hidden items-center justify-center rounded-full size-12
                sm:flex"
            >
                <IconMDIFileDocumentBoxSearchOutline color="#FFF" />
            </button>

            <button
                v-if="asModal || authenticated && profile.id === file.user.id"
                @click="$emit('open:edit-layout')"
                type="button"
                title="Edit this file"
                class="flex-grow-0 flex-shrink-0 hidden items-center justify-center rounded-full size-12
                sm:flex"
            >
                <IconMDIFileEditOutline color="#FFF" />
            </button>

            <button
                @click="$emit('download')"
                type="button"
                title="Download this file"
                class="flex-grow-0 flex-shrink-0 hidden items-center justify-center rounded-full size-12
                sm:flex"
            >
                <IconMDITrayDownload color="#FFF" />
            </button>

            <!-- Owner -->
            <div
                v-if="!asModal"
                class="bg-gray-300 flex-grow-0 flex-shrink-0 hidden items-center justify-center rounded-full size-12
                sm:flex"
            >
                <IconMDIAccount />
            </div>

            <button
                @click="$emit('open:menu-layout')"
                type="button"
                class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-12
                sm:hidden"
            >
                <IconMDIDotsVertical color="#FFF" />
            </button>
        </div>
    </div>
</template>
