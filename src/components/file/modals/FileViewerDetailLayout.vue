<script setup lang="ts">
import IconMDIClose from '@src/components/svg/mdi/Close.vue'
import { FileDB } from '@src/stores/modules/file/types'

defineEmits<{
    (eventName: 'close'): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    file: FileDB,
    open?: boolean,
}>>(), {
    open: false,
})
</script>

<template>
    <div
        v-if="$props.open"
        class="bg-white fixed inset-0 w-full z-20
        md:flex-grow-0 md:flex-shrink-0 md:inset-auto md:relative md:w-96"
    >
        <!-- Navigation -->
        <div
            class="border-b border-stone-300 flex flex-grow flex-row flex-shrink gap-1.5 h-16 items-center pr-3
            lg:flex-row-reverse lg:pl-3 lg:pr-0"
        >
            <button
                @click="$emit('close')"
                type="button"
                class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-12"
            >
                <IconMDIClose />
            </button>

            <span
                class="font-bold text-xl
                lg:flex-grow"
            >Details</span>
        </div>

        <div
            class="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-1.5"
        >
            <div>File name</div>
            <div>Access</div>
            <div>Last update</div>
            <div>Created at</div>
        </div>
    </div>
</template>
