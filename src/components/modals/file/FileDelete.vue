<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import ModalBase from '../ModalBase.vue'
import { deletePermanently } from '@/services/file.service'
import { FileDB } from '@/types/file'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const emit = defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'deleted', uuid: string): void
}>()

const props = withDefaults(defineProps<Readonly<{
    file: FileDB | null,
    open?: boolean
}>>(), {
    open: false
})

const errors = ref<{
    form?: string
}>()
const isLoading = ref(false)

const bodyText = computed<string>(() => {
    if (!props.file) {
        return 'No file detected, could not restore file right now.'
    }

    return `Restore "${props.file.name}.${props.file.extension}" from trash?`
})

function close(): void {
    emit('close')
}
function resetRefs(loading = false): void {
    isLoading.value = loading
    errors.value = {}
}
async function handleClick(): Promise<void> {
    if (!props.file || isLoading.value) {
        return
    }

    resetRefs(true)

    try {
        const { used_bytes } = await deletePermanently(props.file.uuid)

        // Update user's used_bytes
        store.commit('auth/SET_USED_BYTES', used_bytes)

        emit('deleted', props.file.uuid)
    } catch (err: unknown) {
        console.warn('Error when deleting file:')
        console.error(err)
    } finally {
        isLoading.value = false
    }
}

watch(() => props.open, (): void => {
    resetRefs(false)
})
</script>

<template>
    <ModalBase
        v-if="$props.open"
        @click="$emit('close')"
        class="flex items-end p-3
        md:items-center md:justify-center md:p-0"
    >
        <div
            class="bg-white flex flex-col gap-3 p-6 relative rounded-xl w-full z-[2]
            md:max-w-md md:p-9 md:rounded-3xl"
        >
            <span class="font-bold text-lg">Delete forever</span>

            <div
                v-text="bodyText"
                class="wrap-break-word"
            ></div>

            <div class="flex flex-grow flex-row flex-shrink gap-3 items-center justify-end">
                <Button
                    @click="$emit('close')"
                    :disabled="isLoading"
                    class="flex-grow-0 flex-shrink-0 font-semibold rounded-full! text-lg"
                >Cancel</Button>

                <Button
                    v-if="$props.file"
                    @click="handleClick"
                    :disabled="isLoading"
                    level="danger"
                    class="flex-grow-0 flex-shrink-0 font-semibold rounded-full! text-lg"
                >Confirm</Button>
            </div>
        </div>
    </ModalBase>
</template>
