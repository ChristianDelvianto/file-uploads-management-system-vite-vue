<script setup lang="ts">
import UserSidebarContent from './UserSidebarContent.vue'
import IconMDIClose from '@src/components/svg/mdi/Close.vue'

defineEmits<{
    (eventName: 'toggleSidebar'): void,
}>()
</script>

<template>
    <div
        class="bg-black/60 fixed inset-0 min-h-full w-full z-[11]
        md:bg-white sm:h-[calc(100vh-4rem)] md:top-16 md:w-72
        lg:w-80"
    >
        <div
            class="bg-white border-b border-stone-300 flex items-center h-16 px-3 w-full
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
</template>
