<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import FormError from '@/components/form/FormError.vue'
import FormInputError from '@/components/form/FormInputError.vue'
import FormInputText from '@/components/form/FormInputText.vue'
import FormSelect from '@/components/form/FormSelect.vue'
import IconMDIClose from '@/components/svg/mdi/Close.vue'
import ModalBase from '../ModalBase.vue'
import { MAXIMUM_SHARED_USERS_LENGTH } from '@/const/file'
import { updateVisibility } from '@/services/file.service'
import { FileDB, FileVisibility, Shared } from '@/types/file'
import { ref, watch } from 'vue'

const emit = defineEmits<{
    (eventName: 'close'): void,
    (eventName: 'not-found'): void,
    (eventName: 'updated', value: FileDB): void
}>()

const props = withDefaults(defineProps<Readonly<{
    file: FileDB | null,
    open?: boolean
}>>(), {
    open: false
})

const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)
const shared = ref<Shared[]>([])
const visibility = ref<FileVisibility>('private')
const visibilityOptions = ['private', 'public', 'shared']

function addUser(): void {
    if (shared.value.length === MAXIMUM_SHARED_USERS_LENGTH) {
        return
    }

    shared.value.push({
        id: new Date().getTime(),
        photo: null,
        email: ''
    })
}
function removeUser(id: number): void {
    console.warn('removeUser() id: ', id)

    shared.value = shared.value.filter(user => user.id !== id)
}
function resetRefs(): void {
    isLoading.value = false
    errors.value = {}
    shared.value = []
    visibility.value = 'private'
}
async function handleSubmit(): Promise<void> {
    if (!props.file || isLoading.value) {
        return
    }

    isLoading.value = true
    errors.value = {}

    try {
        let emails: string[] = []

        if (shared.value.length !== 0) {
            emails = shared.value.map(user => user.email)
        }

        const { file } = await updateVisibility(props.file.uuid, visibility.value, emails)

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

    visibility.value = props.file.visibility

    if (props.file.shared.length !== 0) {
        props.file.shared.forEach(user => {
            shared.value.push({
                id: user.id,
                photo: user.photo,
                email: user.email
            })
        })
    }
}

watch(() => props.open, (newValue): void => {
    resetRefs()

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
            <span class="font-bold text-lg">Manage visibility</span>

            <div class="flex flex-col gap-3">
                <FormError v-if="errors.form" :message="errors.form" />

                <div class="flex flex-col gap-3">
                    <FormSelect
                        v-model="visibility"
                        :disabled="isLoading"
                        :options="visibilityOptions"
                        class="border border-stone-600/30 font-semibold px-0! rounded-lg! text-[16px]
                        sm:px-1.5!
                        md:border-stone-600/60"
                    />

                    <FormInputError v-if="errors.name" :message="errors.name" />
                </div>

                <div
                    v-if="visibility === 'shared'"
                    class="flex flex-col gap-3 mb-1.5"
                >
                    <div class="flex flex-grow flex-row flex-shrink items-center justify-between">
                        <span class="font-bold text-lg">Share with</span>

                        <button
                            @click="addUser"
                            :disabled="isLoading"
                            type="button"
                            class=""
                        >Add more</button>
                    </div>

                    <div
                        v-for="user in shared"
                        :key="user.id"
                        class="flex flex-grow flex-row flex-shrink gap-3 items-center w-full"
                    >
                        <FormInputText
                            v-model="user.email"
                            type="email"
                            :disabled="isLoading"
                            :maxLength="255"
                            required
                            class="border border-stone-600/30 font-semibold rounded-lg! w-full
                            md:border-stone-600/60"
                        />

                        <button
                            @click="removeUser(user.id)"
                            type="button"
                            class="flex flex-grow-0 flex-shrink-0 items-center justify-center size-8"
                        >
                            <IconMDIClose />
                        </button>
                    </div>
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
