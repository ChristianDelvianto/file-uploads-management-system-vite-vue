<script setup lang="ts">
import UserNavigationDropdown from './UserNavigationDropdown.vue'
import IconMDIAccount from '@src/components/svg/mdi/Account.vue'
import IconMDIDotsVertical from '@src/components/svg/mdi/DotsVertical.vue'
import IconMDIMagnify from '@src/components/svg/mdi/Magnify.vue'
import IconMDIUpload from '@src/components/svg/mdi/Upload.vue'
import { useWindow } from '@src/composables/useWindow'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { createUploadList, getFileType, validateFile } from '@src/utils/file'
const store = useStore()
const route = useRoute()
const router = useRouter()
const { windowWidth } = useWindow()

const brandName = import.meta.env.VITE_APP_NAME
const showDropdown = ref(false)

defineEmits<{
    (eventName: 'toggleSidebar'): void,
}>()

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
async function logout(): Promise<void> {
    store.dispatch('auth/logout')
    
    await router.push('/login')
        .then(() => {
            store.dispatch('auth/loggedOut')
        })
}

watch(() => route.name, (): void => {
    showDropdown.value = false
})
</script>

<template>
    <header
        class="bg-white border-b border-stone-300 h-16 sticky top-0 w-full z-[2]
        md:border-0 md:z-10"
    >
        <nav class="relative size-full">
            <div
                class="flex flex-grow-0 flex-row flex-shrink-0 h-full items-center min-h-[inherit] px-1.5 w-full
                md:px-3"
            >
                <!-- Left -->
                <div
                    class="flex flex-grow-0 flex-row flex-shrink-0 h-full items-center justify-start
                    sm:flex-grow
                    lg:w-1/4"
                >
                    <button
                        @click="$emit('toggleSidebar')"
                        type="button"
                        class="flex items-center justify-center rounded-full size-12
                        md:hidden"
                    >
                        <IconMDIDotsVertical />
                    </button>

                    <RouterLink
                        :to="{ name: 'user.home' }"
                        class="leading-0 text-3xl"
                    >{{ brandName }}</RouterLink>
                </div>

                <!-- Search -->
                <form
                    @submit.prevent="{}"
                    class="flex-grow hidden
                    md:flex md:w-1/2"
                >
                    <div
                        class="bg-stone-300/30 border border-stone-300 flex items-center rounded-full h-12 px-3 mx-auto w-full
                        md:max-w-lg"
                    >
                        <button
                            @click="{}"
                            type="submit"
                            class="flex flex-grow-0 flex-shrink-0 items-center justify-center size-8"
                        >
                            <IconMDIMagnify class="flex-grow-0 flex-shrink-0" />
                        </button>

                        <input
                            type="text"
                            placeholder="Search in your drive"
                            class="bg-transparent flex-grow flex-shrink px-3 text-lg w-full
                            focus:outline-none"
                        />
                    </div>
                </form>

                <!-- Right -->
                <div
                    class="flex flex-grow flex-row flex-shrink-0 items-center justify-end
                    lg:w-1/4"
                >
                    <button
                        v-if="windowWidth < 768"
                        @click="{}"
                        type="button"
                        class="duration-300 ease-in-out flex items-center justify-center rounded-full size-12 transition-all"
                    >
                        <IconMDIMagnify />
                    </button>

                    <button
                        v-if="windowWidth < 768"
                        @click="createInputFile"
                        type="button"
                        class="duration-300 ease-in-out flex items-center justify-center rounded-full size-12 transition-all
                        md:hidden"
                    >
                        <IconMDIUpload />
                    </button>

                    <button
                        @click="showDropdown = !showDropdown"
                        :class="{
                            'bg-blue-600': showDropdown,
                        }"
                        type="button"
                        class="duration-300 ease-in-out flex items-center justify-center rounded-full size-12 transition-all"
                    >
                        <IconMDIAccount
                            :color="showDropdown ? '#FFF' : undefined"
                        />
                    </button>
                </div>
            </div>

            <UserNavigationDropdown
                v-show="showDropdown"
                @logout="logout"
            />
        </nav>
    </header>
</template>
