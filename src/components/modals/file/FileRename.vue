<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import FormError from '@/components/form/FormError.vue'
import FormInputError from '@/components/form/FormInputError.vue'
import FormInputText from '@/components/form/FormInputText.vue'
import ModalBase from '../ModalBase.vue'
import { updateName } from '@/services/file.service'
import { FileDB } from '@/types/file'
import { ref, watch } from 'vue'

const emit = defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'updated', value: FileDB): void
}>()

const props = withDefaults(defineProps<Readonly<{
    file: FileDB | null,
    open?: boolean
}>>(), {
    open: false
})

const errors = ref<{
    form?: string,
    name?: string
}>({})
const isLoading = ref(false)
const name = ref('')

function resetRefs(loading = false): void {
    isLoading.value = loading
    errors.value = {}
}
async function handleSubmit(): Promise<void> {
    if (!props.file || isLoading.value) {
        return
    }

    resetRefs(true)

    try {
        const { file } = await updateName(props.file.uuid, name.value)

        emit('updated', file)

        // Close the modal after update
        emit('close')
    } catch (err: unknown) {
        console.warn('Error when updating file:')
        console.error(err)
    } finally {
        isLoading.value = false
    }
}
function setInputValue(): void {
    if (!props.file) {
        return
    }

    name.value = props.file.name
}

watch(() => props.open, (newValue): void => {
    resetRefs(false)

    if (newValue) {
        setInputValue()
    }
})
</script>

<template>
    <ModalBase
        v-if="$props.open"
        @close="$emit('close')"
        class="flex items-end p-3
        md:items-center md:justify-center md:p-0"
    >
        <form
            @submit.prevent="handleSubmit"
            class="bg-white flex flex-col gap-3 p-6 relative rounded-xl w-full z-[2]
            md:max-w-md md:p-9 md:rounded-3xl"
        >
            <span class="font-bold text-lg">Rename file</span>

            <div class="flex flex-col gap-3">
                <FormError v-if="errors.form" :message="errors.form" />

                <div class="flex flex-col gap-3">
                    <FormInputText
                        v-model="name"
                        id="name"
                        :disabled="isLoading"
                        :error-message="errors.name"
                        :maxLength="255"
                        :minLengt="1"
                        required
                    />

                    <FormInputError v-if="errors.name" :message="errors.name" />
                </div>
            </div>

            <div class="flex flex-grow flex-row flex-shrink gap-3 items-center justify-end">
                <Button
                    @click="$emit('close')"
                    :disabled="isLoading"
                    class="flex-grow-0 flex-shrink-0 font-semibold rounded-full! text-lg"
                >Cancel</Button>

                <Button
                    @click="handleSubmit"
                    :disabled="isLoading"
                    level="primary"
                    class="flex-grow-0 flex-shrink-0 font-semibold rounded-full! text-lg"
                >Update</Button>
            </div>
        </form>
    </ModalBase>
</template>
