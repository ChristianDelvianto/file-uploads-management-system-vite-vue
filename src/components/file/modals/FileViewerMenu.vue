<script setup lang="ts">
import IconMDIAccessTime from '@src/components/svg/mdi/AccessTime.vue'
import IconMDIFileEditOutline from '@src/components/svg/mdi/FileEditOutline.vue'
import IconMDIInformationOutline from '@src/components/svg/mdi/InformationOutline.vue'
import IconMDITrayDownload from '@src/components/svg/mdi/TrayDownload.vue'

defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'toggleLayout', value: string | null): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    open?: boolean
}>>(), {
    open: false,
})
</script>

<template>
    <div
        v-if="$props.open"
        class="bg-gray-900/60 flex fixed inset-0 items-end z-10"
    >
        <button
            @click="$emit('close')"
            type="button"
            class="absolute bg-transparent inset-0 z-1"
            title="View this file"
        >
            <span class="hidden">Close</span>
        </button>

        <div class="bg-white flex flex-col gap-1.5 p-3 relative rounded-t-xl w-full z-[2]">
            <div class="flex flex-col">
                <button
                    @click="$emit('toggleLayout', 'detail')"
                    type="button"
                    class="flex flex-grow flex-row flex-shrink gap-3 items-center px-1.5 py-3 text-lg"
                >
                    <IconMDIInformationOutline class="flex-grow-0 flex-shrink-0" />

                    Detail
                </button>
                
                <button
                    @click="$emit('toggleLayout', 'logs')"
                    type="button"
                    class="flex flex-grow flex-row flex-shrink gap-3 items-center px-1.5 py-3 text-lg"
                >
                    <IconMDIAccessTime class="flex-grow-0 flex-shrink-0" />

                    View logs
                </button>

                <button
                    @click="$emit('toggleLayout', 'edit')"
                    type="button"
                    class="flex flex-grow flex-row flex-shrink gap-3 items-center px-1.5 py-3 text-lg"
                >
                    <IconMDIFileEditOutline class="flex-grow-0 flex-shrink-0" />

                    Edit
                </button>
                
                <button
                    @click="$emit('toggleLayout', 'download')"
                    type="button"
                    class="flex flex-grow flex-row flex-shrink gap-3 items-center px-1.5 py-3 text-lg"
                >
                    <IconMDITrayDownload class="flex-grow-0 flex-shrink-0" />

                    Download
                </button>
            </div>

            <button
                @click="$emit('close')"
                type="button"
                class="bg-gray-300/60 font-semibold py-1.5 rounded-full text-center text-lg"
            >Close</button>
        </div>
    </div>
</template>
