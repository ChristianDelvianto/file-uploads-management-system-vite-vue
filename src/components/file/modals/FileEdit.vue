<script setup lang="ts">
import Button from '@src/components/ui/Button.vue'
import { FileDB } from '@src/stores/modules/file/types'
import Api from '@src/services'
import { ref, watch } from 'vue'

const emit = defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'update:file', value: FileDB): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    file?: FileDB,
    open?: boolean,
}>>(), {
    open: false,
})

const errors = ref<{
    form?: string,
}>()
const isLoading = ref(false)

function close(): void {
    console.log('FileEdit close() invoked')

    if (!isLoading.value) {
        emit('close')
    }
}
async function updateFile(): Promise<void> {
    isLoading.value = true
    errors.value = {}

    try {

    } catch (err: any) {

    } finally {
        isLoading.value = false
    }
}

watch(() => props.open, (newValue) => {
    if (newValue) {
        document.body.style['overflowY'] = 'hidden'

        isLoading.value = false
        errors.value = {}
    } else {
        document.body.style['overflowY'] = 'scroll'
    }
})
</script>

<template>
    <div
        v-if="$props.open"
        class="bg-gray-900/80 fixed min-h-screen inset-0 z-60"
    >
        <!-- Click to close -->
        <div
            @click="close"
            class="bg-transparent fixed inset-0 size-full z-0"
        ></div>


    </div>
</template>
