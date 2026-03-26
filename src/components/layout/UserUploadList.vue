<script setup lang="ts">
import IconMDIArrowRotateLeft from '@src/components/svg/mdi/ArrowRotateLeft.vue'
import IconMDICheckCircle from '@src/components/svg/mdi/CheckCircle.vue'
import IconMDIClose from '@src/components/svg/mdi/Close.vue'
import IconMDIError from '@src/components/svg/mdi/Error.vue'
import IconMDILoading from '@src/components/svg/mdi/Loading.vue'
import { UploadList } from '@src/stores/modules/file/types'

defineEmits<{
    (eventName: 'cancel'): void,
    (eventName: 'remove'): void,
    (eventName: 'retry'): void,
}>()

const props = defineProps<{
    item: UploadList,
}>()
</script>

<template>
    <div class="flex flex-grow-0 flex-row flex-shrink-0 gap-3 items-center max-w-full overflow-ellipsis overflow-hidden p-3 whitespace-nowrap w-full">
        <div class="flex-grow-0 flex-shrink-0 relative size-12">
            <div class="bg-stone-300 flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-full">
                <!-- Icons -->
            </div>
            
            <!-- Upload status -->
            <div class="absolute bg-white bottom-0 flex flex-grow-0 flex-shrink-0 items-center justify-center -right-1 rounded-full size-6">
                <IconMDICheckCircle
                    v-if="item.status === 'success'"
                    color="#00A63E"
                    :size="18"
                />
                <IconMDIError
                    v-else-if="item.status === 'error'"
                    :size="18"
                />
                <IconMDILoading
                    v-else-if="item.status === 'processing' || item.status === 'uploading'"
                    :size="16"
                />
            </div>
        </div>

        <span class="block flex-grow flex-shrink overflow-ellipsis overflow-hidden whitespace-nowrap">
            {{ item.name }}
        </span>

        <button
            v-if="item.status === 'success'"
            @click="$emit('remove')"
            type="button"
            class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9"
        >
            <IconMDIClose :size="18" />
        </button>
        <div
            v-else-if="item.status === 'error'"
            class="flex flex-grow-0 flex-shrink-0 items-center"
        >
            <button
                @click="$emit('retry')"
                type="button"
                class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9"
            >
                <IconMDIArrowRotateLeft :size="18" />
            </button>

            <button
                @click="$emit('remove')"
                type="button"
                class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9"
            >
                <IconMDIClose :size="18" />
            </button>
        </div>
        <div
            v-else-if="item.status === 'uploading'"
            class="flex flex-grow-0 flex-shrink-0 items-center justify-center rounded-full size-9 text-sm"
        >
            {{ item.progress }}%
        </div>
    </div>
</template>
