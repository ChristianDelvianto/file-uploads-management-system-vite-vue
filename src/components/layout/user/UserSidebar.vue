<script setup lang="ts">
import UserSidebarContent from './UserSidebarContent.vue'
import { useWindow } from '@/composables/useWindow'
import { MIN_WIDTH_MD } from '@/const/window.ts'
const { windowWidth } = useWindow()

defineEmits<{
    (eventName: 'toggleSidebar'): void
}>()
</script>

<template>
    <div
        class="bg-black/80 fixed inset-0 min-h-full w-full z-[11]
        md:bg-[rgb(234,250,234)] md:flex-grow-0 md:flex-shrink-0 sm:h-[calc(100vh-4rem)] md:top-16 md:w-72 md:z-1
        lg:w-80"
    >
        <!-- Button to covering entire element, easy for user to click - to close -->
        <button
            v-if="windowWidth < MIN_WIDTH_MD"
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
                class="bg-white border-b border-stone-300/60 flex items-center h-16 pl-3 w-full
                md:hidden"
            >
                <span class="leading-0 text-3xl">{{ $APP_NAME }}</span>
            </div>

            <UserSidebarContent />
        </div>
    </div>
</template>
