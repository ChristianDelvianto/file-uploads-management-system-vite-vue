<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import FormError from '@/components/form/FormError.vue'
import FormInputError from '@/components/form/FormInputError.vue'
import FormInputText from '@/components/form/FormInputText.vue'
import FormLabel from '@/components/form/FormLabel.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { isAxiosError } from 'axios'
import { LoginFormInputs } from '@/types/auth'
const store = useStore()
const router = useRouter()

const errors = ref<Partial<Record<LoginFormInputs, string>>>({})
const inputEmail = ref('')
const inputPassword = ref('')
const isLoading = ref(false)

function handleSubmitError(err: unknown): void {
    if (isAxiosError(err) && err.response?.status === 422) {
        const apiErrors = err.response.data?.errors as Record<string, string[]> | null

        if (apiErrors) {
            Object.entries(apiErrors).forEach(([key, value]) => {
                if (key === 'email' || key === 'password') {
                    errors.value[key] = value[0]
                }
            })

            return
        }
    }

    errors.value.form = 'Something went wrong, please try again'
}
async function handleSubmit(): Promise<void> {
    if (isLoading.value) {
        return
    }

    isLoading.value = true
    errors.value = {}

    const inputs = {
        email: inputEmail.value,
        password: inputPassword.value
    }

    try {
        await store.dispatch('auth/login', inputs)

        await router.replace({ name: 'user.dashboard' })
    } catch (err: unknown) {
        handleSubmitError(err)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div
        class="min-h-screen w-full
        sm:bg-stone-300/40 sm:flex sm:items-center sm:justify-center"
    >
        <form
            @submit.prevent="handleSubmit"
            class="bg-white flex flex-col gap-3 px-3 py-6 w-full
            sm:border sm:border-stone-300 sm:max-w-lg sm:p-9 sm:rounded-3xl sm:shadow-lg sm:shadow-stone-600/40"
        >
            <h1 class="font-bold text-3xl">Log in</h1>

            <FormError v-if="errors.form" :message="errors.form" />

            <div>
                <FormLabel for="email" text="Email" class="mb-1.5" />

                <div class="flex flex-col gap-1.5">
                    <FormInputText
                        v-model="inputEmail"
                        id="email"
                        type="email"
                        :disabled="isLoading"
                        :error-message="errors.email"
                        :maxLength="255"
                        required
                        test-id="email"
                    />

                    <FormInputError v-if="errors.email" :message="errors.email" />
                </div>
            </div>

            <div>
                <FormLabel for="password" text="Password" class="mb-1.5" />

                <div class="flex flex-col gap-1.5">
                    <FormInputText
                        v-model="inputPassword"
                        id="password"
                        type="password"
                        :disabled="isLoading"
                        :error-message="errors.password"
                        :maxLength="255"
                        :minLength="8"
                        required
                        test-id="password"
                    />

                    <FormInputError v-if="errors.password" :message="errors.password" />
                </div>
            </div>

            <Button
                :disabled="isLoading"
                level="primary"
                type="submit"
                class="font-semibold!"
                test-id="submit"
            >Log in</Button>
        </form>
    </div>
</template>
