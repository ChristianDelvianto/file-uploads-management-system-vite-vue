<script setup lang="ts">
import UserSidebarLinks from './UserSidebarLinks.vue'
import UserSidebarPlan from './UserSidebarPlan.vue'
import { useStore } from 'vuex'
import { createUploadList, getFileType, validateFile } from '@src/utils/file'
const store = useStore()

function filesSelect(event: Event): void {
    const input = (event.target as HTMLInputElement)
    const files = Array.prototype.slice.call(input.files)

    if (files.length) {
        files.forEach((file: File) => {
            const fileType = getFileType(file)

            if (validateFile(file) && fileType) {
                const uploadList = createUploadList(fileType, file.name, file)

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
        md:gap-1.5 md:pt-0"
    >
        <div
            class="border-b border-stone-300 hidden pb-3 px-3
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
            class="flex flex-col-reverse gap-1
            md:flex-col md:pt-1.5"
        >
            <UserSidebarPlan />

            <UserSidebarLinks />
        </div>
    </aside>
</template>
