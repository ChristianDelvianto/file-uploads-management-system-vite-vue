<script setup lang="ts">
import Button from '@src/components/ui/Button.vue'
import FormError from '@src/components/form/FormError.vue'
import FormInputError from '@src/components/form/FormInputError.vue'
import FormInputText from '@src/components/form/FormInputText.vue'
import FormLabel from '@src/components/form/FormLabel.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const store = useStore()
const router = useRouter()

const errors = ref<{
    form?: string,
    email?: string,
    password?: string
}>({})
const email = ref('')
const password = ref('')
const isLoading = ref(false)

async function handleSubmitError(err: any): Promise<void> {
    console.error('Error during login:', err)

    if (err.response?.status === 422) {
        const apiErrors = err.response.data?.errors ?? {}

        Object.entries(apiErrors).forEach(([key, value]) => {
            errors.value[key] = value[0]
        })

        return
    }

    errors.value.form = 'Something went wrong, please try again'
}
async function handleSubmit(): Promise<void> {
    isLoading.value = true
    errors.value = {}

    try {
        const { role } = await store.dispatch('auth/login', { email: email.value, password: password.value })

        await router.replace({
            name: `${role}.dashboard`,
        })
    } catch (err) {
        await handleSubmitError(err)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div
        class="min-h-screen w-full
        sm:bg-stone-300/60 sm:flex sm:items-center sm:justify-center"
    >
        <form
            @submit.prevent="handleSubmit"
            class="bg-white flex flex-col gap-3 px-3 py-6 w-full
            sm:border sm:border-stone-300 sm:max-w-lg sm:p-9 sm:rounded-3xl sm:shadow-lg sm:shadow-stone-600/30"
        >
            <h1 class="font-bold text-3xl">Log in</h1>

            <FormError v-if="errors.form" :msg="errors.form" />

            <div>
                <FormLabel for="email" text="Email" class="mb-1.5" />

                <div class="flex flex-col gap-1.5">
                    <FormInputText
                        v-model="email"
                        id="email"
                        type="email"
                        :disabled="isLoading"
                        :error-message="errors.email"
                        :maxLength="255"
                        required
                    />

                    <FormInputError v-if="errors.email" :msg="errors.email" />
                </div>
            </div>

            <div>
                <FormLabel for="password" text="Password" class="mb-1.5" />

                <div class="flex flex-col gap-1.5">
                    <FormInputText
                        v-model="password"
                        id="password"
                        type="password"
                        :disabled="isLoading"
                        :error-message="errors.password"
                        :maxLength="255"
                        :minLength="8"
                        required
                    />

                    <FormInputError v-if="errors.password" :msg="errors.password" />
                </div>
            </div>

            <Button
                :disabled="isLoading"
                level="primary"
                type="submit"
                class="font-semibold"
            >Log in</Button>
        </form>
    </div>
</template>
