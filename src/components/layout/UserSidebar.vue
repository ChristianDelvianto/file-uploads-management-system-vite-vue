<script setup lang="ts">
import UserSidebarContent from './UserSidebarContent.vue'
import IconMDIClose from '@src/components/svg/mdi/Close.vue'
import { useWindow } from '@src/composables/useWindow'
const { windowWidth } = useWindow()

defineEmits<{
    (eventName: 'toggleSidebar'): void,
}>()
</script>

<template>
    <div
        class="bg-gray-900/80 fixed inset-0 min-h-full w-full z-[11]
        md:bg-white md:flex-grow-0 md:flex-shrink-0 sm:h-[calc(100vh-4rem)] md:top-16 md:w-72 md:z-1
        lg:w-80"
    >
        <!-- Button to covering entire element, easy for user to click - to close -->
        <button
            v-if="windowWidth < 768"
            @click="$emit('toggleSidebar')"
            type="button"
            class="absolute bg-transparent inset-0 z-1"
            title="Close"
        >
            <span class="hidden">Close</span>
        </button>

        <div
            class="max-w-md relative w-[85%] z-[2]
            md:max-w-full md:w-full"
        >
            <div
                class="bg-white border-b border-stone-300 flex items-center h-16 pl-1.5 pr-3 w-full
                md:hidden"
            >
                <button
                    @click="$emit('toggleSidebar')"
                    type="button"
                    class="flex flex-grow-0 flex-row flex-shrink-0 items-center justify-center rounded-full size-12
                    md:hidden"
                >
                    <IconMDIClose />
                </button>
            </div>

            <UserSidebarContent />
        </div>
    </div>
</template>
