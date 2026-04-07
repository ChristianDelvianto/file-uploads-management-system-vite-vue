<script setup lang="ts">
import Button from '@src/components/ui/Button.vue'
import Api from '@src/services'
import { FileDB } from '@src/stores/modules/file/types'
import { ref, watch } from 'vue'

const emit = defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'delete-file', uuid: string): void,
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
    console.log('FileDelete close() invoked')

    if (!isLoading.value) {
        emit('close')
    }
}
async function deleteFile(): Promise<void> {
    isLoading.value = true
    errors.value = {}

    try {
        await Api.delete(`/files/${props.file!.uuid}`)

        emit('delete-file', props.file!.uuid)
    } catch (err: any) {
        console.warn('Error when deleting file:')
        console.error(err)
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
        class="bg-black/80 flex fixed inset-0 items-end p-3 z-10
        md:items-center md:justify-center md:p-0"
    >
        <!-- Click to close -->
        <button
            @click="close"
            type="button"
            class="absolute bg-transparent inset-0 z-1"
            title="Close"
        >
            <span class="hidden">Close</span>
        </button>

        <div
            class="bg-white flex flex-col gap-1.5 p-6 relative rounded-xl w-full z-[2]
            md:max-w-md md:p-9 md:rounded-3xl"
        >
            <div>
                <span class="block font-bold text-center text-3xl">Delete file</span>

                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti cum laboriosam maiores velit architecto sequi nisi eum quibusdam provident doloremque, repudiandae alias quas, doloribus possimus minus inventore porro reprehenderit quisquam sit assumenda voluptas sint rerum ratione culpa. Sunt, recusandae temporibus.
            </div>

            <div
                class="flex flex-col flex-grow flex-shrink gap-3
                md:flex-row-reverse"
            >
                <Button
                    @click="deleteFile"
                    :disabled="isLoading"
                    level="danger"
                    class="flex-grow flex-shrink font-semibold rounded-full! text-lg"
                >Delete</Button>

                <Button
                    @click="close"
                    :disabled="isLoading"
                    class="flex-grow flex-shrink font-semibold rounded-full! text-lg"
                >Cancel</Button>
            </div>
        </div>
    </div>
</template>
