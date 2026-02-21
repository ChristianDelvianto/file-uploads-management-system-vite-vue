<script setup lang="ts">
import Button from '@src/components/ui/Button.vue'
import IconMDIAsterisk from '@src/components/svg/mdi/Asterisk.vue'
import IconMDIBin from '@src/components/svg/mdi/Bin.vue'
import IconMDIBoxVariant from '@src/components/svg/mdi/BoxVariant.vue'
import IconMDICog from '@src/components/svg/mdi/Cog.vue'
import IconMDIDocument from '@src/components/svg/mdi/Document.vue'
import IconMDIHistory from '@src/components/svg/mdi/History.vue'
import IconMDIImage from '@src/components/svg/mdi/Image.vue'
import IconMDIMusic from '@src/components/svg/mdi/Music.vue'
import IconMDIVideo from '@src/components/svg/mdi/Video.vue'
import { useWindow } from '@src/composables/useWindow'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { markRaw } from 'vue'
import { createUploadList, getFileType, validateFile } from '@src/utils/file'
const store = useStore()
const route = useRoute()
const { windowWidth } = useWindow()

const links = [
    {
        icon: markRaw(IconMDIHistory),
        text: 'Recent',
        to: '/user/recent',
    },
    {
        icon: markRaw(IconMDIImage),
        text: 'Image',
        to: '/user/images',
    },
    {
        icon: markRaw(IconMDIMusic),
        text: 'Audio',
        to: '/user/audios',
    },
    {
        icon: markRaw(IconMDIVideo),
        text: 'Video',
        to: '/user/videos',
    },
    {
        icon: markRaw(IconMDIDocument),
        text: 'Document',
        to: '/user/documents',
    },
    {
        icon: markRaw(IconMDIAsterisk),
        text: 'Other',
        to: '/user/others',
    },
    {
        icon: markRaw(IconMDIBin),
        text: 'Deleted',
        to: '/user/deleted',
    },
    {
        icon: markRaw(IconMDICog),
        text: 'Settings',
        to: '/user/settings',
    },
]

function filesSelect(event: Event): void {
    const input = (event.target as HTMLInputElement)
    const files = Array.prototype.slice.call(input.files)

    console.log('files:', files);

    if (files.length) {
        files.forEach((file: File) => {
            const fileType = getFileType(file)

            console.log('File size:', file.size)
            console.log('File type:', fileType)

            if (validateFile(file) && fileType) {
                console.warn('File passed validation')

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
</script>

<template>
    <aside
        class="bg-white flex flex-col h-[calc(100vh-4rem)] overflow-y-auto py-3
        md:gap-1.5 md:h-[inherit] md:pt-0"
    >
        <div
            class="border-b border-stone-300 hidden p-3
            md:block"
        >
            <button
                @click="createInputFile"
                type="button"
                class="bg-blue-600 duration-300 ease-in-out font-bold rounded-full py-1.5 text-xl text-white transition-colors w-full
                focus:bg-blue-900
                hover:bg-blue-900"
            >
                Upload
            </button>
        </div>

        <div
            class="flex flex-col-reverse gap-1 py-1.5
            md:flex-col"
        >
            <div class="border-b border-stone-300 flex flex-grow-0 flex-row flex-shrink-0 gap-3 pb-3 px-3">
                <IconMDIBoxVariant :size="64" />

                <div class="w-full">
                    <div class="bg-stone-300 flex flex-col h-3 justify-start overflow-hidden rounded-full w-full">
                        <div class="bg-blue-600 h-full rounded-full w-[23%]"></div>
                    </div>

                    <div class="pt-1.5 text-gray-600">23% used</div>

                    <Button
                        level="neutral"
                        class="font-semibold mt-1.5"
                    >Upgrade Plan</Button>
                </div>
            </div>

            <div
                class="flex flex-col flex-grow flex-shrink gap-1.5 pb-1.5 pt-3
                md:flex-grow"
            >
                <span class="block font-semibold pl-6 text-gray-600">My drive</span>

                <div
                    class="flex flex-col flex-grow-0 flex-shrink-0 pr-3 relative"
                >
                    <RouterLink
                        v-for="link in links"
                        :key="link.text"
                        :to="link.to"
                        :class="{
                            'bg-blue-100 text-blue-600': route.path === link.to,
                            'text-gray-600 focus:bg-stone-300 hover:bg-stone-300': route.path !== link.to,
                        }"
                        class="duration-300 ease-in-out flex flex-grow-0 flex-row font-semibold gap-3 items-center left-3 -ml-3 pl-6 py-3 relative rounded-r-full text-xl transition-colors w-full"
                    >
                        <component
                            :color="route.path === link.to ? '#155DFC' : undefined"
                            :is="link.icon"
                        />

                        {{ link.text }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </aside>
</template>
