<script setup lang="ts">
import Button from '@src/components/ui/Button.vue'
import FormError from '@src/components/form/FormError.vue'
import FormInputError from '@src/components/form/FormInputError.vue'
import FormInputText from '@src/components/form/FormInputText.vue'
import FormLabel from '@src/components/form/FormLabel.vue'
import FormSelect from '@src/components/form/FormSelect.vue'
import { FileDB } from '@src/stores/modules/file/types'
import Api from '@src/services'
import { ref, watch } from 'vue'

const emit = defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'update-file', value: FileDB): void,
}>()

const props = withDefaults(defineProps<Readonly<{
    file?: FileDB,
    open?: boolean,
}>>(), {
    open: false,
})

const errors = ref<{
    form?: string,
    name?: string,
    visibility?: string,
}>({})
const isLoading = ref(false)
const emails = ref([]) // For 'shared' visibility
const name = ref(props.file?.name ?? '')
const visibility = ref(props.file?.visibility ?? 'Private')

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
        const { data } = await Api.put(`/files/${props.file.uuid}/`, {
                            name: name.value,
                            visibility: visibility.value.toLowerCase(),
                        })

        emit('update-file', data.file)
    } catch (err: any) {

    } finally {
        isLoading.value = false
    }
}
function setInputs(): void {
    name.value = props.file?.name
    visibility.value = props.file?.visibility
}

watch(() => props.open, (newValue) => {
    if (newValue) {
        document.body.style['overflowY'] = 'hidden'

        isLoading.value = false
        errors.value = {}

        setInputs()
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
            <div class="mb-3">
                <span class="block font-bold text-center text-3xl">Update file</span>

                <form
                    @submit.prevent="updateFile"
                    class="flex flex-col gap-6"
                >
                    <FormError v-if="errors.form" :msg="errors.form" />

                    <div>
                        <FormLabel for="name" text="Name" class="mb-1.5" />

                        <div class="flex flex-col gap-1.5">
                            <FormInputText
                                v-model="name"
                                id="name"
                                :disabled="isLoading"
                                :error-message="errors.name"
                                :maxLength="255"
                                :minLengt="1"
                                required
                            />

                            <FormInputError v-if="errors.name" :msg="errors.name" />
                        </div>
                    </div>

                    <div>
                        <FormLabel for="visibility" text="Visibility" class="mb-1.5" />

                        <div class="flex flex-col gap-1.5">
                            <FormSelect
                                v-model="visibility"
                                :disabled="isLoading"
                                :options="['Private', 'Public', 'Shared']"
                                :error-message="errors.visibility"
                                required
                            />

                            <FormInputError v-if="errors.visibility" :msg="errors.visibility" />
                        </div>
                    </div>
                </form>
            </div>

            <div
                class="flex flex-col flex-grow flex-shrink gap-3
                md:flex-row-reverse"
            >
                <Button
                    @click="updateFile"
                    :disabled="isLoading"
                    level="primary"
                    class="flex-grow flex-shrink font-semibold rounded-full! text-lg"
                >Update</Button>

                <Button
                    @click="close"
                    :disabled="isLoading"
                    class="flex-grow flex-shrink font-semibold rounded-full! text-lg"
                >Cancel</Button>
            </div>
        </div>
    </div>
</template>
